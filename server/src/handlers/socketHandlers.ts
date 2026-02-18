import { Server, Socket } from 'socket.io';
import { ClientToServerEvents, ServerToClientEvents } from '../types/socketEvents';
import { userService } from '../services/userService';
import { messageService } from '../services/messageService';

/**
 * Tipos auxiliares para evitar repeticao das generics do Socket.IO.
 *
 * O Socket.IO usa generics para garantir que os eventos emitidos e escutados
 * correspondam exatamente aos tipos definidos em socketEvents.ts. Sem isso,
 * o TypeScript nao saberia quais eventos sao validos nem o formato dos dados.
 */
type IO = Server<ClientToServerEvents, ServerToClientEvents>;
type AppSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

/**
 * Registra todos os handlers de eventos Socket.IO no servidor.
 *
 * Essa funcao recebe o servidor `io` e configura o que deve acontecer
 * a cada conexao e a cada evento emitido pelo cliente. Ela substitui
 * o bloco io.on('connection', ...) que antes ficava no server.ts.
 *
 * Ao isolar os handlers aqui, o server.ts se torna um arquivo de bootstrap
 * puro, sem logica de negocio.
 */
export function registerSocketHandlers(io: IO): void {
    io.on('connection', (socket: AppSocket) => {
        console.log(`Novo usuario conectado: ${socket.id}`);

        // --- Entrada no chat ---
        // O cliente envia o username escolhido na tela de login.
        // O servidor cria o usuario, envia boas-vindas para ele e
        // notifica todos os outros sobre a entrada do novo participante.
        socket.on('joinRoom', (username) => {
            console.log(`Usuario ${username} (${socket.id}) entrou no chat.`);

            const user = userService.addUser(socket.id, username);

            socket.emit('message', {
                id: new Date().getTime().toString(),
                userId: 'system',
                username: 'Sistema',
                content: `Bem-vindo, ${username}!`,
                timestamp: new Date(),
            });

            socket.broadcast.emit('userJoined', user);
            io.emit('roomUsers', userService.getAllUsers());
        });

        // --- Envio de mensagem ---
        // O cliente envia o conteudo de uma mensagem. O servidor valida,
        // armazena e transmite para todos os participantes conectados.
        socket.on('sendMessage', (content) => {
            const user = userService.getUser(socket.id);

            if (!user) {
                socket.emit('error', 'Usuario nao esta conectado');
                return;
            }

            const validation = messageService.validateContent(content);
            if (!validation.valid) {
                socket.emit('error', validation.error!);
                return;
            }

            const message = messageService.createMessage(user.id, user.username, content);
            messageService.addMessage(message);

            console.log(`Mensagem de ${user.username}: ${content}`);
            io.emit('message', message);
        });

        // --- Indicador de digitacao ---
        // Notifica os outros usuarios que este cliente esta digitando.
        // O frontend e responsavel por emitir stopTyping apos um timeout.
        socket.on('typing', () => {
            const user = userService.getUser(socket.id);
            if (user) {
                socket.broadcast.emit('userTyping', user.username);
            }
        });

        // --- Parada de digitacao ---
        socket.on('stopTyping', () => {
            const user = userService.getUser(socket.id);
            if (user) {
                socket.broadcast.emit('userStoppedTyping', user.username);
            }
        });

        // --- Reacoes a mensagens ---
        // O cliente envia o ID da mensagem e o emoji escolhido. O servidor
        // alterna a reacao (adiciona se nao existia, remove se ja existia)
        // e transmite a mensagem atualizada para todos.
        socket.on('toggleReaction', (messageId, emoji) => {
            const user = userService.getUser(socket.id);

            if (!user) {
                socket.emit('error', 'Usuario nao esta conectado');
                return;
            }

            const updatedMessage = messageService.toggleReaction(messageId, emoji, user.id, user.username);

            if (updatedMessage) {
                io.emit('messageUpdated', updatedMessage);
            }
        });

        // --- Desconexao ---
        // Disparado automaticamente pelo Socket.IO quando o cliente fecha
        // a aba, perde conexao ou faz logout. Remove o usuario da lista
        // e notifica os demais participantes.
        socket.on('disconnect', () => {
            const user = userService.removeUser(socket.id);
            if (user) {
                console.log(`Usuario desconectado: ${user.username} (${socket.id})`);
                io.emit('userLeft', user);
                io.emit('roomUsers', userService.getAllUsers());
            }
        });
    });
}
