import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';

// Importando os tipos que criamos
import { ClientToServerEvents, ServerToClientEvents } from './types/socket-events';
import { userService } from './services/userService';
import { messageService } from './services/messageService';

const app = express();
const httpServer = createServer(app);

// Tipando o servidor Socket.IO para termos autocomplete e segurança de tipos
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3000;

// --- Configuração do servidor ---

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Rota de teste
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Chat server is running!',
        timestamp: new Date().toISOString()
    });
});

// --- Lógica do Socket.IO ---
io.on('connection', (socket) => {
    console.log(`Novo usuário conectado: ${socket.id}`);

    // Passo 1: O servidor agora espera o cliente se identificar.
    // O evento 'joinRoom' agora serve para "logar" no chat.
    socket.on('joinRoom', (username) => {
        console.log(`Usuário ${username} (${socket.id}) entrou no chat.`);

        // Cria e armazena o novo usuário
        const user = userService.addUser(socket.id, username);

        // Informa o cliente que ele conectou com sucesso
        socket.emit('message', {
            id: new Date().getTime().toString(),
            userId: 'system',
            username: 'Sistema',
            content: `Bem-vindo, ${username}!`,
            timestamp: new Date(),
        });

        // Informa os outros usuários que alguém novo entrou
        socket.broadcast.emit('userJoined', user);

        // Atualiza a lista de usuários para todos os clientes
        io.emit('roomUsers', userService.getAllUsers());
    });

    // Passo 2: Handling de envio de mensagens
    socket.on('sendMessage', (content) => {
        const user = userService.getUser(socket.id);

        // Validações básicas
        if (!user) {
            socket.emit('error', 'Usuário não está conectado');
            return;
        }

        // Validar conteúdo da mensagem
        const validation = messageService.validateContent(content);
        if (!validation.valid) {
            socket.emit('error', validation.error!);
            return;
        }

        // Criar e armazenar a mensagem
        const message = messageService.createMessage(user.id, user.username, content);
        messageService.addMessage(message);

        console.log(`Mensagem de ${user.username}: ${content}`);

        // Enviar mensagem para todos os usuários conectados
        io.emit('message', message);
    });

    // Evento de digitação
    socket.on('typing', () => {
        const user = userService.getUser(socket.id);
        if (user) {
            socket.broadcast.emit('userTyping', user.username);
        }
    });

    // Evento de parada de digitação
    socket.on('stopTyping', () => {
        const user = userService.getUser(socket.id);
        if (user) {
            socket.broadcast.emit('userStoppedTyping', user.username);
        }
    });

    // Evento de adicionar/remover reação
    socket.on('toggleReaction', (messageId: string, emoji: string) => {
        const user = userService.getUser(socket.id);
        if (!user) {
            socket.emit('error', 'Usuário não está conectado');
            return;
        }

        const updatedMessage = messageService.toggleReaction(messageId, emoji, user.id, user.username);

        if (updatedMessage) {
            // Envia a mensagem atualizada para todos os clientes
            io.emit('messageUpdated', updatedMessage);
        }
    });

    // Passo 3: Quando um usuário desconecta, removemos ele da lista
    socket.on('disconnect', () => {
        const user = userService.removeUser(socket.id);
        if (user) {
            console.log(`Usuário desconectado: ${user.username} (${socket.id})`);

            // Informa a todos que o usuário saiu e atualiza a lista
            io.emit('userLeft', user);
            io.emit('roomUsers', userService.getAllUsers());
        }
    });
});

httpServer.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Socket.IO ativo e pronto para conexões`);
});
