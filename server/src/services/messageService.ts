import { Message } from '../types/message';

class MessageService {
  private messages: Message[] = [];
  private readonly MAX_MESSAGES = 100;

  validateContent(content: string): { valid: boolean; error?: string } {
    if (!content || content.trim().length === 0) {
      return { valid: false, error: 'Mensagem não pode estar vazia' };
    }

    if (content.length > 500) {
      return { valid: false, error: 'Mensagem muito longa (máximo 500 caracteres)' };
    }

    return { valid: true };
  }

  createMessage(userId: string, username: string, content: string, roomId?: string): Message {
    const message: Message = {
      id: new Date().getTime().toString() + Math.random().toString(36).slice(2, 11),
      userId,
      username,
      content: content.trim(),
      timestamp: new Date(),
      room: roomId,
    };
    return message;
  }

  addMessage(message: Message): void {
    this.messages.push(message);

    if (this.messages.length > this.MAX_MESSAGES) {
      this.messages.shift();
    }
  }

  getMessages(): Message[] {
    return [...this.messages];
  }

  /**
   * Retorna as últimas N mensagens de uma sala específica.
   *
   * slice(-limit) pega os últimos `limit` elementos do array — se o array
   * tiver menos elementos do que o limite, retorna tudo. É a forma mais
   * concisa de implementar "últimas N mensagens" sem precisar reverter
   * ou calcular índices manualmente.
   */
  getMessagesByRoom(roomId: string, limit = 50): Message[] {
    const roomMessages = this.messages.filter(m => m.room === roomId);
    return roomMessages.slice(-limit);
  }

  toggleReaction(messageId: string, emoji: string, userId: string, username: string): Message | null {
    const message = this.messages.find(m => m.id === messageId);
    if (!message) {
      return null;
    }

    // Inicializa reactions se não existir
    if (!message.reactions) {
      message.reactions = [];
    }

    // Procura se já existe uma reação com esse emoji
    const reactionIndex = message.reactions.findIndex(r => r.emoji === emoji);

    if (reactionIndex >= 0) {
      // Reação já existe
      const reaction = message.reactions[reactionIndex];

      // Guard defensivo exigido pelo noUncheckedIndexedAccess: embora o
      // findIndex acima garanta que o elemento existe, o TypeScript trata
      // todo acesso por indice como possivelmente undefined nesse modo strict.
      if (!reaction) return message;

      const userIndex = reaction.userIds.indexOf(userId);

      if (userIndex >= 0) {
        // Usuário já reagiu com esse emoji - remove a reação
        reaction.userIds.splice(userIndex, 1);
        reaction.usernames.splice(userIndex, 1);

        // Se não há mais ninguém com essa reação, remove o emoji completamente
        if (reaction.userIds.length === 0) {
          message.reactions.splice(reactionIndex, 1);
        }
      } else {
        // Usuário ainda não reagiu com esse emoji - adiciona
        reaction.userIds.push(userId);
        reaction.usernames.push(username);
      }
    } else {
      // Primeira vez que alguém reage com esse emoji
      message.reactions.push({
        emoji,
        userIds: [userId],
        usernames: [username]
      });
    }

    return message;
  }
}

export const messageService = new MessageService();