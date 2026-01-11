import { motion, AnimatePresence } from 'framer-motion'
import EmojiPickerReact, { Theme } from 'emoji-picker-react'

interface EmojiPickerProps {
    isOpen: boolean
    onClose: () => void
    onEmojiSelect: (emoji: string) => void
}

export const EmojiPicker = ({ isOpen, onClose, onEmojiSelect }: EmojiPickerProps) => {
    // Detecta se está em dark mode
    const isDarkMode = document.documentElement.classList.contains('dark')

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop para fechar ao clicar fora */}
                    <div
                        className="fixed inset-0 z-20"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bottom-16 left-0 z-30 rounded-2xl overflow-hidden shadow-2xl shadow-violet-500/20 border border-white/20 dark:border-gray-700/50"
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
