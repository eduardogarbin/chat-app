import { Request, Response, NextFunction } from 'express';

/**
 * Middleware global de tratamento de erros HTTP.
 *
 * No Express, um middleware de erro se diferencia dos outros por ter
 * exatamente quatro parametros: (err, req, res, next). O Express reconhece
 * essa assinatura automaticamente e so ativa esse middleware quando alguma
 * rota chama next(err) com um objeto de erro.
 *
 * Ao centralizar o tratamento aqui, todas as rotas sempre retornam o mesmo
 * formato JSON em caso de falha, em vez de mensagens de erro inconsistentes
 * ou paginas HTML do Express.
 *
 * IMPORTANTE: esse middleware deve ser registrado por ultimo no server.ts,
 * depois de todas as rotas, para que o Express o use como "rede de seguranca".
 */
export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    console.error(`[Erro] ${err.message}`);

    res.status(500).json({
        status: 'error',
        message: err.message || 'Erro interno do servidor'
    });
}
