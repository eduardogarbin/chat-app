import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';

// Importando os tipos que criamos
import { User } from './types/user';
import { ClientToServerEvents, ServerToClientEvents } from './types/socket-events';

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

// --- Armazenamento em Memória ---
// Uma lista simples para guardar os usuários conectados.
// A chave é o socket.id e o valor é o objeto User.
const users = new Map<string, User>();

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
    const user: User = {
      id: socket.id,
      username,
      joinedAt: new Date()
    };
    users.set(socket.id, user);

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
    io.emit('roomUsers', Array.from(users.values()));
  });

  // Passo 2: Quando um usuário desconecta, removemos ele da lista
  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      console.log(`Usuário desconectado: ${user.username} (${socket.id})`);
      users.delete(socket.id);

      // Informa a todos que o usuário saiu e atualiza a lista
      io.emit('userLeft', user);
      io.emit('roomUsers', Array.from(users.values()));
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Socket.IO ativo e pronto para conexões`);
});
