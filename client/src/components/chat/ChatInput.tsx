import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import type { Socket } from 'socket.io-client'
import { EmojiPicker } from './EmojiPicker'
import { EmojiIcon } from '../ui/EmojiIcon'

/**
 * Props para o componente ChatInput.
 */
interface ChatInputProps {
    /** Texto atual do input */
    inputMessage: string
    /** Callback para atualizar o texto (setState do App) */
    setInputMessage: (message: string) => void
    /** Callback acionado ao submeter o formulário */
    onSubmit: (e: React.FormEvent) => void
    /** Socket.io para emitir eventos de typing */
    socket: Socket | null
}

/**
 * Input de mensagem com seletor de emoji integrado.
 *
 * @param props - {@link ChatInputProps}
 * @returns Formulário com input, botão de emoji e botão enviar
 *
 * @remarks
 * Funcionalidades:
 * 1. Input controlado (valor vem do estado do App)
 * 2. Indicador de digitação: emite 'typing' ao começar, 'stopTyping' após 3s inativo
 * 3. Emoji picker: insere emoji na posição do cursor
 * 4. Validação: previne envio de mensagens vazias (feita no App)
 *
 * Timing de typing:
 * - Emite 'typing' no primeiro caractere
 * - Resetagem 3s de inatividade → emite 'stopTyping'
 * - Submit também emite 'stopTyping'
 *
 * @example
 * <ChatInput
 *   inputMessage={inputMessage}
 *   setInputMessage={setInputMessage}
 *   onSubmit={handleSendMessage}
 *   socket={socket}
 * />
 */
export const ChatInput = ({ inputMessage, setInputMessage, onSubmit, socket }: ChatInputProps) => {
    /** Timer para detectar fim de digitação (3 segundos inativo) */
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    /** Flag para evitar múltiplos 'typing' emit */
    const isTypingRef = useRef(false)
    /** Referência ao input para manipular cursor e seleção */
    const inputRef = useRef<HTMLInputElement>(null)
    /** Controla visibilidade do emoji picker */
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)

    /**
     * Gerencia eventos de digitação com debounce.
     * Emite 'typing' ao começar, aguarda 3s e emite 'stopTyping'.
     */
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

    /**
     * Submete a mensagem e limpa o estado de digitação.
     * @param e - Evento do formulário
     */
    const handleSubmit = (e: React.FormEvent) => {
        if (socket && isTypingRef.current) {
            socket.emit('stopTyping')
            isTypingRef.current = false
        }
        onSubmit(e)
    }

    /**
     * Insere emoji na posição do cursor do input.
     * Mantém o foco e posiciona o cursor após o emoji.
     * @param emoji - Emoji string a inserir (ex: "👍")
     */
    const handleEmojiSelect = (emoji: string) => {
        if (!inputRef.current) return

        const input = inputRef.current
        const start = input.selectionStart || 0
        const end = input.selectionEnd || 0
        const text = inputMessage

        const newText = text.substring(0, start) + emoji + text.substring(end)
        setInputMessage(newText)

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
            className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-b-2xl border-t border-white/20 dark:border-gray-700/50 p-4 relative shadow-[0_-2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_-2px_12px_rgba(0,0,0,0.15)] z-10"
        >
            <div className="flex gap-2">
                <div className="flex-1 relative">
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Digite uma mensagem..."
                        className="w-full px-3 py-2 pr-12 rounded-lg border border-gray-300/50 dark:border-gray-700/50 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-500 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />

                    {/* Botão de Emoji */}
                    <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                            e.stopPropagation()
                            setIsEmojiPickerOpen(!isEmojiPickerOpen)
                        }}
                        className="group absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                        aria-label="Adicionar emoji"
                    >
                        <EmojiIcon size={22} />
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
                    className="bg-violet-600 dark:bg-violet-500 text-white font-medium px-5 py-2 rounded-lg hover:bg-violet-700 dark:hover:bg-violet-600 transition-colors shadow-sm text-sm"
                >
                    Enviar
                </motion.button>
            </div>
        </motion.form>
    )
}
