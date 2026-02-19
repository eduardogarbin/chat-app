import { useState, useEffect } from 'react'
import { io, Socket } from 'socket.io-client'
import type { Message } from './types/message'
import type { Room } from './types/room'
import { LoginScreen } from './components/auth/LoginScreen'
import { RoomSelectScreen } from './components/auth/RoomSelectScreen'
import { ChatHeader } from './components/chat/ChatHeader'
import { MessageList } from './components/chat/MessageList'
import { ChatInput } from './components/chat/ChatInput'
import { RoomList } from './components/rooms/RoomList'
import { Toast } from './components/ui/Toast'

function App() {
    const [socket, setSocket] = useState<Socket | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [inputMessage, setInputMessage] = useState('')
    const [username, setUsername] = useState('')
    const [userId, setUserId] = useState('')
    const [isConnected, setIsConnected] = useState(false)
    const [hasEnteredChat, setHasEnteredChat] = useState(false)
    const [onlineUsers, setOnlineUsers] = useState(0)
    const [usersTyping, setUsersTyping] = useState<string[]>([])

    // Estado de salas
    const [rooms, setRooms] = useState<Room[]>([])
    const [currentRoom, setCurrentRoom] = useState<Room | null>(null)

    // Controla em qual etapa do login o usuário está:
    // 'username' → preencher o nome | 'room' → escolher a sala
    const [loginStep, setLoginStep] = useState<'username' | 'room'>('username')

    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; isVisible: boolean }>({
        message: '',
        type: 'info',
        isVisible: false
    })

    useEffect(() => {
        const newSocket = io('http://localhost:3000')
        setSocket(newSocket)
        setUserId(newSocket.id || '')

        newSocket.on('connect', () => {
            setIsConnected(true)
            setUserId(newSocket.id || '')
            setToast({ message: 'Conectado ao servidor', type: 'success', isVisible: true })

            // Pede a lista de salas logo ao conectar, para já ter os dados
            // disponíveis quando o usuário chegar na tela de seleção de sala.
            newSocket.emit('getRooms')
        })

        newSocket.on('disconnect', () => {
            setIsConnected(false)
            setToast({ message: 'Desconectado do servidor', type: 'error', isVisible: true })
        })

        // Recebe a lista de salas do servidor e armazena no estado.
        newSocket.on('roomsList', (roomsList: Room[]) => {
            setRooms(roomsList)
        })

        newSocket.on('message', (message: Message) => {
            setMessages((prev) => [...prev, message])
        })

        // Ao entrar em uma sala, o servidor envia o histórico de mensagens.
        // Substituímos as mensagens atuais pelo histórico — isso garante que
        // ao trocar de sala o usuário veja as mensagens corretas daquela sala.
        newSocket.on('messageHistory', (history: Message[]) => {
            setMessages(history)
        })

        newSocket.on('userJoined', (user) => {
            const systemMessage: Message = {
                id: `system-${Date.now()}-joined`,
                userId: 'system',
                username: 'Sistema',
                content: `${user.username} entrou na sala`,
                timestamp: new Date()
            }
            setMessages((prev) => [...prev, systemMessage])
        })

        newSocket.on('userLeft', (user) => {
            const systemMessage: Message = {
                id: `system-${Date.now()}-left`,
                userId: 'system',
                username: 'Sistema',
                content: `${user.username} saiu da sala`,
                timestamp: new Date()
            }
            setMessages((prev) => [...prev, systemMessage])
        })

        newSocket.on('roomUsers', (users) => {
            setOnlineUsers(users.length)
        })

        newSocket.on('userTyping', (username: string) => {
            setUsersTyping((prev) => {
                if (!prev.includes(username)) {
                    return [...prev, username]
                }
                return prev
            })
        })

        newSocket.on('userStoppedTyping', (username: string) => {
            setUsersTyping((prev) => prev.filter((u) => u !== username))
        })

        newSocket.on('messageUpdated', (updatedMessage: Message) => {
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === updatedMessage.id ? updatedMessage : msg
                )
            )
        })

        newSocket.on('error', (errorMessage) => {
            alert(`Erro: ${errorMessage}`)
        })

        return () => {
            newSocket.close()
        }
    }, [])

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault()
        if (inputMessage.trim() && socket && username) {
            socket.emit('sendMessage', inputMessage)
            setInputMessage('')
        }
    }

    // Etapa 1 do login: valida o nome e avança para a seleção de sala.
    const handleSetUsername = (e: React.FormEvent) => {
        e.preventDefault()
        if (username.trim()) {
            setLoginStep('room')
        }
    }

    // Etapa 2 do login: entra na sala escolhida e exibe o chat.
    const handleJoinRoom = (room: Room) => {
        if (socket) {
            socket.emit('joinRoom', username, room.id)
            setCurrentRoom(room)
            setHasEnteredChat(true)
        }
    }

    // Troca de sala durante o chat: o servidor cuidará de sair da sala
    // antiga e entrar na nova. As mensagens são limpas aqui e recarregadas
    // pelo evento messageHistory que o servidor envia ao entrar na sala.
    const handleSwitchRoom = (room: Room) => {
        if (socket && room.id !== currentRoom?.id) {
            setMessages([])
            setUsersTyping([])
            socket.emit('joinRoom', username, room.id)
            setCurrentRoom(room)
        }
    }

    const handleLogout = () => {
        setUsername('')
        setMessages([])
        setCurrentRoom(null)
        setHasEnteredChat(false)
        setLoginStep('username')
    }

    const handleReactionToggle = (messageId: string, emoji: string) => {
        if (socket) {
            socket.emit('toggleReaction', messageId, emoji)
        }
    }

    // --- Telas de login ---
    if (!hasEnteredChat) {
        if (loginStep === 'room') {
            return (
                <>
                    <RoomSelectScreen
                        username={username}
                        rooms={rooms}
                        onSelectRoom={handleJoinRoom}
                        onBack={() => setLoginStep('username')}
                    />
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        isVisible={toast.isVisible}
                        onClose={() => setToast({ ...toast, isVisible: false })}
                    />
                </>
            )
        }

        return (
            <>
                <LoginScreen
                    username={username}
                    setUsername={setUsername}
                    onSubmit={handleSetUsername}
                />
                <Toast
                    message={toast.message}
                    type={toast.type}
                    isVisible={toast.isVisible}
                    onClose={() => setToast({ ...toast, isVisible: false })}
                />
            </>
        )
    }

    // --- Chat principal ---
    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-violet-100 via-pink-50 to-blue-100 dark:from-gray-900 dark:via-violet-950 dark:to-gray-900 p-4">
                <div className="max-w-4xl mx-auto h-[calc(100vh-2rem)] flex flex-col shadow-2xl shadow-violet-500/10 rounded-2xl overflow-hidden">
                    <ChatHeader
                        username={username}
                        isConnected={isConnected}
                        onLogout={handleLogout}
                        onlineUsers={onlineUsers}
                        currentRoom={currentRoom}
                    />

                    {/* Área principal: sidebar de salas + lista de mensagens */}
                    <div className="flex flex-1 overflow-hidden">
                        <RoomList
                            rooms={rooms}
                            currentRoom={currentRoom}
                            onSelectRoom={handleSwitchRoom}
                        />
                        <MessageList
                            messages={messages}
                            currentUsername={username}
                            currentUserId={userId}
                            usersTyping={usersTyping}
                            onReactionToggle={handleReactionToggle}
                        />
                    </div>

                    <ChatInput
                        inputMessage={inputMessage}
                        setInputMessage={setInputMessage}
                        onSubmit={handleSendMessage}
                        socket={socket}
                    />
                </div>
            </div>
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={() => setToast({ ...toast, isVisible: false })}
            />
        </>
    )
}

export default App
