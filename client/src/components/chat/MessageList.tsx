import { useRef, useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import type { Message } from '../../types/message'
import { MessageItem } from './MessageItem'
import { TypingIndicator } from './TypingIndicator'
import { ScrollToBottom } from './ScrollToBottom'

interface MessageListProps {
    messages: Message[]
    currentUsername: string
    currentUserId: string
    usersTyping: string[]
    onReactionToggle: (messageId: string, emoji: string) => void
}

export const MessageList = ({ messages, currentUsername, currentUserId, usersTyping, onReactionToggle }: MessageListProps) => {
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [showScrollButton, setShowScrollButton] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)
    const [isUserScrolling, setIsUserScrolling] = useState(false)
    const messageCountWhenScrolledRef = useRef<number>(messages.length)
    const [openReactionPopup, setOpenReactionPopup] = useState<string | null>(null)

    // Fecha popup ao clicar fora
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            // Verifica se o clique foi fora dos popups de reação
            if (!target.closest('[data-reaction-popup]')) {
                setOpenReactionPopup(null)
            }
        }

        if (openReactionPopup) {
            document.addEventListener('click', handleClickOutside)
            return () => document.removeEventListener('click', handleClickOutside)
        }
    }, [openReactionPopup])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        setUnreadCount(0)
        setShowScrollButton(false)
        setIsUserScrolling(false)
        messageCountWhenScrolledRef.current = messages.length
    }

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
                // Usuário acabou de rolar para cima, salva a contagem atual
                messageCountWhenScrolledRef.current = messages.length
            }
            setShowScrollButton(true)
            setIsUserScrolling(true)
        }
    }

    useEffect(() => {
        if (!isUserScrolling) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
            messageCountWhenScrolledRef.current = messages.length
        } else {
            // Conta apenas mensagens que chegaram DEPOIS de começar a rolar
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
            className="flex-1 bg-white/40 dark:bg-gray-900/40 backdrop-blur-lg p-4 overflow-y-auto relative"
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
