import { motion } from 'framer-motion'

/**
 * Props para o componente TypingIndicator.
 */
interface TypingIndicatorProps {
    /** Lista de nomes dos usuários digitando no momento */
    usersTyping: string[]
}

/**
 * Indicador animado de usuários digitando.
 *
 * @param props - {@link TypingIndicatorProps}
 * @returns Componente com animação de bolinha ou null (se ninguém está digitando)
 *
 * @remarks
 * Exibido na parte inferior do MessageList quando um ou mais usuários
 * estão digitando. Anima três bolinhas com efeito wave.
 * A mensagem adapta-se ao número de usuários (1, 2, ou 3+).
 *
 * @example
 * <TypingIndicator usersTyping={['alice', 'bob']} />
 * // Exibe: "alice e bob estão digitando"
 */
export const TypingIndicator = ({ usersTyping }: TypingIndicatorProps) => {
    if (usersTyping.length === 0) return null

    const getTypingText = () => {
        if (usersTyping.length === 1) {
            return `${usersTyping[0]} está digitando...`
        } else if (usersTyping.length === 2) {
            return `${usersTyping[0]} e ${usersTyping[1]} estão digitando`
        } else {
            return `${usersTyping.length} pessoas estão digitando`
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center gap-2 px-4 py-2 text-xs text-gray-500 dark:text-gray-500"
        >
            <div className="flex gap-1">
                <motion.div
                    className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-600 rounded-full"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                    className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-600 rounded-full"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                    className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-600 rounded-full"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                />
            </div>
            <span>{getTypingText()}</span>
        </motion.div>
    )
}
