# Chat App - Real-time Messaging

Uma aplicação de chat em tempo real construída com **Node.js**, **TypeScript** e **Socket.IO**.

## Tecnologias

- **Node.js** - Runtime JavaScript
- **TypeScript** - Tipagem estática
- **Express.js** - Framework web
- **Socket.IO** - WebSockets para tempo real
- **ESLint** - Linting de código

## Estrutura do Projeto

```
chat-app/
├── src/
│   ├── server.ts              # Servidor principal com Express + Socket.IO
│   └── types/                 # Definições TypeScript
│       ├── index.ts           # Re-exports centralizados
│       ├── user.ts            # Interface User
│       ├── message.ts         # Interface Message
│       ├── room.ts            # Interface Room (preparado)
│       └── socket-events.ts   # Eventos Socket.IO tipados
├── public/                    # Arquivos estáticos (preparado)
├── tests/                     # Testes automatizados (preparado)
├── test-client.ts             # Cliente de teste automatizado
├── DESENVOLVIMENTO.md         # Documentação técnica detalhada
└── dist/                      # Arquivos compilados (gerado)
```

## Instalação e Uso

### Pré-requisitos

- Node.js (v18 ou superior)
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone <repo-url>
cd chat-app

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev

# Build para produção
npm run build
npm start
```

## Endpoints

### API REST

- `GET /api/health` - Status do servidor

### Socket.IO Events

### **Cliente → Servidor**

#### `joinRoom(username: string)`

Usuário se identifica no chat com um nome de usuário.

```javascript
socket.emit("joinRoom", "MeuNome");
```

#### `sendMessage(content: string)`

Envia uma mensagem para todos os usuários conectados.

```javascript
socket.emit("sendMessage", "Olá pessoal!");
```

#### `leaveRoom()` _(preparado)_

Usuário sai da sala atual.

```javascript
socket.emit("leaveRoom");
```

### **Servidor → Cliente**

#### `message(message: Message)`

Nova mensagem recebida no chat.

```javascript
socket.on("message", (message) => {
  console.log(`${message.username}: ${message.content}`);
});
```

#### `userJoined(user: User)`

Notificação de que um usuário entrou no chat.

```javascript
socket.on("userJoined", (user) => {
  console.log(`${user.username} entrou no chat`);
});
```

#### `userLeft(user: User)`

Notificação de que um usuário saiu do chat.

```javascript
socket.on("userLeft", (user) => {
  console.log(`${user.username} saiu do chat`);
});
```

#### `roomUsers(users: User[])`

Lista atualizada de todos os usuários online.

```javascript
socket.on("roomUsers", (users) => {
  console.log(`Usuários online: ${users.length}`);
});
```

#### `error(error: string)`

Mensagem de erro do servidor.

```javascript
socket.on("error", (error) => {
  console.error(`Erro: ${error}`);
});
```

## Desenvolvimento

```bash
# Modo desenvolvimento (com hot reload)
npm run dev

# Linting
npm run lint

# Build
npm run build
```

## Como Testar o Sistema

### 1. Testando com o Cliente Automatizado

O projeto inclui um cliente de teste que simula um usuário real:

```bash
# Terminal 1: Iniciar o servidor
npm run dev

# Terminal 2: Executar o cliente de teste
npx tsx test-client.ts
```

O cliente de teste irá:

- Conectar automaticamente ao servidor
- Enviar evento `joinRoom` com username aleatório
- Enviar 4 mensagens de teste em intervalos de 2 segundos
- Desconectar após 15 segundos
- Mostrar logs detalhados de todos os eventos

### 2. Testando com Socket.IO Client (Manual)

```javascript
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

// Conectar e entrar no chat
socket.on("connect", () => {
  socket.emit("joinRoom", "MeuNome");
});

// Ouvir mensagens
socket.on("message", (msg) => {
  console.log(`${msg.username}: ${msg.content}`);
});

// Enviar mensagem
socket.emit("sendMessage", "Olá pessoal!");
```

### 3. Verificando a API REST

```bash
# Verificar status do servidor
curl http://localhost:3000/api/health
```

### 4. Logs e Debug

O servidor exibe logs detalhados no console:

- Conexões e desconexões de usuários
- Mensagens enviadas/recebidas
- Erros de validação
- Estado da lista de usuários

## Status das Funcionalidades

### ✅ Implementado

- [x] **Servidor básico com Socket.IO** - Servidor HTTP + WebSocket funcional
- [x] **Sistema de usuários** - Gerenciamento completo de conexões
- [x] **Histórico de mensagens** - Últimas 100 mensagens em memória
- [x] **Sistema de validações** - Validação de entrada e sanitização
- [x] **Notificações em tempo real** - Entrada/saída de usuários
- [x] **Lista de usuários online** - Atualização automática
- [x] **Cliente de teste** - Script automatizado para testes

### 🚧 Em desenvolvimento

- [ ] **Salas de chat múltiplas** - Sistema de rooms
- [ ] **Interface web** - Frontend para o chat
- [ ] **Testes automatizados** - Suíte de testes unitários/integração

### 📋 Planejado

- [ ] **Persistência** - Banco de dados para histórico
- [ ] **Autenticação** - Sistema de login/registro
- [ ] **Mensagens privadas** - Chat direto entre usuários

## Licença

MIT

---
