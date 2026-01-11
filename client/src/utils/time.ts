/**
 * Converte um timestamp para formato relativo (ex: "há 5 minutos", "ontem")
 * Similar ao formato usado em Slack, Discord, WhatsApp, etc.
 */
export const getRelativeTime = (timestamp: Date): string => {
    const now = new Date()
    const messageTime = new Date(timestamp)
    const diffInSeconds = Math.floor((now.getTime() - messageTime.getTime()) / 1000)

    // Menos de 1 minuto
    if (diffInSeconds < 60) {
        return 'agora mesmo'
    }

    // Menos de 1 hora
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) {
        return diffInMinutes === 1 ? 'há 1 minuto' : `há ${diffInMinutes} minutos`
    }

    // Menos de 24 horas
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
        return diffInHours === 1 ? 'há 1 hora' : `há ${diffInHours} horas`
    }

    // Menos de 7 dias
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) {
        return 'ontem'
    }
    if (diffInDays < 7) {
        return `há ${diffInDays} dias`
    }

    // Menos de 30 dias
    if (diffInDays < 30) {
        const weeks = Math.floor(diffInDays / 7)
        return weeks === 1 ? 'há 1 semana' : `há ${weeks} semanas`
    }

    // Menos de 365 dias
    if (diffInDays < 365) {
        const months = Math.floor(diffInDays / 30)
        return months === 1 ? 'há 1 mês' : `há ${months} meses`
    }

    // Mais de 1 ano
    const years = Math.floor(diffInDays / 365)
    return years === 1 ? 'há 1 ano' : `há ${years} anos`
}

/**
 * Retorna o horário absoluto para tooltip (ex: "14:30")
 */
export const getAbsoluteTime = (timestamp: Date): string => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    })
}

/**
 * Retorna data e hora completa para tooltip (ex: "15 Jan 2024, 14:30")
 */
export const getFullDateTime = (timestamp: Date): string => {
    return new Date(timestamp).toLocaleString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}
