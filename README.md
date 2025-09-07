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
src/
├── controllers/    # Lógica de negócio
├── middlewares/    # Validações e autenticação
├── models/         # Estruturas de dados
├── routes/         # Rotas da API REST
├── services/       # Socket.IO e lógica de chat
├── types/          # Definições TypeScript
└── utils/          # Funções auxiliares

public/             # Arquivos estáticos
tests/              # Testes automatizados
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

- `connection` - Conexão estabelecida
- `message` - Nova mensagem
- `disconnect` - Usuário desconectado

## Desenvolvimento

```bash
# Modo desenvolvimento (com hot reload)
npm run dev

# Linting
npm run lint

# Build
npm run build
```

## Features Planejadas

- [x] Servidor básico com Socket.IO
- [ ] Sistema de usuários
- [ ] Salas de chat
- [ ] Histórico de mensagens
- [ ] Interface web
- [ ] Testes automatizados

## Licença

MIT

---
