import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'

/**
 * Props para o componente Toast.
 */
interface ToastProps {
    /** Mensagem a exibir */
    message: string
    /** Tipo de notificação (define cor e ícone) */
    type: 'success' | 'error' | 'info'
    /** Se o toast está visível */
    isVisible: boolean
    /** Callback acionado quando o toast deve ser fechado */
    onClose: () => void
}

/**
 * Notificação flutuante no canto superior direito.
 *
 * @param props - {@link ToastProps}
 * @returns Toast animado com ícone, mensagem e botão de fechar
 *
 * @remarks
 * Componente controlado pelo pai (App.tsx).
 * Auto-fecha em 3 segundos via useEffect.
 * Animações suaves com Framer Motion (entrada/saída).
 * Usado para comunicar estados: conexão, erros, sucesso de ações.
 *
 * @example
 * <Toast
 *   message="Você está online!"
 *   type="success"
 *   isVisible={true}
 *   onClose={() => setVisible(false)}
 * />
 */
export const Toast = ({ message, type, isVisible, onClose }: ToastProps) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose()
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [isVisible, onClose])

    const colors = {
        success: 'bg-green-600/90 dark:bg-green-500/90',
        error: 'bg-red-600/90 dark:bg-red-500/90',
        info: 'bg-violet-600/90 dark:bg-violet-500/90'
    }

    const icons = {
        success: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
        ),
        error: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        ),
        info: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -50, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.8 }}
                    className="fixed top-4 right-4 z-50"
                >
                    <div
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-white backdrop-blur-xl border border-white/20 ${colors[type]}`}
                    >
                        {icons[type]}
                        <span className="font-medium">{message}</span>
                        <button
                            onClick={onClose}
                            className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
