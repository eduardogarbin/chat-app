import { useRef, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import type { Message } from '../../types/message'
import { MessageItem } from './MessageItem'
import { TypingIndicator } from './TypingIndicator'

interface MessageListProps {
    messages: Message[]
    currentUsername: string
    usersTyping: string[]
}

export const MessageList = ({ messages, currentUsername, usersTyping }: MessageListProps) => {
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    return (
        <div className="flex-1 bg-gray-50 dark:bg-gray-950 p-4 overflow-y-auto">
            <AnimatePresence>
                {messages.map((message) => (
                    <MessageItem
                        key={message.id}
                        message={message}
                        isOwnMessage={message.username === currentUsername}
                    />
                ))}
            </AnimatePresence>
            <TypingIndicator usersTyping={usersTyping} />
            <div ref={messagesEndRef} />
        </div>
    )
}
