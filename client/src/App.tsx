/**
 * @file App.tsx
 * @module LoroChat/App
 *
 * @description
 * Componente raiz da aplicação LoroChat.
 * Orquestrador central de estado, conexão WebSocket e navegação.
 *
 * @remarks
 * Arquitetura monolítica centralizada:
 * - Gerencia ~15 useState hooks
 * - Controla todas as conexões Socket.io
 * - Define fluxo de navegação (login → rooms → chat)
 * - Distribui estado para componentes filhos via props
 *
 * Estado Global:
 * - Conexão: socket, userId, isConnected
 * - Autenticação: username, hasEnteredChat, loginStep
 * - Chat: messages, inputMessage, onlineUsers, usersTyping
 * - Salas: rooms, currentRoom
 * - UI: theme, toast
 *
 * Fluxo de Login (2 etapas):
 * 1. loginStep === 'username' → LoginScreen (entrada de nome)
 * 2. loginStep === 'room' → RoomSelectScreen (seleção de sala)
 * 3. hasEnteredChat === true → ChatHeader + RoomList + MessageList + ChatInput
 *
 * Integração Socket.io (Events):
 * - Emit: getRooms, joinRoom, sendMessage, toggleReaction, typing, stopTyping
 * - Listen: connect, disconnect, roomsList, message, messageHistory,
 *          userJoined, userLeft, roomUsers, userTyping, userStoppedTyping,
 *          messageUpdated, error
 *
 * @example
 * import App from './App'
 * ReactDOM.render(<App />, document.getElementById('root'))
 */

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

/**
 * Componente raiz da aplicação LoroChat.
 *
 * @returns Root JSX com gerenciamento completo de estado e navegação
 */
function App() {
    // ========== CONEXÃO & AUTENTICAÇÃO ==========
    /** Socket.io para comunicação em tempo real com servidor */
    const [socket, setSocket] = useState<Socket | null>(null)
    /** Nome do usuário logado */
    const [username, setUsername] = useState('')
    /** Socket ID do usuário (assinado pelo servidor) */
    const [userId, setUserId] = useState('')
    /** Se WebSocket está conectado */
    const [isConnected, setIsConnected] = useState(false)
    /** Se usuário já entrou no chat (passou pelo login) */
    const [hasEnteredChat, setHasEnteredChat] = useState(false)
    /** Etapa do login: 'username' ou 'room' */
    const [loginStep, setLoginStep] = useState<'username' | 'room'>('username')

    // ========== CHAT & MENSAGENS ==========
    /** Array de mensagens da sala atual */
    const [messages, setMessages] = useState<Message[]>([])
    /** Texto do input (controlado) */
    const [inputMessage, setInputMessage] = useState('')
    /** Número de usuários online na sala */
    const [onlineUsers, setOnlineUsers] = useState(0)
    /** Lista de nomes de usuários digitando */
    const [usersTyping, setUsersTyping] = useState<string[]>([])

    // ========== SALAS ==========
    /** Array de todas as salas disponíveis */
    const [rooms, setRooms] = useState<Room[]>([])
    /** Sala atualmente selecionada */
    const [currentRoom, setCurrentRoom] = useState<Room | null>(null)

    // ========== UI ==========
    /** Estado do toast (notificação) */
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; isVisible: boolean }>({
        message: '',
        type: 'info',
        isVisible: false
    })
    /** Tema ('light' ou 'dark') — inicializado com localStorage ou preferência do sistema */
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        const stored = localStorage.getItem('theme')
        if (stored === 'light' || stored === 'dark') return stored
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    })

    /**
     * Alterna entre light e dark mode.
     * Persiste a preferência em localStorage.
     */
    const toggleTheme = () => {
        setTheme(prev => {
            const next = prev === 'light' ? 'dark' : 'light'
            localStorage.setItem('theme', next)
            return next
        })
    }

    /**
     * Aplica classe 'dark' ao documentElement baseado no tema.
     * Tailwind usa essa classe para aplicar estilos dark mode.
     */
    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark')
    }, [theme])

    /**
     * Inicializa conexão WebSocket e registra todos os listeners.
     * Executa apenas uma vez na montagem do componente ([] dependency).
     *
     * @remarks
     * Socket.io Events:
     * - connect: Ao conectar, solicita lista de salas
     * - disconnect: Exibe notificação de desconexão
     * - roomsList: Recebe salas disponíveis
     * - message: Recebe nova mensagem (append)
     * - messageHistory: Recebe histórico ao entrar em sala (substituir)
     * - userJoined/userLeft: Mensagens do sistema
     * - roomUsers: Atualiza contagem online
     * - userTyping/userStoppedTyping: Indicador de digitação
     * - messageUpdated: Reação adicionada/removida
     * - error: Erro do servidor
     *
     * Cleanup: fecha socket ao desmontar o componente
     */
    useEffect(() => {
        const newSocket = io('http://localhost:3000')
        setSocket(newSocket)
        setUserId(newSocket.id || '')

        /**
         * Conexão estabelecida com sucesso.
         * Solicita lista de salas para ter dados prontos na RoomSelectScreen.
         */
        newSocket.on('connect', () => {
            setIsConnected(true)
            setUserId(newSocket.id || '')
            setToast({ message: 'Você está online!', type: 'success', isVisible: true })
            newSocket.emit('getRooms')
        })

        /**
         * Conexão perdida (desconexão intencional ou erro de rede).
         */
        newSocket.on('disconnect', () => {
            setIsConnected(false)
            setToast({ message: 'Conexão perdida. Você está offline!', type: 'error', isVisible: true })
        })

        /**
         * Recebe lista de salas disponíveis do servidor.
         * Armazenado no estado para exibição no RoomSelectScreen.
         */
        newSocket.on('roomsList', (roomsList: Room[]) => {
            setRooms(roomsList)
        })

        /**
         * Recebe nova mensagem em tempo real.
         * Adicionada ao fim do array (append).
         */
        newSocket.on('message', (message: Message) => {
            setMessages((prev) => [...prev, message])
        })

        /**
         * Recebe histórico de mensagens ao entrar em uma sala.
         * Substitui completamente o array de mensagens (não append).
         * Isso garante que ao trocar de sala o usuário veja as corretas.
         */
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

    // ========== HANDLERS: CHAT ==========

    /**
     * Envia uma mensagem para a sala atual.
     * Previne envio de mensagens vazias e requer socket conectado.
     *
     * @param e - Evento do formulário (prevent default)
     * @remarks
     * Emite 'sendMessage' para o servidor.
     * Limpa o input após envio.
     * Validação: trim não-vazio, socket conectado, username definido.
     */
    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault()
        if (inputMessage.trim() && socket && username) {
            socket.emit('sendMessage', inputMessage)
            setInputMessage('')
        }
    }

    // ========== HANDLERS: LOGIN (2 ETAPAS) ==========

    /**
     * Etapa 1 do login: valida nome e avança para seleção de sala.
     * Transição: LoginScreen → RoomSelectScreen
     *
     * @param e - Evento do formulário
     * @remarks
     * Apenas valida se username não está vazio.
     * Não há validação de caracteres especiais ou comprimento mínimo.
     */
    const handleSetUsername = (e: React.FormEvent) => {
        e.preventDefault()
        if (username.trim()) {
            setLoginStep('room')
        }
    }

    /**
     * Etapa 2 do login: entra na sala escolhida e exibe o chat.
     * Transição: RoomSelectScreen → ChatHeader + MessageList + ChatInput
     *
     * @param room - Sala a entrar
     * @remarks
     * Emite 'joinRoom' para servidor.
     * Define hasEnteredChat = true, que ativa renderização do chat.
     * Mensagens são carregadas via 'messageHistory' event.
     */
    const handleJoinRoom = (room: Room) => {
        if (socket) {
            socket.emit('joinRoom', username, room.id)
            setCurrentRoom(room)
            setHasEnteredChat(true)
        }
    }

    /**
     * Troca para uma sala diferente durante o chat.
     * Transição: sala A → sala B (ambas no chat)
     *
     * @param room - Sala destino
     * @remarks
     * Valida se é sala diferente da atual (previne emissão duplicada).
     * Limpa estado anterior (messages, usersTyping).
     * Emite 'joinRoom' para servidor.
     * Servidor responde com 'messageHistory' que repopula messages.
     * Impede troca para mesma sala.
     */
    const handleSwitchRoom = (room: Room) => {
        if (socket && room.id !== currentRoom?.id) {
            setMessages([])
            setUsersTyping([])
            socket.emit('joinRoom', username, room.id)
            setCurrentRoom(room)
        }
    }

    /**
     * Logout completo: retorna ao LoginScreen.
     * Transição: chat → LoginScreen (apaga username)
     *
     * @remarks
     * Apaga todos os dados do usuário e chat.
     * Socket permanece aberto para novo login.
     * Diferente de handleBackToRooms, que mantém username.
     */
    const handleLogout = () => {
        setUsername('')
        setMessages([])
        setCurrentRoom(null)
        setHasEnteredChat(false)
        setLoginStep('username')
    }

    /**
     * Volta para seleção de sala mantendo o username.
     * Transição: chat → RoomSelectScreen (mantém username)
     *
     * @remarks
     * Útil para mudar de sala sem re-digitar nome.
     * Socket permanece conectado.
     * Limpa apenas estado da sala (messages, currentRoom, usersTyping).
     * Diferente de handleLogout, que apaga username.
     */
    const handleBackToRooms = () => {
        setMessages([])
        setCurrentRoom(null)
        setUsersTyping([])
        setHasEnteredChat(false)
        setLoginStep('room')
    }

    // ========== HANDLERS: REAÇÕES ==========

    /**
     * Adiciona ou remove uma reação a uma mensagem.
     * Toggle: se o usuário já reagiu, remove; senão, adiciona.
     *
     * @param messageId - ID da mensagem a reagir
     * @param emoji - Emoji string (ex: "👍")
     * @remarks
     * Emite 'toggleReaction' para servidor.
     * Servidor responde com 'messageUpdated' atualizando a interface.
     * Apenas emite se socket está conectado.
     */
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
                        theme={theme}
                        toggleTheme={toggleTheme}
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
                    theme={theme}
                    toggleTheme={toggleTheme}
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
            <div className="min-h-screen bg-gradient-to-br from-violet-100 via-pink-50 to-blue-100 dark:from-gray-900 dark:via-violet-950 dark:to-gray-900 p-2 sm:p-4">
                <div className="max-w-4xl mx-auto h-[calc(100vh-1rem)] sm:h-[calc(100vh-2rem)] flex flex-col shadow-2xl shadow-violet-500/10 rounded-2xl overflow-hidden">
                    <ChatHeader
                        username={username}
                        isConnected={isConnected}
                        onLogout={handleLogout}
                        onBackToRooms={handleBackToRooms}
                        onlineUsers={onlineUsers}
                        currentRoom={currentRoom}
                        theme={theme}
                        toggleTheme={toggleTheme}
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
