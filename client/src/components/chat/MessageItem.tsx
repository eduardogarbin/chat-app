import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import type { Message } from '../../types/message'
import { getUserColor } from '../../utils/colors'
import { getRelativeTime, getFullDateTime } from '../../utils/time'
import { MessageReactions } from './MessageReactions'

interface MessageItemProps {
    message: Message
    isOwnMessage: boolean
    currentUserId: string
    onReactionToggle: (messageId: string, emoji: string) => void
    openReactionPopup: string | null
    setOpenReactionPopup: (messageId: string | null) => void
}

export const MessageItem = ({ message, isOwnMessage, currentUserId, onReactionToggle, openReactionPopup, setOpenReactionPopup }: MessageItemProps) => {
    const isSystemMessage = message.userId === 'system'
    const userColor = getUserColor(message.username)
    const [relativeTime, setRelativeTime] = useState(getRelativeTime(message.timestamp))

    // Atualiza o tempo relativo a cada minuto
    useEffect(() => {
        const interval = setInterval(() => {
            setRelativeTime(getRelativeTime(message.timestamp))
        }, 60000) // Atualiza a cada 60 segundos

        return () => clearInterval(interval)
    }, [message.timestamp])

    return (
        <motion.div
            initial={{ opacity: 0, x: isOwnMessage ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className={`mb-3 flex relative ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
        >
            {isSystemMessage ? (
                <div className="max-w-xs lg:max-w-md px-3 py-1.5 rounded-md bg-gray-200 dark:bg-gray-800 text-center">
                    <p className="text-xs text-gray-600 dark:text-gray-400">{message.content}</p>
                </div>
            ) : (
                <div className="flex items-end gap-2 max-w-xs lg:max-w-md relative z-0">
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
                    <div className="flex flex-col gap-0.5 relative z-0">
                        <div className={`flex items-center gap-1 relative z-0 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div
                                className={`px-3 py-2 rounded-lg ${
                                    isOwnMessage
                                        ? 'bg-violet-600 dark:bg-violet-500 text-white shadow-lg shadow-violet-500/30'
                                        : 'bg-white/90 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 border border-gray-200/50 dark:border-gray-600/50 shadow-sm'
                                }`}
                            >
                                {!isOwnMessage && (
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-300 mb-1">
                                        {message.username}
                                    </p>
                                )}
                                <p className="text-sm">{message.content}</p>
                            </div>

                            {/* Ícone de adicionar reação ao lado da mensagem */}
                            {!isSystemMessage && (
                                <div className="flex-shrink-0 relative z-[25]">
                                    <MessageReactions
                                        messageId={message.id}
                                        reactions={[]} // Passa array vazio para mostrar apenas o botão
                                        currentUserId={currentUserId}
                                        onReactionToggle={onReactionToggle}
                                        showOnlyButton={true}
                                        isOwnMessage={isOwnMessage}
                                        isPopupOpen={openReactionPopup === message.id}
                                        onTogglePopup={(isOpen) => setOpenReactionPopup(isOpen ? message.id : null)}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Reações existentes abaixo da mensagem */}
                        {!isSystemMessage && message.reactions && message.reactions.length > 0 && (
                            <div className="px-1">
                                <MessageReactions
                                    messageId={message.id}
                                    reactions={message.reactions}
                                    currentUserId={currentUserId}
                                    onReactionToggle={onReactionToggle}
                                    showOnlyButton={false}
                                />
                            </div>
                        )}

                        <p
                            className="text-xs text-gray-400 dark:text-gray-400 px-1 cursor-default"
                            title={getFullDateTime(message.timestamp)}
                        >
                            {relativeTime}
                        </p>
                    </div>
                </div>
            )}
        </motion.div>
    )
}
