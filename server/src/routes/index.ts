import { Router } from 'express';
import { healthCheck } from '../controllers/healthController';

/**
 * Router central do servidor HTTP.
 *
 * Esse arquivo e o "mapa de enderecos" da API REST: ele define quais URLs
 * existem e qual controller e responsavel por cada uma. Ele nao sabe o que
 * cada controller faz — apenas conecta URL com funcao.
 *
 * Para adicionar uma nova rota no futuro, basta importar o controller
 * correspondente e registrar aqui.
 */
const router = Router();

router.get('/api/health', healthCheck);

export default router;
