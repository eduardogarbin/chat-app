
import { io } from 'socket.io-client';

// Conecta ao servidor que está rodando localmente
const socket = io('http://localhost:3000');

const USERNAME = `TestUser_${Math.floor(Math.random() * 1000)}`;

console.log(`--- Iniciando cliente de teste como: ${USERNAME} ---\n`);

// --- OUVINTES DE EVENTOS DO SERVIDOR ---

socket.on('connect', () => {
    console.log(`[CLIENTE] Conectado ao servidor com ID: ${socket.id}`);

    // Após conectar, vamos nos "logar" no chat
    console.log(`[CLIENTE] Enviando evento 'joinRoom' com username: ${USERNAME}`);
    socket.emit('joinRoom', USERNAME);
});

socket.on('disconnect', () => {
    console.log('\n[CLIENTE] Desconectado do servidor.');
});

// Ouve mensagens gerais (como a de boas-vindas)
socket.on('message', (msg) => {
    console.log(`\n[MSG DO SERVIDOR]`);
    console.log(`  Usuário: ${msg.username}`);
    console.log(`  Conteúdo: ${msg.content}`);
    console.log(`  Timestamp: ${msg.timestamp}`);
});

// Ouve quando um novo usuário entra
socket.on('userJoined', (user) => {
    console.log(`\n[EVENTO] Usuário entrou: ${user.username} (ID: ${user.id})`);
});

// Ouve quando um usuário sai
socket.on('userLeft', (user) => {
    console.log(`\n[EVENTO] Usuário saiu: ${user.username} (ID: ${user.id})`);
});

// Ouve a atualização da lista de usuários
socket.on('roomUsers', (users) => {
    console.log('\n[EVENTO] Lista de usuários atualizada:');
    console.table(users);
});

// Ouve erros do servidor
socket.on('error', (error) => {
    console.log(`\n[ERRO DO SERVIDOR]: ${error}`);
});

socket.on('connect_error', (err) => {
    console.error(`\n[ERRO] Não foi possível conectar ao servidor: ${err.message}`);
});

// Função para simular envio de mensagens
function sendTestMessages() {
    const testMessages = [
        "Olá pessoal!",
        "Como estão?",
        "Este é um teste do sistema de mensagens",
        "Funciona perfeitamente! 🚀"
    ];

    testMessages.forEach((message, index) => {
        setTimeout(() => {
            console.log(`\n[CLIENTE] Enviando mensagem: "${message}"`);
            socket.emit('sendMessage', message);
        }, (index + 1) * 2000); // Envia a cada 2 segundos
    });
}

// Depois de 1 segundo conectado, começa a enviar mensagens de teste
setTimeout(() => {
    console.log('\n--- Iniciando teste de mensagens ---');
    sendTestMessages();
}, 1000);

// Deixa o cliente rodando por 15 segundos e depois desconecta
setTimeout(() => {
    console.log('\n--- Desconectando cliente de teste --- ');
    socket.disconnect();
}, 15000);
