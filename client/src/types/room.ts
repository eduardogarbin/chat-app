/**
 * Representa uma sala de chat.
 *
 * @remarks
 * Cada sala é um espaço isolado onde mensagens são distribuídas
 * apenas para usuários conectados naquela sala específica.
 * O ID é usado internamente para referência, enquanto o nome
 * é exibido na UI.
 */
export interface Room {
    /** ID único da sala (ex: "geral", "tecnologia") */
    id: string
    /** Nome exibido na UI (ex: "Geral", "Tecnologia") */
    name: string
    /** Descrição opcional da sala */
    description?: string
    /** Timestamp de criação (do servidor) */
    createdAt: Date
    /** Limite de usuários simultâneos (opcional) */
    maxUsers?: number
}
