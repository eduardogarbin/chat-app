import { motion } from 'framer-motion'

interface ChatHeaderProps {
    username: string
    isConnected: boolean
    onLogout: () => void
}

export const ChatHeader = ({ username, isConnected, onLogout }: ChatHeaderProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-t-2xl shadow-lg p-4 flex items-center justify-between"
        >
            <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                    Chat App
                </h1>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                    {username}
                </span>
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onLogout}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors px-3 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    Sair
                </motion.button>
            </div>
        </motion.div>
    )
}
