import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import type { Socket } from 'socket.io-client'
import { EmojiPicker } from './EmojiPicker'

interface ChatInputProps {
    inputMessage: string
    setInputMessage: (message: string) => void
    onSubmit: (e: React.FormEvent) => void
    socket: Socket | null
}

export const ChatInput = ({ inputMessage, setInputMessage, onSubmit, socket }: ChatInputProps) => {
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const isTypingRef = useRef(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)

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

    const handleEmojiSelect = (emoji: string) => {
        if (!inputRef.current) return

        const input = inputRef.current
        const start = input.selectionStart || 0
        const end = input.selectionEnd || 0
        const text = inputMessage

        // Insere o emoji na posição do cursor
        const newText = text.substring(0, start) + emoji + text.substring(end)
        setInputMessage(newText)

        // Retorna o foco para o input e posiciona o cursor após o emoji
        setTimeout(() => {
            input.focus()
            const newCursorPosition = start + emoji.length
            input.setSelectionRange(newCursorPosition, newCursorPosition)
        }, 0)
    }

    return (
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-b-2xl border-t border-white/20 dark:border-gray-700/50 p-4 relative"
        >
            <div className="flex gap-2">
                <div className="flex-1 relative">
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Digite sua mensagem..."
                        className="w-full px-4 py-2.5 pr-12 rounded-lg border border-gray-300/50 dark:border-gray-700/50 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-500 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />

                    {/* Botão de Emoji */}
                    <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors text-xl"
                        aria-label="Adicionar emoji"
                    >
                        😊
                    </motion.button>

                    {/* Emoji Picker */}
                    <EmojiPicker
                        isOpen={isEmojiPickerOpen}
                        onClose={() => setIsEmojiPickerOpen(false)}
                        onEmojiSelect={handleEmojiSelect}
                    />
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="bg-violet-600 dark:bg-violet-500 text-white font-medium px-6 py-2.5 rounded-lg hover:bg-violet-700 dark:hover:bg-violet-600 transition-colors shadow-sm"
                >
                    Enviar
                </motion.button>
            </div>
        </motion.form>
    )
}
