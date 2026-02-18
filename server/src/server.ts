import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';

import { ClientToServerEvents, ServerToClientEvents } from './types/socketEvents';
import router from './routes';
import { registerSocketHandlers } from './handlers/socketHandlers';
import { errorHandler } from './middlewares/errorHandler';

const app = express();
const httpServer = createServer(app);

/**
 * Servidor Socket.IO tipado.
 *
 * Os generics <ClientToServerEvents, ServerToClientEvents> garantem que
 * o TypeScript valide todos os eventos emitidos e escutados em tempo de
 * compilacao, evitando erros de digitacao nos nomes de eventos.
 */
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const PORT = process.env.PORT || 3000;

// --- Middlewares globais ---
// Processam toda requisicao HTTP antes de chegar nas rotas.
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// --- Rotas HTTP ---
// O router contem todas as rotas REST da aplicacao.
app.use(router);

// --- Middleware de erro ---
// Deve ser registrado DEPOIS de todas as rotas para funcionar como
// "rede de seguranca": so e ativado quando uma rota lanca um erro.
app.use(errorHandler);

// --- Handlers Socket.IO ---
// Registra todos os eventos de tempo real (joinRoom, sendMessage, etc.).
registerSocketHandlers(io);

// --- Inicializacao ---
httpServer.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Socket.IO ativo e pronto para conexoes`);
});
