import { Message, User, Room } from './';

/**
 * Eventos que o SERVIDOR envia para o CLIENTE
 */
export interface ServerToClientEvents {
  // Mensagem nova no chat
  message: (message: Message) => void;

  // Mensagem atualizada (ex: nova reação adicionada ou removida)
  messageUpdated: (message: Message) => void;

  // Histórico de mensagens da sala ao entrar nela
  messageHistory: (messages: Message[]) => void;

  // Usuário entrou na sala
  userJoined: (user: User) => void;

  // Usuário saiu da sala
  userLeft: (user: User) => void;

  // Lista de usuários na sala atual
  roomUsers: (users: User[]) => void;

  // Lista de salas disponíveis no servidor
  roomsList: (rooms: Room[]) => void;

  // Usuário está digitando
  userTyping: (username: string) => void;

  // Usuário parou de digitar
  userStoppedTyping: (username: string) => void;

  // Erro do servidor
  error: (error: string) => void;
}

/**
 * Eventos que o CLIENTE envia para o SERVIDOR
 */
export interface ClientToServerEvents {
  // Enviar mensagem (o servidor sabe a sala pelo estado do usuário)
  sendMessage: (content: string) => void;

  // Entrar em uma sala específica com username e ID da sala
  joinRoom: (username: string, roomId: string) => void;

  // Sair da sala atual
  leaveRoom: () => void;

  // Solicitar a lista de salas disponíveis
  getRooms: () => void;

  // Notificar que está digitando
  typing: () => void;

  // Notificar que parou de digitar
  stopTyping: () => void;

  // Adicionar ou remover uma reação de emoji em uma mensagem
  toggleReaction: (messageId: string, emoji: string) => void;
}
