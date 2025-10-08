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
}

export const userService = new UserService();