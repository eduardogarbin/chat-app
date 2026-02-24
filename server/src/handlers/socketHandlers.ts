import { Server, Socket } from 'socket.io';
import { ClientToServerEvents, ServerToClientEvents } from '../types/socketEvents';
import { userService } from '../services/userService';
import { messageService } from '../services/messageService';
import { roomService } from '../services/roomService';

/**
 * Tipos auxiliares para evitar repetição das generics do Socket.IO.
 *
 * O Socket.IO usa generics para garantir que os eventos emitidos e escutados
 * correspondam exatamente aos tipos definidos em socketEvents.ts. Sem isso,
 * o TypeScript não saberia quais eventos são válidos nem o formato dos dados.
 */
type IO = Server<ClientToServerEvents, ServerToClientEvents>;
type AppSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

/**
 * Registra todos os handlers de eventos Socket.IO no servidor.
 *
 * Essa função recebe o servidor `io` e configura o que deve acontecer
 * a cada conexão e a cada evento emitido pelo cliente.
 *
 * Com múltiplas salas, todos os broadcasts passam a ser escopados por sala
 * usando `io.to(roomId).emit(...)`, garantindo que mensagens, notificações
 * de entrada/saída e indicadores de digitação chegam apenas aos participantes
 * da sala correta.
 */
export function registerSocketHandlers(io: IO): void {
    io.on('connection', (socket: AppSocket) => {
        console.log(`Novo usuário conectado: ${socket.id}`);

        // --- Lista de salas ---
        // O cliente pede a lista de salas disponíveis logo após conectar,
        // antes de fazer login. A resposta vai apenas para esse socket.
        socket.on('getRooms', () => {
            socket.emit('roomsList', roomService.listRooms());
        });

        // --- Entrada na sala ---
        // O cliente envia username e o ID da sala escolhida.
        // Se o usuário já estava em outra sala (troca de sala), saímos
        // dela primeiro para que os broadcasts não cheguem no lugar errado.
        // socket.join(roomId) registra este socket no canal da sala no
        // Socket.IO — a partir daí, io.to(roomId).emit() inclui este socket.
        socket.on('joinRoom', (username, roomId) => {
            const room = roomService.getRoom(roomId);
            if (!room) {
                socket.emit('error', 'Sala não encontrada');
                return;
            }

            let user = userService.getUser(socket.id);
            const isSwitchingRooms = !!user;

            if (isSwitchingRooms) {
                // Usuário já existe — está trocando de sala.
                const oldRoomId = user!.room;
                if (oldRoomId && oldRoomId !== roomId) {
                    socket.leave(oldRoomId);
                    io.to(oldRoomId).emit('userLeft', user!);
                    io.to(oldRoomId).emit('roomUsers', userService.getUsersByRoom(oldRoomId));
                    console.log(`${user!.username} saiu de #${oldRoomId} e entrou em #${roomId}`);
                }
            } else {
                // Primeira vez que este socket entra em uma sala.
                user = userService.addUser(socket.id, username);
                console.log(`Usuário ${username} (${socket.id}) entrou no chat.`);
            }

            // Atualiza a sala do usuário e registra no canal do Socket.IO.
            userService.setUserRoom(socket.id, roomId);
            socket.join(roomId);

            // Envia o histórico de mensagens da sala apenas para quem entrou.
            const history = messageService.getMessagesByRoom(roomId);
            socket.emit('messageHistory', history);

            // Mensagem de boas-vindas apenas para quem entrou.
            const welcomeText = isSwitchingRooms
                ? `Você entrou em #${room.name}`
                : `Bem-vindo, ${username}! Você entrou em #${room.name}.`;

            socket.emit('message', {
                id: new Date().getTime().toString(),
                userId: 'system',
                username: 'Sistema',
                content: welcomeText,
                timestamp: new Date(),
            });

            // Notifica os outros membros da nova sala sobre a entrada.
            socket.broadcast.to(roomId).emit('userJoined', user!);

            // Envia a lista atualizada de usuários para toda a sala.
            io.to(roomId).emit('roomUsers', userService.getUsersByRoom(roomId));
        });

        // --- Envio de mensagem ---
        // O servidor sabe a sala do usuário pelo estado armazenado em memória.
        // O cliente não precisa informar a sala em cada mensagem — isso
        // simplifica o protocolo e evita que o cliente falsifique a sala.
        socket.on('sendMessage', (content) => {
            const user = userService.getUser(socket.id);

            if (!user || !user.room) {
                socket.emit('error', 'Usuário não está em uma sala');
                return;
            }

            const validation = messageService.validateContent(content);
            if (!validation.valid) {
                socket.emit('error', validation.error!);
                return;
            }

            const message = messageService.createMessage(user.id, user.username, content, user.room);
            messageService.addMessage(message);

            console.log(`[#${user.room}] ${user.username}: ${content}`);

            // Emite apenas para os sockets presentes na sala do usuário.
            io.to(user.room).emit('message', message);
        });

        // --- Indicador de digitação ---
        // Usa a sala do usuário para escopar o broadcast — só os membros
        // da mesma sala verão o indicador de digitação.
        socket.on('typing', () => {
            const user = userService.getUser(socket.id);
            if (user && user.room) {
                socket.broadcast.to(user.room).emit('userTyping', user.username);
            }
        });

        // --- Parada de digitação ---
        socket.on('stopTyping', () => {
            const user = userService.getUser(socket.id);
            if (user && user.room) {
                socket.broadcast.to(user.room).emit('userStoppedTyping', user.username);
            }
        });

        // --- Reações a mensagens ---
        // A mensagem atualizada é enviada apenas para a sala onde ela existe.
        socket.on('toggleReaction', (messageId, emoji) => {
            const user = userService.getUser(socket.id);

            if (!user || !user.room) {
                socket.emit('error', 'Usuário não está em uma sala');
                return;
            }

            const updatedMessage = messageService.toggleReaction(messageId, emoji, user.id, user.username);

            if (updatedMessage) {
                io.to(user.room).emit('messageUpdated', updatedMessage);
            }
        });

        // --- Desconexão ---
        // Notifica apenas a sala que perdeu o usuário — os outros membros
        // do servidor em salas diferentes não precisam saber.
        socket.on('disconnect', () => {
            const user = userService.removeUser(socket.id);
            if (user) {
                console.log(`Usuário desconectado: ${user.username} (${socket.id})`);
                if (user.room) {
                    io.to(user.room).emit('userLeft', user);
                    io.to(user.room).emit('roomUsers', userService.getUsersByRoom(user.room));
                }
            }
        });
    });
}
