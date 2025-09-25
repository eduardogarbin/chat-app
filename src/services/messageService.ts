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

  createMessage(userId: string, username: string, content: string): Message {
    const message: Message = {
      id: new Date().getTime().toString() + Math.random().toString(36).substr(2, 9),
      userId,
      username,
      content: content.trim(),
      timestamp: new Date()
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
}

export const messageService = new MessageService();