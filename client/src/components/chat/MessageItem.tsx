import { motion } from 'framer-motion'
import type { Message } from '../../types/message'

interface MessageItemProps {
    message: Message
    isOwnMessage: boolean
}

export const MessageItem = ({ message, isOwnMessage }: MessageItemProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: isOwnMessage ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className={`mb-4 flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
        >
            <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${isOwnMessage
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-bl-none'
                    }`}
            >
                <p className="text-xs font-semibold mb-1 opacity-80">
                    {message.sender}
                </p>
                <p className="text-sm">{message.text}</p>
                <p className="text-xs mt-1 opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </p>
            </div>
        </motion.div>
    )
}
