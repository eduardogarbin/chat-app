/**
 * Mapeia o ID de cada sala para o path SVG do seu ícone (Heroicons 24/outline).
 *
 * Os IDs são gerados pelo servidor em roomService.createRoom():
 * name.toLowerCase().replace(/\s+/g, '-')
 *
 * A escolha por SVG path (ao invés de componentes ou biblioteca externa)
 * mantém zero dependências adicionais e permite renderizar o ícone em
 * qualquer tamanho simplesmente ajustando as classes da tag <svg>.
 *
 * @remarks
 * Os paths são renderizados em RoomSelectScreen, RoomList e ChatHeader.
 * Cada sala tem um ícone único para melhor identificação visual.
 */
const ICON_PATHS: Record<string, string> = {
    // ChatBubbleLeftEllipsisIcon — representa conversa geral
    geral:
        'M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z',

    // CodeBracketIcon — representa programação e tech
    tecnologia:
        'M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5',

    // TrophyIcon — representa jogos e competição
    jogos:
        'M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0',

    // ArrowsRightLeftIcon — representa tópicos variados e aleatórios
    'aleatório':
        'M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5',
}

const FALLBACK_PATH =
    'M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z'

/**
 * Retorna o path SVG de um ícone baseado no ID da sala.
 *
 * @param roomId - ID da sala (ex: "geral", "tecnologia")
 * @returns Path SVG (string com coordenadas de desenho)
 *
 * @remarks
 * Se o roomId não estiver mapeado, retorna um ícone de fallback (ponto de interrogação).
 * Os paths são strings literais de Heroicons 24/outline (sem viewBox necessário).
 *
 * @example
 * getRoomIconPath('geral')      // ChatBubbleLeftEllipsisIcon
 * getRoomIconPath('tecnologia') // CodeBracketIcon
 * getRoomIconPath('unknown')    // Fallback (interrogação)
 */
export function getRoomIconPath(roomId: string): string {
    return ICON_PATHS[roomId] ?? FALLBACK_PATH
}
