import { motion } from 'framer-motion'

interface LoginScreenProps {
    username: string
    setUsername: (username: string) => void
    onSubmit: (e: React.FormEvent) => void
}

export const LoginScreen = ({ username, setUsername, onSubmit }: LoginScreenProps) => {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-8 w-full max-w-md"
            >
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                    Chat App
                </h1>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                            Nome de usuário
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 transition-all"
                            placeholder="Digite seu nome..."
                            autoFocus
                        />
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="submit"
                        className="w-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-medium py-2.5 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                    >
                        Entrar
                    </motion.button>
                </form>
            </motion.div>
        </div>
    )
}
