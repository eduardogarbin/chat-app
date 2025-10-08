import { Message, User } from './';

/**
 * Eventos que o SERVIDOR envia para o CLIENTE
 */
export interface ServerToClientEvents {
  // Mensagem nova no chat
  message: (message: Message) => void;

  // Usuário entrou na sala
  userJoined: (user: User) => void;

  // Usuário saiu da sala
  userLeft: (user: User) => void;

  // Lista de usuários na sala atual
  roomUsers: (users: User[]) => void;

  // Erro do servidor
  error: (error: string) => void;
}

/**
 * Eventos que o CLIENTE envia para o SERVIDOR
 */
export interface ClientToServerEvents {
  // Enviar mensagem
  sendMessage: (content: string) => void;

  // Entrar no chat com username
  joinRoom: (username: string) => void;

  // Sair da sala atual
  leaveRoom: () => void;
}