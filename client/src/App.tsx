import { useState, useEffect } from 'react'
import { io, Socket } from 'socket.io-client'
import type { Message } from './types/message'
import { LoginScreen } from './components/auth/LoginScreen'
import { ChatHeader } from './components/chat/ChatHeader'
import { MessageList } from './components/chat/MessageList'
import { ChatInput } from './components/chat/ChatInput'
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
        })

        newSocket.on('disconnect', () => {
            setIsConnected(false)
            setToast({ message: 'Desconectado do servidor', type: 'error', isVisible: true })
        })

        newSocket.on('message', (message: Message) => {
            setMessages((prev) => [...prev, message])
        })

        newSocket.on('userJoined', (user) => {
            const systemMessage: Message = {
                id: `system-${Date.now()}-joined`,
                userId: 'system',
                username: 'Sistema',
                content: `${user.username} entrou no chat`,
                timestamp: new Date()
            }
            setMessages((prev) => [...prev, systemMessage])
        })

        newSocket.on('userLeft', (user) => {
            const systemMessage: Message = {
                id: `system-${Date.now()}-left`,
                userId: 'system',
                username: 'Sistema',
                content: `${user.username} saiu do chat`,
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

    const handleSetUsername = (e: React.FormEvent) => {
        e.preventDefault()
        if (username.trim() && socket) {
            socket.emit('joinRoom', username)
            setHasEnteredChat(true)
        }
    }

    const handleLogout = () => {
        setUsername('')
        setMessages([])
        setHasEnteredChat(false)
    }

    const handleReactionToggle = (messageId: string, emoji: string) => {
        if (socket) {
            socket.emit('toggleReaction', messageId, emoji)
        }
    }

    if (!hasEnteredChat) {
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

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-violet-100 via-pink-50 to-blue-100 dark:from-gray-900 dark:via-violet-950 dark:to-gray-900 p-4">
                <div className="max-w-4xl mx-auto h-[calc(100vh-2rem)] flex flex-col shadow-2xl shadow-violet-500/10 rounded-2xl overflow-hidden">
                    <ChatHeader
                        username={username}
                        isConnected={isConnected}
                        onLogout={handleLogout}
                        onlineUsers={onlineUsers}
                    />
                    <MessageList
                        messages={messages}
                        currentUsername={username}
                        currentUserId={userId}
                        usersTyping={usersTyping}
                        onReactionToggle={handleReactionToggle}
                    />
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
