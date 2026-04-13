import { motion } from 'framer-motion'
import { ThemeToggle } from '../ui/ThemeToggle'

/**
 * Props para o componente LoginScreen.
 */
interface LoginScreenProps {
    /** Nome de usuário atual (valor do input) */
    username: string
    /** Callback para atualizar o nome (setState do App) */
    setUsername: (username: string) => void
    /** Callback ao submeter o formulário (avança para seleção de sala) */
    onSubmit: (e: React.FormEvent) => void
    /** Tema atual ('light' ou 'dark') */
    theme: 'light' | 'dark'
    /** Callback para alternar tema */
    toggleTheme: () => void
}

/**
 * Primeira tela de login: entrada de nome de usuário.
 *
 * @param props - {@link LoginScreenProps}
 * @returns Tela full-screen com formulário de entrada de nome
 *
 * @remarks
 * Parte 1 do fluxo de login em 2 etapas:
 * 1. LoginScreen (aqui) - entrada de nome
 * 2. RoomSelectScreen - seleção de sala
 *
 * Features:
 * - Input controlado (valor vem do estado do App)
 * - Validação mínima (feita no App.tsx)
 * - Theme toggle no canto superior direito
 * - Logo LoroChat com mascote (parrot-icon.png)
 * - Animação suave de entrada
 * - Input com auto-focus
 *
 * Responsivo:
 * - Desktop: card centralizado com max-width
 * - Mobile: padding reduzido, adapta à tela
 *
 * @example
 * <LoginScreen
 *   username={username}
 *   setUsername={setUsername}
 *   onSubmit={handleSetUsername}
 *   theme="dark"
 *   toggleTheme={() => setTheme('light')}
 * />
 */
export const LoginScreen = ({ username, setUsername, onSubmit, theme, toggleTheme }: LoginScreenProps) => {
    return (
        <div className="relative min-h-screen bg-gradient-to-br from-violet-100 via-pink-50 to-blue-100 dark:from-gray-900 dark:via-violet-950 dark:to-gray-900 flex items-center justify-center p-4">
            <div className="absolute top-4 right-4">
                <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            </div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/50 p-8 w-full max-w-md shadow-2xl shadow-violet-500/10"
            >
                <div className="flex items-center gap-3 mb-6">
                    <img src="/parrot-icon.png" alt="" className="w-11 h-11 object-contain" />
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        Loro<span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">Chat</span>
                    </h1>
                </div>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-base font-medium text-gray-700 dark:text-gray-400 mb-2">
                            Nome de usuário
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300/50 dark:border-gray-700/50 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-500 transition-all"
                            placeholder="Digite seu nome..."
                            autoFocus
                        />
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="submit"
                        className="w-full bg-violet-600 dark:bg-violet-500 text-white font-medium py-2.5 rounded-md hover:bg-violet-700 dark:hover:bg-violet-600 transition-colors shadow-sm"
                    >
                        Entrar
                    </motion.button>
                </form>
            </motion.div>
        </div>
    )
}
