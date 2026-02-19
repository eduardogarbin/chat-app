import { motion } from 'framer-motion'
import type { Room } from '../../types/room'

interface RoomSelectScreenProps {
    username: string
    rooms: Room[]
    onSelectRoom: (room: Room) => void
    onBack: () => void
}

/**
 * Segunda etapa do fluxo de login: escolha da sala.
 *
 * Recebe a lista de salas do servidor (via App.tsx) e exibe cada uma
 * como um card clicável. Ao clicar, chama onSelectRoom que vai emitir
 * o evento joinRoom para o servidor com o username e o roomId escolhido.
 *
 * O botão "Voltar" permite corrigir o nome de usuário antes de entrar.
 */
export const RoomSelectScreen = ({ username, rooms, onSelectRoom, onBack }: RoomSelectScreenProps) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-100 via-pink-50 to-blue-100 dark:from-gray-900 dark:via-violet-950 dark:to-gray-900 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/50 p-8 w-full max-w-md shadow-2xl shadow-violet-500/10"
            >
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        Escolha uma sala
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Entrando como <span className="font-medium text-violet-600 dark:text-violet-400">{username}</span>
                    </p>
                </div>

                {rooms.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 dark:text-gray-600 text-sm">
                        Carregando salas...
                    </div>
                ) : (
                    <div className="space-y-2">
                        {rooms.map((room, index) => (
                            <motion.button
                                key={room.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                onClick={() => onSelectRoom(room)}
                                className="w-full text-left px-4 py-3 rounded-lg border border-gray-200/50 dark:border-gray-700/50 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm hover:border-violet-400 dark:hover:border-violet-500 hover:bg-violet-50/60 dark:hover:bg-violet-900/20 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-lg font-medium text-violet-600 dark:text-violet-400 leading-none">
                                        #
                                    </span>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">
                                            {room.name}
                                        </p>
                                        {room.description && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                {room.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                )}

                <button
                    onClick={onBack}
                    className="mt-4 text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                    Voltar
                </button>
            </motion.div>
        </div>
    )
}
