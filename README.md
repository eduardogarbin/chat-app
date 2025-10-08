# Chat App - Real-time Messaging

Uma aplicação de chat em tempo real com backend Node.js + Socket.IO e frontend React + TypeScript.

## Estrutura do Projeto (Monorepo)

```
chat-app/
├── server/                    # Backend (Node.js + Socket.IO)
│   ├── src/
│   │   ├── server.ts          # Servidor principal
│   │   ├── controllers/       # Controladores
│   │   ├── handlers/          # Handlers de eventos
│   │   ├── middlewares/       # Middlewares
│   │   ├── models/            # Modelos de dados
│   │   ├── routes/            # Rotas da API
│   │   ├── services/          # Serviços e lógica de negócio
│   │   ├── types/             # Definições TypeScript
│   │   └── utils/             # Utilitários
│   ├── tests/                 # Testes do backend
│   ├── dist/                  # Build do backend
│   └── package.json
│
├── client/                    # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/          # Componentes de autenticação
│   │   │   │   └── LoginScreen.tsx
│   │   │   └── chat/          # Componentes do chat
│   │   │       ├── ChatHeader.tsx
│   │   │       ├── ChatInput.tsx
│   │   │       ├── MessageList.tsx
│   │   │       └── MessageItem.tsx
│   │   ├── types/             # Tipos TypeScript
│   │   │   └── message.ts
│   │   ├── App.tsx            # Componente principal
│   │   ├── main.tsx           # Entry point
│   │   └── index.css          # Estilos globais
│   ├── public/                # Arquivos estáticos
│   └── package.json
│
├── .gitignore
└── README.md                  # Este arquivo
```

## Tecnologias

### Backend
- **Node.js** - Runtime JavaScript
- **TypeScript** - Tipagem estática
- **Express.js** - Framework web
- **Socket.IO** - WebSockets para comunicação em tempo real
- **CORS** - Cross-Origin Resource Sharing

### Frontend
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS v4** - Framework CSS utilitário
- **Framer Motion** - Animações
- **Socket.IO Client** - Cliente WebSocket

## Instalação e Execução

### Pré-requisitos
- Node.js (v18 ou superior)
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone <repo-url>
cd chat-app

# Instalar dependências do backend
cd server
npm install

# Instalar dependências do frontend
cd ../client
npm install
```

### Execução em Desenvolvimento

```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend
cd client
npm run dev
```

O servidor backend estará rodando em `http://localhost:3000`
O frontend estará rodando em `http://localhost:5173`

### Build para Produção

```bash
# Backend
cd server
npm run build
npm start

# Frontend
cd client
npm run build
npm run preview
```

## Funcionalidades

### Implementadas ✅
- Sistema de chat em tempo real
- Entrada/saída de usuários com notificações
- Tela de login com validação
- Envio e recebimento de mensagens
- Indicador de status de conexão
- Interface responsiva com tema claro/escuro
- Animações suaves
- Auto-scroll de mensagens
- Botão de logout

### Em Desenvolvimento 🚧
- Persistência de mensagens
- Múltiplas salas de chat
- Mensagens privadas

## API do Socket.IO

### Cliente → Servidor
- `joinRoom(username)` - Entrar no chat
- `sendMessage(content)` - Enviar mensagem
- `leaveRoom()` - Sair do chat

### Servidor → Cliente
- `message(message)` - Nova mensagem
- `userJoined(user)` - Usuário entrou
- `userLeft(user)` - Usuário saiu
- `roomUsers(users)` - Lista de usuários online
- `error(message)` - Erro

## Scripts Disponíveis

### Backend (`server/`)
- `npm run dev` - Iniciar em modo desenvolvimento
- `npm run build` - Build para produção
- `npm start` - Iniciar servidor de produção
- `npm run lint` - Executar linting

### Frontend (`client/`)
- `npm run dev` - Iniciar dev server
- `npm run build` - Build para produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executar linting

## Documentação Adicional

Para documentação técnica detalhada do backend, consulte `server/README.md`

## Licença

MIT

---

**Desenvolvido com Node.js, React, TypeScript e Socket.IO**
