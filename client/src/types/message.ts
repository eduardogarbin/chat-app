/**
 * Representa uma reação de emoji a uma mensagem.
 *
 * @remarks
 * Vinculada a uma mensagem específica e rastreia quais usuários a adicionaram.
 * Permite múltiplos usuários reagirem com o mesmo emoji.
 */
export interface Reaction {
    /** Emoji UTF-8 (ex: "👍", "❤️") */
    emoji: string
    /** IDs de socket dos usuários que reagiram com este emoji */
    userIds: string[]
    /** Nomes dos usuários para exibição em tooltip */
    usernames: string[]
}

/**
 * Representa uma mensagem de chat.
 *
 * @remarks
 * Pode ser uma mensagem de usuário normal (userId !== 'system')
 * ou uma mensagem do sistema (ex: "João entrou na sala").
 * Integrada com Socket.io — timestamps são do lado do servidor.
 */
export interface Message {
    /** ID único (gerado pelo servidor) */
    id: string
    /** Socket ID do remetente (ou 'system' para mensagens do sistema) */
    userId: string
    /** Nome exibido do remetente */
    username: string
    /** Conteúdo textual da mensagem */
    content: string
    /** Timestamp da mensagem (do servidor para sincronização) */
    timestamp: Date
    /** ID da sala (campo para suporte futuro a múltiplas salas) */
    room?: string
    /** Reações de emoji adicionadas pelos usuários */
    reactions?: Reaction[]
}
