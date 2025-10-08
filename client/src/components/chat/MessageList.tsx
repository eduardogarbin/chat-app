import { useRef, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import type { Message } from '../../types/message'
import { MessageItem } from './MessageItem'

interface MessageListProps {
    messages: Message[]
    currentUsername: string
}

export const MessageList = ({ messages, currentUsername }: MessageListProps) => {
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    return (
        <div className="flex-1 bg-white dark:bg-gray-800 p-6 overflow-y-auto">
            <AnimatePresence>
                {messages.map((message) => (
                    <MessageItem
                        key={message.id}
                        message={message}
                        isOwnMessage={message.sender === currentUsername}
                    />
                ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
        </div>
    )
}
