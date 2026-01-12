import { motion } from 'framer-motion'
import { getUserColor } from '../../utils/colors'
import { LogoutIcon } from '../ui/LogoutIcon'

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
            className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-t-2xl border-b border-white/20 dark:border-gray-700/50 p-4 flex items-center justify-between shadow-md shadow-gray-900/3 dark:shadow-black/10 relative z-10"
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
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                    <div
                        className="w-7 h-7 rounded-full flex items-center justify-center font-semibold text-xs shadow-md"
                        style={{
                            backgroundColor: userColor.bg,
                            color: userColor.textColor
                        }}
                    >
                        {username.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {username}
                    </span>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onLogout}
                    className="flex items-center justify-center gap-1.5 bg-red-500/90 dark:bg-red-600/90 text-white font-medium px-3 py-2 rounded-lg hover:bg-red-600 dark:hover:bg-red-700 transition-all shadow-md hover:shadow-lg text-sm"
                    aria-label="Sair"
                >
                    <div className="flex items-center gap-1.5">
                        <LogoutIcon />
                        <span className="leading-none">Sair</span>
                    </div>
                </motion.button>
            </div>
        </motion.div>
    )
}
