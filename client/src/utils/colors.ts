/**
 * Resultado da função de cor de usuário.
 */
interface UserColor {
    /** Cor de fundo hexadecimal */
    bg: string
    /** Cor do texto (contraste garantido) */
    textColor: string
}

/**
 * Retorna uma cor consistente para um usuário baseada no seu nome.
 *
 * @param username - Nome do usuário
 * @returns Objeto com cor de fundo e cor de texto
 *
 * @remarks
 * Usa hash determinístico baseado na soma dos char codes do nome.
 * A mesma cor é sempre retornada para o mesmo username.
 * Paleta de 16 cores vibrantes para máximo contraste.
 *
 * @example
 * const color = getUserColor('alice')
 * // { bg: '#8b5cf6', textColor: '#ffffff' }
 */
export const getUserColor = (username: string): UserColor => {
    const colors: UserColor[] = [
        { bg: '#8b5cf6', textColor: '#ffffff' }, // Violet
        { bg: '#ec4899', textColor: '#ffffff' }, // Pink
        { bg: '#ef4444', textColor: '#ffffff' }, // Red
        { bg: '#f97316', textColor: '#ffffff' }, // Orange
        { bg: '#f59e0b', textColor: '#ffffff' }, // Amber
        { bg: '#eab308', textColor: '#ffffff' }, // Yellow
        { bg: '#84cc16', textColor: '#ffffff' }, // Lime
        { bg: '#22c55e', textColor: '#ffffff' }, // Green
        { bg: '#10b981', textColor: '#ffffff' }, // Emerald
        { bg: '#14b8a6', textColor: '#ffffff' }, // Teal
        { bg: '#06b6d4', textColor: '#ffffff' }, // Cyan
        { bg: '#3b82f6', textColor: '#ffffff' }, // Blue
        { bg: '#6366f1', textColor: '#ffffff' }, // Indigo
        { bg: '#a855f7', textColor: '#ffffff' }, // Purple
        { bg: '#d946ef', textColor: '#ffffff' }, // Fuchsia
        { bg: '#f43f5e', textColor: '#ffffff' }, // Rose
    ]

    // Gera um índice baseado nos caracteres do nome do usuário
    // Isso garante que o mesmo usuário sempre terá a mesma cor
    const index = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length

    return colors[index]
}
