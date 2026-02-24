import { Request, Response } from 'express';

/**
 * Responde com o status atual do servidor.
 *
 * Essa função é um "controller": ela conhece apenas a lógica de negócio
 * (o que retornar), sem saber qual URL a chamou. Quem define a URL é o
 * arquivo de rotas (routes/index.ts).
 */
export function healthCheck(req: Request, res: Response): void {
    res.json({
        status: 'OK',
        message: 'Chat server is running!',
        timestamp: new Date().toISOString()
    });
}
