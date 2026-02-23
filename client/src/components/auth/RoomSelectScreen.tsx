import { motion } from 'framer-motion'
import type { Room } from '../../types/room'
import { getRoomPalette } from '../../utils/roomColors'
import { getRoomIconPath } from '../../utils/roomIcons'

interface RoomSelectScreenProps {
    username: string
    rooms: Room[]
    onSelectRoom: (room: Room) => void
    onBack: () => void
}

export const RoomSelectScreen = ({ username, rooms, onSelectRoom, onBack }: RoomSelectScreenProps) => {
    const isOddCount = rooms.length % 2 !== 0

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-100 via-pink-50 to-blue-100 dark:from-gray-900 dark:via-violet-950 dark:to-gray-900 flex items-center justify-center p-6">

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-2xl backdrop-blur-xl bg-white/20 dark:bg-gray-900/25 rounded-3xl border border-white/50 dark:border-gray-700/40 ring-1 ring-white/30 dark:ring-gray-700/20 shadow-2xl shadow-violet-400/20 p-8 flex flex-col gap-7"
            >
                {/* Header */}
                <div className="text-center">
                    <div className="inline-flex items-center gap-3">
                        <img src="/parrot-icon.png" alt="" className="w-12 h-12 object-contain" />
                        <h1 className="font-display text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                            Loro<span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">Chat</span>
                        </h1>
                    </div>
                    <p className="mt-3 text-gray-500 dark:text-gray-400 text-base">
                        Escolha uma sala para começar
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-gray-800/50 border border-white/40 dark:border-gray-700/50 backdrop-blur-sm shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            Entrando como{' '}
                            <span className="font-semibold text-violet-600 dark:text-violet-400">
                                {username}
                            </span>
                        </span>
                    </div>
                </div>

                <div className="border-t border-black/5 dark:border-gray-700/30 -mx-8" />

                {/* Room Grid */}
                {rooms.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 dark:text-gray-600 text-sm">
                        Carregando salas...
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {rooms.map((room, index) => {
                            const palette = getRoomPalette(index)
                            const isLastAlone = isOddCount && index === rooms.length - 1

                            return (
                                <motion.button
                                    key={room.id}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.08 }}
                                    whileHover={{ scale: 1.03, y: -4 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => onSelectRoom(room)}
                                    className={`
                                        cursor-pointer
                                        relative overflow-hidden text-left rounded-3xl p-6 min-h-[160px] flex flex-col
                                        bg-gradient-to-br ${palette.card}
                                        border ${palette.border}
                                        shadow-md ${palette.shadow}
                                        hover:shadow-lg
                                        transition-all duration-100
                                        ${isLastAlone ? 'col-span-2 w-1/2 mx-auto' : ''}
                                    `}
                                >
                                    {/* Decorative icon */}
                                    <svg
                                        aria-hidden="true"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={1}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className={`absolute -bottom-1 right-4 w-20 h-20 select-none pointer-events-none ${palette.hash}`}
                                    >
                                        <path d={getRoomIconPath(room.id)} />
                                    </svg>

                                    {/* Content */}
                                    <div className="relative z-10 flex flex-col flex-1">
                                        <p className={`font-display text-xl font-bold mb-2 ${palette.name}`}>
                                            {room.name}
                                        </p>
                                        {room.description && (
                                            <p className={`text-sm leading-relaxed ${palette.desc}`}>
                                                {room.description}
                                            </p>
                                        )}
                                        <div className="mt-auto pt-4">
                                            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white/25 ${palette.name}`}>
                                                Entrar
                                                <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M3 8h10M9 4l4 4-4 4" />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                </motion.button>
                            )
                        })}
                    </div>
                )}

                {/* Back button */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    onClick={onBack}
                    className="group cursor-pointer inline-flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors mx-auto"
                >
                    <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M13 8H3M7 4l-4 4 4 4" />
                    </svg>
                    Voltar
                </motion.button>
            </motion.div>
        </div>
    )
}
