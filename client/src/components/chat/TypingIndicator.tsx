import { motion } from 'framer-motion'

interface TypingIndicatorProps {
    usersTyping: string[]
}

export const TypingIndicator = ({ usersTyping }: TypingIndicatorProps) => {
    if (usersTyping.length === 0) return null

    const getTypingText = () => {
        if (usersTyping.length === 1) {
            return `${usersTyping[0]} está digitando...`
        } else if (usersTyping.length === 2) {
            return `${usersTyping[0]} e ${usersTyping[1]} estão digitando`
        } else {
            return `${usersTyping.length} pessoas estão digitando`
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center gap-2 px-4 py-2 text-xs text-gray-500 dark:text-gray-500"
        >
            <div className="flex gap-1">
                <motion.div
                    className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-600 rounded-full"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                    className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-600 rounded-full"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                    className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-600 rounded-full"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                />
            </div>
            <span>{getTypingText()}</span>
        </motion.div>
    )
}
