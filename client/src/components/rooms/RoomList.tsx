import { motion } from 'framer-motion'
import type { Room } from '../../types/room'

interface RoomListProps {
    rooms: Room[]
    currentRoom: Room | null
    onSelectRoom: (room: Room) => void
}

/**
 * Sidebar de salas exibida dentro do chat.
 *
 * Mostra todas as salas disponíveis e destaca a sala atual com uma
 * borda e fundo coloridos. Ao clicar em outra sala, dispara onSelectRoom
 * que vai emitir o evento joinRoom no servidor para a troca de sala.
 *
 * O prefixo "#" é uma convenção de chats (popularizada pelo Slack/Discord)
 * para indicar que aquele item é um canal/sala de texto.
 */
export const RoomList = ({ rooms, currentRoom, onSelectRoom }: RoomListProps) => {
    return (
        <div className="w-48 flex-shrink-0 bg-white/30 dark:bg-gray-900/30 backdrop-blur-lg border-r border-white/20 dark:border-gray-700/50 flex flex-col overflow-hidden">
            <div className="px-3 py-3 border-b border-white/20 dark:border-gray-700/50">
                <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Salas
                </h2>
            </div>

            <div className="flex-1 overflow-y-auto py-2 space-y-0.5 px-2">
                {rooms.map((room) => {
                    const isActive = currentRoom?.id === room.id
                    return (
                        <motion.button
                            key={room.id}
                            whileHover={{ x: 2 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => onSelectRoom(room)}
                            className={`w-full text-left px-2 py-1.5 rounded-md transition-all flex items-center gap-1.5 group ${
                                isActive
                                    ? 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-100'
                            }`}
                            title={room.description}
                        >
                            <span className={`text-sm font-medium leading-none ${isActive ? 'text-violet-500' : 'text-gray-400 dark:text-gray-600 group-hover:text-gray-500'}`}>
                                #
                            </span>
                            <span className="text-sm font-medium truncate">
                                {room.name}
                            </span>
                            {isActive && (
                                <motion.div
                                    layoutId="activeRoom"
                                    className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-500 flex-shrink-0"
                                />
                            )}
                        </motion.button>
                    )
                })}
            </div>
        </div>
    )
}
