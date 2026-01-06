import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import type { Socket } from 'socket.io-client'

interface ChatInputProps {
    inputMessage: string
    setInputMessage: (message: string) => void
    onSubmit: (e: React.FormEvent) => void
    socket: Socket | null
}

export const ChatInput = ({ inputMessage, setInputMessage, onSubmit, socket }: ChatInputProps) => {
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const isTypingRef = useRef(false)

    useEffect(() => {
        if (!socket) return

        if (inputMessage.trim() && !isTypingRef.current) {
            socket.emit('typing')
            isTypingRef.current = true
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }

        typingTimeoutRef.current = setTimeout(() => {
            if (isTypingRef.current) {
                socket.emit('stopTyping')
                isTypingRef.current = false
            }
        }, 3000)

        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current)
            }
        }
    }, [inputMessage, socket])

    const handleSubmit = (e: React.FormEvent) => {
        if (socket && isTypingRef.current) {
            socket.emit('stopTyping')
            isTypingRef.current = false
        }
        onSubmit(e)
    }

    return (
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-900 rounded-b-lg border-t border-gray-200 dark:border-gray-800 p-4"
        >
            <div className="flex gap-2">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 px-4 py-2.5 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-medium px-6 py-2.5 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                >
                    Enviar
                </motion.button>
            </div>
        </motion.form>
    )
}
