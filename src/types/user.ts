/**
 * Representa um usuário conectado no chat
 */
export interface User {
  id: string;        // ID único do socket (gerado automaticamente)
  username: string;  // Nome escolhido pelo usuário  
  room?: string;     // Sala atual (opcional - usuário pode não estar em sala)
  joinedAt: Date;    // Quando se conectou
}