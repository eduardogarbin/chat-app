import { User } from '../types/user';

class UserService {
    private users = new Map<string, User>();

    addUser(socketId: string, username: string): User {
        const user: User = {
            id: socketId,
            username,
            joinedAt: new Date()
        };
        this.users.set(socketId, user);
        return user;
    }

    removeUser(socketId: string): User | undefined {
        const user = this.users.get(socketId);
        if (user) {
            this.users.delete(socketId);
        }
        return user;
    }

    getUser(socketId: string): User | undefined {
        return this.users.get(socketId);
    }

    getAllUsers(): User[] {
        return Array.from(this.users.values());
    }

    /**
     * Atualiza a sala atual do usuário.
     *
     * Chamado quando o usuário entra ou troca de sala via evento joinRoom.
     * Como o objeto User é armazenado por referência no Map, a mutação
     * direta de user.room reflete imediatamente em qualquer outra leitura
     * do mesmo objeto.
     */
    setUserRoom(socketId: string, roomId: string): void {
        const user = this.users.get(socketId);
        if (user) {
            user.room = roomId;
        }
    }

    /**
     * Retorna todos os usuários presentes em uma sala específica.
     *
     * Usado para emitir o evento roomUsers apenas com os participantes
     * da sala afetada, em vez de enviar a lista global de todos os
     * usuários conectados no servidor.
     */
    getUsersByRoom(roomId: string): User[] {
        return Array.from(this.users.values()).filter(u => u.room === roomId);
    }
}

export const userService = new UserService();