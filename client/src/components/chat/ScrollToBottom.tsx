import { motion, AnimatePresence } from 'framer-motion'

interface ScrollToBottomProps {
    isVisible: boolean
    unreadCount: number
    onClick: () => void
}

export const ScrollToBottom = ({ isVisible, unreadCount, onClick }: ScrollToBottomProps) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="sticky top-0 left-0 right-0 z-10 flex justify-center pt-2 pb-4 pointer-events-none"
                >
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onClick}
                        className="bg-violet-600/95 dark:bg-violet-500/95 backdrop-blur-xl text-white px-4 py-2.5 rounded-full shadow-2xl shadow-violet-500/40 border border-white/30 hover:bg-violet-700/95 dark:hover:bg-violet-600/95 transition-all pointer-events-auto flex items-center gap-2.5 font-medium text-sm"
                        aria-label="Ir para mensagens mais recentes"
                    >
                        {unreadCount > 0 && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="bg-white/20 text-white text-xs font-bold rounded-full min-w-[22px] h-[22px] flex items-center justify-center px-2"
                            >
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </motion.div>
                        )}
                        <span>
                            {unreadCount > 0
                                ? `${unreadCount === 1 ? '1 nova mensagem' : `${unreadCount > 99 ? '99+' : unreadCount} novas mensagens`}`
                                : 'Ir para mais recentes'}
                        </span>
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M19 14l-7 7m0 0l-7-7m7 7V3"
                            />
                        </svg>
                    </motion.button>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
