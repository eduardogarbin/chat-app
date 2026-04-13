import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef } from 'react'
import EmojiPickerReact, { Theme } from 'emoji-picker-react'

/**
 * Props para o componente EmojiPicker.
 */
interface EmojiPickerProps {
    /** Se o picker está aberto */
    isOpen: boolean
    /** Callback para fechar o picker */
    onClose: () => void
    /** Callback quando um emoji é selecionado (recebe o emoji string) */
    onEmojiSelect: (emoji: string) => void
}

/**
 * Seletor de emoji com suporte a dark mode.
 *
 * @param props - {@link EmojiPickerProps}
 * @returns Modal com EmojiPickerReact ou null (se fechado)
 *
 * @remarks
 * Wrapper do componente `emoji-picker-react` com:
 * - Detecção automática de dark mode
 * - Backdrop para fechar ao clicar fora
 * - Animações suaves de entrada/saída
 * - Posicionamento acima do input (bottom-full)
 *
 * Usado em ChatInput para adicionar emojis ao texto da mensagem.
 * O emoji inserido é colocado na posição do cursor.
 *
 * @example
 * <EmojiPicker
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onEmojiSelect={(emoji) => insertEmojiAtCursor(emoji)}
 * />
 */
export const EmojiPicker = ({ isOpen, onClose, onEmojiSelect }: EmojiPickerProps) => {
    /** Detecta se está em dark mode pela classe do documentElement */
    const isDarkMode = document.documentElement.classList.contains('dark')
    const pickerRef = useRef<HTMLDivElement>(null)

    /**
     * Fecha o picker ao clicar fora dele.
     * O delay evita que o clique de abertura feche imediatamente.
     */
    useEffect(() => {
        if (!isOpen) return

        const handleClickOutside = (event: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                onClose()
            }
        }

        // Adiciona o listener após um pequeno delay para evitar que o clique de abertura feche imediatamente
        setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside)
        }, 0)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen, onClose])

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop para fechar ao clicar fora */}
                    <div
                        className="fixed inset-0 z-[100]"
                        onClick={onClose}
                    />

                    <motion.div
                        ref={pickerRef}
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bottom-full mb-2 right-0 z-[110] rounded-2xl overflow-hidden shadow-2xl shadow-violet-500/20 border border-white/20 dark:border-gray-700/50"
                    >
                        <EmojiPickerReact
                            onEmojiClick={(emojiData) => {
                                onEmojiSelect(emojiData.emoji)
                                onClose()
                            }}
                            theme={isDarkMode ? Theme.DARK : Theme.LIGHT}
                            width={350}
                            height={400}
                            searchPlaceHolder="Buscar emoji..."
                            previewConfig={{
                                showPreview: false
                            }}
                        />
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
