import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef } from 'react'
import EmojiPickerReact, { Theme } from 'emoji-picker-react'

interface EmojiPickerProps {
    isOpen: boolean
    onClose: () => void
    onEmojiSelect: (emoji: string) => void
}

export const EmojiPicker = ({ isOpen, onClose, onEmojiSelect }: EmojiPickerProps) => {
    // Detecta se está em dark mode
    const isDarkMode = document.documentElement.classList.contains('dark')
    const pickerRef = useRef<HTMLDivElement>(null)

    // Detecta cliques fora do emoji picker
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
