/**
 * Representa uma sala de chat
 */
export interface Room {
    id: string;           // ID único da sala
    name: string;         // Nome da sala ("Geral", "JavaScript", "Random")
    description?: string; // Descrição opcional da sala
    createdAt: Date;      // Quando a sala foi criada
    maxUsers?: number;    // Limite de usuários (opcional)
}