import { motion } from 'framer-motion'

interface ChatHeaderProps {
    username: string
    isConnected: boolean
    onLogout: () => void
    onlineUsers: number
}

const getUserColor = (username: string) => {
    const colors = [
        { bg: '#6b7280', textColor: '#ffffff' },
        { bg: '#71717a', textColor: '#ffffff' },
        { bg: '#78716c', textColor: '#ffffff' },
        { bg: '#737373', textColor: '#ffffff' },
        { bg: '#64748b', textColor: '#ffffff' },
    ]
    const index = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
    return colors[index]
}

export const ChatHeader = ({ username, isConnected, onLogout, onlineUsers }: ChatHeaderProps) => {
    const userColor = getUserColor(username)
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 rounded-t-lg border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between"
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
                    className="text-xs text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    Sair
                </motion.button>
            </div>
        </motion.div>
    )
}
