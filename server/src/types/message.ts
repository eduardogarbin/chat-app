/**
 * Representa uma reação em uma mensagem
 */
export interface Reaction {
    emoji: string;     // O emoji da reação
    userIds: string[]; // IDs dos usuários que reagiram
    usernames: string[]; // Nomes dos usuários que reagiram
}

/**
 * Representa uma mensagem no chat
 */
export interface Message {
    id: string;        // ID único da mensagem
    userId: string;    // Quem enviou (referencia User.id)
    username: string;  // Nome de quem enviou (para não precisar buscar)
    content: string;   // Texto da mensagem
    timestamp: Date;   // Quando foi enviada
    room?: string;     // Em qual sala (opcional - mensagem privada?)
    reactions?: Reaction[]; // Reações à mensagem
}