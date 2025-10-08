import { useState, useEffect } from 'react'
import { io, Socket } from 'socket.io-client'
import type { Message } from './types/message'
import { LoginScreen } from './components/auth/LoginScreen'
import { ChatHeader } from './components/chat/ChatHeader'
import { MessageList } from './components/chat/MessageList'
import { ChatInput } from './components/chat/ChatInput'

function App() {
    const [socket, setSocket] = useState<Socket | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [inputMessage, setInputMessage] = useState('')
    const [username, setUsername] = useState('')
    const [isConnected, setIsConnected] = useState(false)
    const [hasEnteredChat, setHasEnteredChat] = useState(false)

    useEffect(() => {
        const newSocket = io('http://localhost:3000')
        setSocket(newSocket)

        newSocket.on('connect', () => {
            setIsConnected(true)
            console.log('Conectado ao servidor')
        })

        newSocket.on('disconnect', () => {
            setIsConnected(false)
            console.log('Desconectado do servidor')
        })

        newSocket.on('message', (message: Message) => {
            setMessages((prev) => [...prev, message])
        })

        return () => {
            newSocket.close()
        }
    }, [])

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault()
        if (inputMessage.trim() && socket && username) {
            const message: Message = {
                id: Date.now().toString(),
                text: inputMessage,
                sender: username,
                timestamp: new Date()
            }
            socket.emit('message', message)
            setInputMessage('')
        }
    }

    const handleSetUsername = (e: React.FormEvent) => {
        e.preventDefault()
        if (username.trim()) {
            setHasEnteredChat(true)
        }
    }

    const handleLogout = () => {
        setUsername('')
        setMessages([])
        setHasEnteredChat(false)
    }

    if (!hasEnteredChat) {
        return (
            <LoginScreen
                username={username}
                setUsername={setUsername}
                onSubmit={handleSetUsername}
            />
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
            <div className="max-w-4xl mx-auto h-[calc(100vh-2rem)] flex flex-col">
                <ChatHeader
                    username={username}
                    isConnected={isConnected}
                    onLogout={handleLogout}
                />
                <MessageList
                    messages={messages}
                    currentUsername={username}
                />
                <ChatInput
                    inputMessage={inputMessage}
                    setInputMessage={setInputMessage}
                    onSubmit={handleSendMessage}
                />
            </div>
        </div>
    )
}

export default App
