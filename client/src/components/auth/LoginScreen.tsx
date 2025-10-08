import { motion } from 'framer-motion'

interface LoginScreenProps {
    username: string
    setUsername: (username: string) => void
    onSubmit: (e: React.FormEvent) => void
}

export const LoginScreen = ({ username, setUsername, onSubmit }: LoginScreenProps) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md"
            >
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">
                    Bem-vindo ao Chat
                </h1>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Escolha seu nome de usuário
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Digite seu nome..."
                            autoFocus
                        />
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-lg"
                    >
                        Entrar no Chat
                    </motion.button>
                </form>
            </motion.div>
        </div>
    )
}
