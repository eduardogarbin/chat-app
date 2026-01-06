export interface Message {
    id: string
    userId: string
    username: string
    content: string
    timestamp: Date
    room?: string
}
