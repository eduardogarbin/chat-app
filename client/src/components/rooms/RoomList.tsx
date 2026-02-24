import { motion } from 'framer-motion'
import type { Room } from '../../types/room'
import { getRoomPalette } from '../../utils/roomColors'
import { getRoomIconPath } from '../../utils/roomIcons'

interface RoomListProps {
    rooms: Room[]
    currentRoom: Room | null
    onSelectRoom: (room: Room) => void
}

export const RoomList = ({ rooms, currentRoom, onSelectRoom }: RoomListProps) => {
    return (
        <div className="hidden sm:flex w-48 flex-shrink-0 bg-white/40 dark:bg-gray-900/30 backdrop-blur-lg border-r border-black/8 dark:border-gray-700/50 flex-col overflow-hidden">
            <div className="px-3 py-3 border-b border-black/6 dark:border-gray-700/50">
                <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Salas
                </h2>
            </div>

            <div className="flex-1 overflow-y-auto py-2 space-y-0.5 px-2">
                {rooms.map((room, index) => {
                    const isActive = currentRoom?.id === room.id
                    const palette = getRoomPalette(index)

                    return (
                        <motion.button
                            key={room.id}
                            whileHover={{ x: 2 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => onSelectRoom(room)}
                            className={`cursor-pointer w-full text-left px-2 py-1.5 rounded-md transition-all flex items-center gap-1.5 group ${
                                isActive
                                    ? 'bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-white/25 dark:hover:bg-gray-700/30 hover:text-gray-900 dark:hover:text-gray-100'
                            }`}
                            title={room.description}
                        >
                            <svg
                                aria-hidden="true"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.75}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className={`w-3.5 h-3.5 flex-shrink-0 ${
                                    isActive
                                        ? 'text-gray-500 dark:text-gray-400'
                                        : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                                }`}
                            >
                                <path d={getRoomIconPath(room.id)} />
                            </svg>
                            <span className="text-sm font-medium truncate">
                                {room.name}
                            </span>
                            {isActive && (
                                <motion.div
                                    layoutId="activeRoom"
                                    className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: palette.dotColor }}
                                />
                            )}
                        </motion.button>
                    )
                })}
            </div>
        </div>
    )
}
