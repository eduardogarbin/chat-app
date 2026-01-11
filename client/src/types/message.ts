export interface Reaction {
    emoji: string
    userIds: string[]
    usernames: string[]
}

export interface Message {
    id: string
    userId: string
    username: string
    content: string
    timestamp: Date
    room?: string
    reactions?: Reaction[]
}
