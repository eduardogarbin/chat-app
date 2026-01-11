import { motion } from 'framer-motion'
import { getUserColor } from '../../utils/colors'

interface ChatHeaderProps {
    username: string
    isConnected: boolean
    onLogout: () => void
    onlineUsers: number
}

export const ChatHeader = ({ username, isConnected, onLogout, onlineUsers }: ChatHeaderProps) => {
    const userColor = getUserColor(username)
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-t-2xl border-b border-white/20 dark:border-gray-700/50 p-4 flex items-center justify-between"
        >
            <div className="flex items-center gap-3">
                <div className="flex flex-col">
                    <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Chat
                    </h1>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-500">
                        <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span>{onlineUsers} online</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <div
                        className="w-7 h-7 rounded-full flex items-center justify-center font-medium text-xs"
                        style={{
                            backgroundColor: userColor.bg,
                            color: userColor.textColor
                        }}
                    >
                        {username.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                        {username}
                    </span>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onLogout}
                    className="text-xs bg-violet-600 dark:bg-violet-500 text-white font-medium px-3 py-1.5 rounded-md hover:bg-violet-700 dark:hover:bg-violet-600 transition-colors shadow-sm"
                >
                    Sair
                </motion.button>
            </div>
        </motion.div>
    )
}
