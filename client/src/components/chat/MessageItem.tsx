import { motion } from 'framer-motion'
import type { Message } from '../../types/message'

interface MessageItemProps {
    message: Message
    isOwnMessage: boolean
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

export const MessageItem = ({ message, isOwnMessage }: MessageItemProps) => {
    const isSystemMessage = message.userId === 'system'
    const userColor = getUserColor(message.username)

    return (
        <motion.div
            initial={{ opacity: 0, x: isOwnMessage ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className={`mb-3 flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
        >
            {isSystemMessage ? (
                <div className="max-w-xs lg:max-w-md px-3 py-1.5 rounded-md bg-gray-200 dark:bg-gray-800 text-center">
                    <p className="text-xs text-gray-600 dark:text-gray-400">{message.content}</p>
                </div>
            ) : (
                <div className="flex items-end gap-2 max-w-xs lg:max-w-md">
                    {!isOwnMessage && (
                        <div
                            className="w-7 h-7 rounded-full flex items-center justify-center font-medium text-xs flex-shrink-0"
                            style={{
                                backgroundColor: userColor.bg,
                                color: userColor.textColor
                            }}
                        >
                            {message.username.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div className="flex flex-col gap-0.5">
                        <div
                            className={`px-3 py-2 rounded-lg ${
                                isOwnMessage
                                    ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
                            }`}
                        >
                            {!isOwnMessage && (
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                    {message.username}
                                </p>
                            )}
                            <p className="text-sm">{message.content}</p>
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-600 px-1">
                            {new Date(message.timestamp).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>
                    </div>
                </div>
            )}
        </motion.div>
    )
}
