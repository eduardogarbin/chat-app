import { motion } from 'framer-motion'
import { useState } from 'react'
import type { Reaction } from '../../types/message'
import { EmojiIcon } from '../ui/EmojiIcon'

interface MessageReactionsProps {
    messageId: string
    reactions?: Reaction[]
    currentUserId: string
    onReactionToggle: (messageId: string, emoji: string) => void
    showOnlyButton?: boolean
    isOwnMessage?: boolean
    isPopupOpen?: boolean
    onTogglePopup?: (isOpen: boolean) => void
}

const QUICK_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🎉']

export const MessageReactions = ({ messageId, reactions = [], currentUserId, onReactionToggle, showOnlyButton = false, isOwnMessage = false, isPopupOpen = false, onTogglePopup }: MessageReactionsProps) => {
    // Usa o estado controlado do pai se disponível, senão usa estado local
    const [localShowQuickReactions, setLocalShowQuickReactions] = useState(false)
    const showQuickReactions = onTogglePopup ? isPopupOpen : localShowQuickReactions

    const handleToggle = (e?: React.MouseEvent) => {
        // Evita que o clique propague para o backdrop de outro popup
        e?.stopPropagation()

        if (onTogglePopup) {
            onTogglePopup(!isPopupOpen)
        } else {
            setLocalShowQuickReactions(!localShowQuickReactions)
        }
    }

    const hasUserReacted = (reaction: Reaction) => {
        return reaction.userIds.includes(currentUserId)
    }

    // Se showOnlyButton é true, mostra apenas o botão
    if (showOnlyButton) {
        return (
            <div className="relative z-[25]" data-reaction-popup>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => handleToggle(e)}
                    className="group w-6 h-6 flex items-center justify-center rounded-full bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors relative z-[25]"
                    title="Adicionar reação"
                    aria-label="Adicionar reação"
                >
                    <EmojiIcon />
                </motion.button>

                {/* Menu de reações rápidas */}
                {showQuickReactions && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className={`absolute bottom-full mb-1 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-lg border border-gray-200/50 dark:border-gray-700/50 shadow-2xl p-1 flex gap-1 ${
                            isOwnMessage ? 'right-0' : 'left-0'
                        }`}
                    >
                            {QUICK_REACTIONS.map((emoji) => (
                                <motion.button
                                    key={emoji}
                                    whileHover={{ scale: 1.3 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => {
                                        onReactionToggle(messageId, emoji)
                                        if (onTogglePopup) {
                                            onTogglePopup(false)
                                        } else {
                                            setLocalShowQuickReactions(false)
                                        }
                                    }}
                                    className="text-xl p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                                    title={emoji}
                                >
                                    {emoji}
                                </motion.button>
                            ))}
                    </motion.div>
                )}
            </div>
        )
    }

    // Caso contrário, mostra apenas as reações existentes
    return (
        <div className="flex flex-wrap gap-1 items-center">
            {/* Reações existentes */}
            {reactions.map((reaction) => (
                <motion.button
                    key={reaction.emoji}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onReactionToggle(messageId, reaction.emoji)}
                    className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs transition-all ${
                        hasUserReacted(reaction)
                            ? 'bg-violet-100 dark:bg-violet-900/40 border border-violet-400 dark:border-violet-500'
                            : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-300/50 dark:border-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    title={reaction.usernames.join(', ')}
                >
                    <span className="text-xs leading-none">{reaction.emoji}</span>
                    <span className={`font-medium text-[10px] ${hasUserReacted(reaction) ? 'text-violet-700 dark:text-violet-300' : 'text-gray-600 dark:text-gray-400'}`}>
                        {reaction.userIds.length}
                    </span>
                </motion.button>
            ))}
        </div>
    )
}
