import { motion } from 'framer-motion'

interface ChatInputProps {
    inputMessage: string
    setInputMessage: (message: string) => void
    onSubmit: (e: React.FormEvent) => void
}

export const ChatInput = ({ inputMessage, setInputMessage, onSubmit }: ChatInputProps) => {
    return (
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={onSubmit}
            className="bg-white dark:bg-gray-800 rounded-b-2xl shadow-lg p-4"
        >
            <div className="flex gap-2">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-lg"
                >
                    Enviar
                </motion.button>
            </div>
        </motion.form>
    )
}
