import { useRef, useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import type { Message } from '../../types/message'
import { MessageItem } from './MessageItem'
import { TypingIndicator } from './TypingIndicator'
import { ScrollToBottom } from './ScrollToBottom'

/**
 * Props para o componente MessageList.
 */
interface MessageListProps {
    /** Array de mensagens a renderizar */
    messages: Message[]
    /** Nome do usuário logado (para comparação isOwnMessage) */
    currentUsername: string
    /** Socket ID do usuário logado (para reações) */
    currentUserId: string
    /** Lista de nomes de usuários digitando */
    usersTyping: string[]
    /** Callback ao adicionar/remover reação */
    onReactionToggle: (messageId: string, emoji: string) => void
}

/**
 * Container virtualizável de mensagens com scroll inteligente.
 *
 * @param props - {@link MessageListProps}
 * @returns Div com scroll, mensagens animadas, indicador de digitação e botão scroll-to-bottom
 *
 * @remarks
 * Funcionalidades complexas:
 * 1. Auto-scroll ao fim quando novas mensagens chegam (se usuario está no fim)
 * 2. "Sticky" scroll-to-bottom button quando usuario rola para cima
 * 3. Badge de mensagens não lidas (com limite 99+)
 * 4. Click-outside para fechar popups de reação
 * 5. Indicador animado de usuários digitando
 *
 * Lógica de scroll:
 * - isUserScrolling: true quando usuario rola para cima (threshold < 100px)
 * - messageCountWhenScrolledRef: contagem de mensagens no momento de iniciar scroll
 * - unreadCount: apenas mensagens que chegaram APÓS começar a rolar
 *
 * @example
 * <MessageList
 *   messages={messages}
 *   currentUsername="alice"
 *   currentUserId="socket-123"
 *   usersTyping={['bob']}
 *   onReactionToggle={(id, emoji) => socket.emit('toggleReaction', id, emoji)}
 * />
 */
export const MessageList = ({ messages, currentUsername, currentUserId, usersTyping, onReactionToggle }: MessageListProps) => {
    /** Referência ao elemento vazio no fim (para scrollIntoView) */
    const messagesEndRef = useRef<HTMLDivElement>(null)
    /** Referência ao container scrollável (para cálculos de scroll) */
    const containerRef = useRef<HTMLDivElement>(null)
    /** Se o botão scroll-to-bottom deve ser visível */
    const [showScrollButton, setShowScrollButton] = useState(false)
    /** Contagem de mensagens não lidas desde último scroll manual */
    const [unreadCount, setUnreadCount] = useState(0)
    /** Se o usuário está manualmente rolando (não no fim) */
    const [isUserScrolling, setIsUserScrolling] = useState(false)
    /** Contagem de mensagens quando usuario começou a rolar para cima */
    const messageCountWhenScrolledRef = useRef<number>(messages.length)
    /** ID do popup de reação aberto (null se fechado) */
    const [openReactionPopup, setOpenReactionPopup] = useState<string | null>(null)

    /**
     * Fecha popup de reação ao clicar fora dele.
     * Usa atributo data-reaction-popup para identificar elementos do popup.
     */
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            if (!target.closest('[data-reaction-popup]')) {
                setOpenReactionPopup(null)
            }
        }

        if (openReactionPopup) {
            document.addEventListener('click', handleClickOutside)
            return () => document.removeEventListener('click', handleClickOutside)
        }
    }, [openReactionPopup])

    /**
     * Scroll suave para o fim da conversa.
     * Reseta contadores de leitura e fecha botão scroll-to-bottom.
     */
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        setUnreadCount(0)
        setShowScrollButton(false)
        setIsUserScrolling(false)
        messageCountWhenScrolledRef.current = messages.length
    }

    /**
     * Handler de scroll: detecta se usuario está perto do fim ou não.
     * Threshold: 100px do fundo.
     */
    const handleScroll = () => {
        if (!containerRef.current) return

        const { scrollTop, scrollHeight, clientHeight } = containerRef.current
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 100

        if (isAtBottom) {
            setShowScrollButton(false)
            setUnreadCount(0)
            setIsUserScrolling(false)
            messageCountWhenScrolledRef.current = messages.length
        } else {
            if (!isUserScrolling) {
                messageCountWhenScrolledRef.current = messages.length
            }
            setShowScrollButton(true)
            setIsUserScrolling(true)
        }
    }

    /**
     * Auto-scroll quando novas mensagens chegam.
     * Se usuario está no fim, scroll automático.
     * Se usuario está scrollado para cima, mostra unread badge.
     */
    useEffect(() => {
        if (!isUserScrolling) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
            messageCountWhenScrolledRef.current = messages.length
        } else {
            const newMessagesCount = messages.length - messageCountWhenScrolledRef.current
            if (newMessagesCount > 0) {
                setUnreadCount(newMessagesCount)
            }
        }
    }, [messages, isUserScrolling])

    return (
        <div
            ref={containerRef}
            onScroll={handleScroll}
            className="flex-1 bg-white/40 dark:bg-gray-900/40 backdrop-blur-lg p-4 overflow-y-auto relative shadow-inner shadow-gray-900/[0.02] dark:shadow-black/10"
        >
            <ScrollToBottom
                isVisible={showScrollButton}
                unreadCount={unreadCount}
                onClick={scrollToBottom}
            />
            <AnimatePresence>
                {messages.map((message) => (
                    <MessageItem
                        key={message.id}
                        message={message}
                        isOwnMessage={message.username === currentUsername}
                        currentUserId={currentUserId}
                        onReactionToggle={onReactionToggle}
                        openReactionPopup={openReactionPopup}
                        setOpenReactionPopup={setOpenReactionPopup}
                    />
                ))}
            </AnimatePresence>
            <TypingIndicator usersTyping={usersTyping} />
            <div ref={messagesEndRef} />
        </div>
    )
}
