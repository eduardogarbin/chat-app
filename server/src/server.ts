import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';

import { ClientToServerEvents, ServerToClientEvents } from './types/socketEvents';
import router from './routes';
import { registerSocketHandlers } from './handlers/socketHandlers';
import { errorHandler } from './middlewares/errorHandler';
import { roomService } from './services/roomService';

const app = express();
const httpServer = createServer(app);

/**
 * Origens permitidas pelo CORS, lidas do arquivo .env.
 *
 * A variavel ALLOWED_ORIGINS suporta multiplas origens separadas por virgula.
 * Ex: "http://localhost:5173,https://meuapp.com"
 *
 * Caso a variavel nao esteja definida, cai no fallback de desenvolvimento.
 */
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') ?? ['http://localhost:5173'];

/**
 * Servidor Socket.IO tipado.
 *
 * Os generics <ClientToServerEvents, ServerToClientEvents> garantem que
 * o TypeScript valide todos os eventos emitidos e escutados em tempo de
 * compilacao, evitando erros de digitacao nos nomes de eventos.
 */
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST']
    }
});

const PORT = process.env.PORT || 3000;

// --- Middlewares globais ---
// Processam toda requisicao HTTP antes de chegar nas rotas.
app.use(cors({ origin: allowedOrigins }));
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

// --- Salas padrão ---
// Cria as salas iniciais (Geral, Tecnologia, Aleatório) antes de aceitar
// conexoes. A funcao verifica internamente se as salas ja existem,
// entao e seguro chama-la sempre que o servidor inicia.
roomService.seedDefaultRooms();

// --- Inicializacao ---
httpServer.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Socket.IO ativo e pronto para conexoes`);
});
