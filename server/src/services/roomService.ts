import { Room } from '../types/room';

class RoomService {
    private rooms = new Map<string, Room>();

    /**
     * Cria uma nova sala e a registra no Map interno.
     *
     * O ID é gerado a partir do nome: letras minúsculas, espaços viram hífens.
     * Ex: "Tecnologia" → "tecnologia", "Sala Geral" → "sala-geral".
     */
    createRoom(name: string, description?: string): Room {
        const id = name.toLowerCase().replace(/\s+/g, '-');
        const room: Room = {
            id,
            name,
            description,
            createdAt: new Date(),
        };
        this.rooms.set(id, room);
        return room;
    }

    getRoom(id: string): Room | undefined {
        return this.rooms.get(id);
    }

    listRooms(): Room[] {
        return Array.from(this.rooms.values());
    }

    /**
     * Popula o servidor com salas padrão na primeira inicialização.
     *
     * Ao verificar se rooms.size === 0, garantimos que as salas não são
     * duplicadas caso seedDefaultRooms seja chamada mais de uma vez.
     * Isso é seguro chamar no bootstrap do servidor.
     */
    seedDefaultRooms(): void {
        if (this.rooms.size === 0) {
            this.createRoom('Geral', 'Sala principal para conversas gerais');
            this.createRoom('Tecnologia', 'Discussões sobre programação e inovação');
            this.createRoom('Aleatório', 'Tópicos variados e descontraídos');
        }
    }
}

export const roomService = new RoomService();
