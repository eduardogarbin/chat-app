/**
 * Props para o componente EmojiIcon.
 */
interface EmojiIconProps {
    /** Tamanho do ícone em pixels (padrão: 18) */
    size?: number
}

/**
 * Ícone de rosto sorridente para seletor de emoji.
 *
 * @param props - {@link EmojiIconProps}
 * @returns SVG renderizado com ícone de emoji
 *
 * @remarks
 * Usado em ChatInput e MessageReactions como botão para abrir
 * seletores de emoji. O ícone muda opacidade no hover.
 *
 * @example
 * <EmojiIcon size={24} />
 */
export const EmojiIcon = ({ size = 18 }: EmojiIconProps) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-75 group-hover:opacity-100 transition-opacity"
        >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
    )
}
