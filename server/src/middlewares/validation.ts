/**
 * Utilitarios de validacao reutilizaveis.
 *
 * Essas funcoes nao dependem do Express nem do Socket.IO: sao funcoes puras
 * que recebem um valor e retornam verdadeiro ou falso. Por serem independentes,
 * podem ser usadas em qualquer camada: controllers HTTP, handlers Socket.IO
 * ou futuros testes automatizados.
 */

/**
 * Verifica se o valor e uma string nao vazia (apos remover espacos).
 */
export function isNonEmptyString(value: unknown): value is string {
    return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Verifica se uma string nao ultrapassa o limite de caracteres informado.
 */
export function isWithinLength(value: string, max: number): boolean {
    return value.length <= max;
}
