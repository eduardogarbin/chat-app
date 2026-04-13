import { motion } from 'framer-motion'
import { getUserColor } from '../../utils/colors'
import { LogoutIcon } from '../ui/LogoutIcon'
import { getRoomIconPath } from '../../utils/roomIcons'
import { ThemeToggle } from '../ui/ThemeToggle'
import type { Room } from '../../types/room'

/**
 * Props para o componente ChatHeader.
 */
interface ChatHeaderProps {
    /** Nome do usuário logado */
    username: string
    /** Se o WebSocket está conectado (afeta cor do indicador) */
    isConnected: boolean
    /** Callback para logout do usuário */
    onLogout: () => void
    /** Callback para voltar à seleção de salas */
    onBackToRooms: () => void
    /** Número de usuários online na sala atual */
    onlineUsers: number
    /** Sala atual ou null (afeta exibição de nome/ícone) */
    currentRoom: Room | null
    /** Tema atual ('light' ou 'dark') */
    theme: 'light' | 'dark'
    /** Callback para alternar tema */
    toggleTheme: () => void
}

/**
 * Cabeçalho do chat com informações da sala, usuário e controles.
 *
 * @param props - {@link ChatHeaderProps}
 * @returns Barra fixa no topo com status, botões de ação e avatar do usuário
 *
 * @remarks
 * Layout em 3 seções:
 * 1. Esquerda: botão voltar + nome da sala com ícone + indicador online
 * 2. Direita: toggle de tema + avatar com nome + botão logout
 *
 * Indicadores visuais:
 * - Ponto verde/vermelho indica conexão WebSocket
 * - Ícone da sala muda conforme currentRoom
 * - Avatar com cor única baseada no username
 *
 * Responsivo:
 * - Desktop: layout horizontal completo
 * - Mobile: alguns elementos podem ficar empilhados
 *
 * @example
 * <ChatHeader
 *   username="alice"
 *   isConnected={true}
 *   onLogout={() => handleLogout()}
 *   onBackToRooms={() => handleBackToRooms()}
 *   onlineUsers={5}
 *   currentRoom={{ id: 'geral', name: 'Geral' }}
 *   theme="dark"
 *   toggleTheme={() => setTheme('light')}
 * />
 */
export const ChatHeader = ({ username, isConnected, onLogout, onBackToRooms, onlineUsers, currentRoom, theme, toggleTheme }: ChatHeaderProps) => {
    /** Cor única e consistente para o avatar do usuário */
    const userColor = getUserColor(username)
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-t-2xl border-b border-white/20 dark:border-gray-700/50 p-4 flex items-center justify-between shadow-md shadow-gray-900/3 dark:shadow-black/10 relative z-10"
        >
            <div className="flex items-center gap-3">
                <motion.button
                    whileHover={{ x: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onBackToRooms}
                    className="cursor-pointer flex items-center justify-center w-7 h-7 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    aria-label="Trocar sala"
                    title="Trocar sala"
                >
                    <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M13 8H3M7 4l-4 4 4 4" />
                    </svg>
                </motion.button>
                <div className="flex flex-col">
                    <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                        {currentRoom ? (
                            <>
                                <svg
                                    aria-hidden="true"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={1.75}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="w-4 h-4 text-violet-500 dark:text-violet-400 flex-shrink-0"
                                >
                                    <path d={getRoomIconPath(currentRoom.id)} />
                                </svg>
                                {currentRoom.name}
                            </>
                        ) : (
                            'Chat'
                        )}
                    </h1>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-500">
                        <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span>{onlineUsers} online</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                    <div
                        className="w-7 h-7 rounded-full flex items-center justify-center font-semibold text-xs shadow-md"
                        style={{
                            backgroundColor: userColor.bg,
                            color: userColor.textColor
                        }}
                    >
                        {username.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {username}
                    </span>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onLogout}
                    className="flex items-center justify-center gap-1.5 bg-red-500/90 dark:bg-red-600/90 text-white font-medium px-3 py-2 rounded-lg hover:bg-red-600 dark:hover:bg-red-700 transition-all shadow-md hover:shadow-lg text-sm"
                    aria-label="Sair"
                >
                    <div className="flex items-center gap-1.5">
                        <LogoutIcon />
                        <span className="leading-none">Sair</span>
                    </div>
                </motion.button>
            </div>
        </motion.div>
    )
}
