import { motion } from 'framer-motion'
import { useState } from 'react'
import type { Reaction } from '../../types/message'
import { EmojiIcon } from '../ui/EmojiIcon'

/**
 * Props para o componente MessageReactions.
 */
interface MessageReactionsProps {
    /** ID da mensagem a reagir */
    messageId: string
    /** Lista de reações existentes (se showOnlyButton false) */
    reactions?: Reaction[]
    /** Socket ID do usuário atual (para verificar se já reagiu) */
    currentUserId: string
    /** Callback ao adicionar/remover reação (emite para o servidor) */
    onReactionToggle: (messageId: string, emoji: string) => void
    /** Se true, mostra apenas o botão; se false, mostra reações existentes */
    showOnlyButton?: boolean
    /** Se a mensagem é do usuário atual (afeta posição do popup) */
    isOwnMessage?: boolean
    /** Controle externo do popup (do pai) */
    isPopupOpen?: boolean
    /** Callback para controlar visibilidade do popup (opcional, com fallback local) */
    onTogglePopup?: (isOpen: boolean) => void
}

/**
 * Conjunto de reações rápidas (6 emojis mais populares).
 * Exibidas na popup ao clicar no botão de reação.
 */
const QUICK_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🎉']

/**
 * Sistema de reações por emoji para mensagens.
 *
 * @param props - {@link MessageReactionsProps}
 * @returns Botão de reação (showOnlyButton) ou lista de reações com contadores
 *
 * @remarks
 * Componente dual-purpose:
 * 1. Modo "botão": renderiza apenas o ícone de emoji com popup de quick reactions
 * 2. Modo "reações": renderiza reações existentes com contadores
 *
 * Integrado com Socket.io — emit 'toggleReaction' ao clicar.
 * Suporta estado controlado (pai) ou local (se pai não fornecer onTogglePopup).
 * Posiciona popup à esquerda/direita baseado em isOwnMessage.
 *
 * @example
 * // Modo botão (no MessageItem)
 * <MessageReactions
 *   messageId="msg-123"
 *   currentUserId="socket-456"
 *   onReactionToggle={(id, emoji) => socket.emit('toggleReaction', id, emoji)}
 *   showOnlyButton={true}
 *   isOwnMessage={true}
 *   isPopupOpen={openReactionPopup === 'msg-123'}
 *   onTogglePopup={(isOpen) => setOpenReactionPopup(isOpen ? 'msg-123' : null)}
 * />
 *
 * // Modo reações
 * <MessageReactions
 *   messageId="msg-123"
 *   reactions={[{ emoji: '👍', userIds: ['u1', 'u2'], usernames: ['alice', 'bob'] }]}
 *   currentUserId="socket-456"
 *   onReactionToggle={(id, emoji) => socket.emit('toggleReaction', id, emoji)}
 *   showOnlyButton={false}
 * />
 */
export const MessageReactions = ({ messageId, reactions = [], currentUserId, onReactionToggle, showOnlyButton = false, isOwnMessage = false, isPopupOpen = false, onTogglePopup }: MessageReactionsProps) => {
    /**
     * Fallback para estado local se o pai não fornece controle.
     * Permite uso independente ou integrado.
     */
    const [localShowQuickReactions, setLocalShowQuickReactions] = useState(false)
    const showQuickReactions = onTogglePopup ? isPopupOpen : localShowQuickReactions

    /**
     * Alterna visibilidade do popup de reações rápidas.
     * Para propagação de eventos para evitar fechar outros popups.
     */
    const handleToggle = (e?: React.MouseEvent) => {
        e?.stopPropagation()

        if (onTogglePopup) {
            onTogglePopup(!isPopupOpen)
        } else {
            setLocalShowQuickReactions(!localShowQuickReactions)
        }
    }

    /**
     * Verifica se o usuário atual já reagiu com este emoji.
     * @param reaction - Reação a verificar
     * @returns true se currentUserId está em reaction.userIds
     */
    const hasUserReacted = (reaction: Reaction) => {
        return reaction.userIds.includes(currentUserId)
    }

    /** Modo botão: renderiza apenas o ícone com popup de quick reactions */
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
