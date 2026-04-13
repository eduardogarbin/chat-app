/**
 * Paleta de cores para cards de sala.
 *
 * Cada entrada usa a escala 200–300 do Tailwind (muito mais saturada que
 * a 50–100) para garantir cores visivelmente distintas entre os cards.
 * As classes precisam ser strings literais completas para o Tailwind as
 * detectar durante o scan de arquivos e incluir no bundle final.
 *
 * @remarks
 * Usada em RoomSelectScreen e RoomList para exibição visual distinta
 * de cada sala. Suporta light e dark mode com prefixo `dark:`.
 */
export interface RoomPalette {
    /** Classes Tailwind para gradiente do card */
    card: string
    /** Classes Tailwind para borda */
    border: string
    /** Classes Tailwind para sombra no hover */
    shadow: string
    /** Classes Tailwind para ícone decorativo de fundo */
    hash: string
    /** Classes Tailwind para cor do título da sala */
    name: string
    /** Classes Tailwind para cor da descrição */
    desc: string
    /**
     * Cor hex usada em inline styles (ex: o ponto da sala ativa na sidebar).
     * Inline style é necessário aqui porque o valor é aplicado dinamicamente
     * em runtime — o Tailwind não gera classes com valores variáveis.
     */
    dotColor: string
}

const PALETTES: RoomPalette[] = [
    {
        // Violet — roxo vibrante
        card: 'from-violet-200 to-purple-300 dark:from-violet-900/80 dark:to-purple-800/70',
        border: 'border-violet-300/70 dark:border-violet-600/50',
        shadow: 'hover:shadow-violet-400/50 dark:hover:shadow-violet-700/50',
        hash: 'text-violet-400/50 dark:text-violet-500/50',
        name: 'text-violet-900 dark:text-violet-100',
        desc: 'text-violet-700 dark:text-violet-300',
        dotColor: '#8b5cf6',
    },
    {
        // Sky — azul claro distinto do violet
        card: 'from-sky-200 to-cyan-300 dark:from-sky-900/80 dark:to-cyan-800/70',
        border: 'border-sky-300/70 dark:border-sky-600/50',
        shadow: 'hover:shadow-sky-400/50 dark:hover:shadow-sky-700/50',
        hash: 'text-sky-400/50 dark:text-sky-500/50',
        name: 'text-sky-900 dark:text-sky-100',
        desc: 'text-sky-700 dark:text-sky-300',
        dotColor: '#0ea5e9',
    },
    {
        // Emerald — verde bem diferente dos azuis
        card: 'from-emerald-200 to-teal-300 dark:from-emerald-900/80 dark:to-teal-800/70',
        border: 'border-emerald-300/70 dark:border-emerald-600/50',
        shadow: 'hover:shadow-emerald-400/50 dark:hover:shadow-emerald-700/50',
        hash: 'text-emerald-400/50 dark:text-emerald-500/50',
        name: 'text-emerald-900 dark:text-emerald-100',
        desc: 'text-emerald-700 dark:text-emerald-300',
        dotColor: '#10b981',
    },
    {
        // Rose — rosa/vermelho quente, contraste máximo com o verde
        card: 'from-rose-200 to-pink-300 dark:from-rose-900/80 dark:to-pink-800/70',
        border: 'border-rose-300/70 dark:border-rose-600/50',
        shadow: 'hover:shadow-rose-400/50 dark:hover:shadow-rose-700/50',
        hash: 'text-rose-400/50 dark:text-rose-500/50',
        name: 'text-rose-900 dark:text-rose-100',
        desc: 'text-rose-700 dark:text-rose-300',
        dotColor: '#f43f5e',
    },
    {
        // Amber — amarelo/laranja, quente e diferente dos frios
        card: 'from-amber-200 to-orange-300 dark:from-amber-900/80 dark:to-orange-800/70',
        border: 'border-amber-300/70 dark:border-amber-600/50',
        shadow: 'hover:shadow-amber-400/50 dark:hover:shadow-amber-700/50',
        hash: 'text-amber-400/50 dark:text-amber-500/50',
        name: 'text-amber-900 dark:text-amber-100',
        desc: 'text-amber-700 dark:text-amber-300',
        dotColor: '#f59e0b',
    },
    {
        // Indigo — azul escuro, diferente do sky
        card: 'from-indigo-200 to-blue-300 dark:from-indigo-900/80 dark:to-blue-800/70',
        border: 'border-indigo-300/70 dark:border-indigo-600/50',
        shadow: 'hover:shadow-indigo-400/50 dark:hover:shadow-indigo-700/50',
        hash: 'text-indigo-400/50 dark:text-indigo-500/50',
        name: 'text-indigo-900 dark:text-indigo-100',
        desc: 'text-indigo-700 dark:text-indigo-300',
        dotColor: '#6366f1',
    },
]

/**
 * Retorna a paleta de cores de uma sala pelo seu índice no array de salas.
 *
 * @param index - Posição da sala no array (de 0 a N)
 * @returns Paleta de cores (6 cores disponíveis, cicla em modulo)
 *
 * @remarks
 * Usamos o índice (posição no array) em vez de hash pelo roomId porque:
 * - As salas são geradas em ordem fixa no servidor (seedDefaultRooms)
 * - Hash pode causar colisões: roomIds diferentes somam para o mesmo índice
 *   (ex: "aleatório" e "jogos" ambos mapeavam para a paleta violet com o
 *   hash simples de soma de char codes)
 * - Com índice, cada sala sempre recebe uma paleta diferente da anterior
 *
 * @example
 * getRoomPalette(0)  // Violet palette
 * getRoomPalette(1)  // Sky palette
 * getRoomPalette(6)  // Violet (cicla)
 */
export function getRoomPalette(index: number): RoomPalette {
    return PALETTES[index % PALETTES.length] ?? PALETTES[0]!
}
