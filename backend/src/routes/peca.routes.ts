import { Router } from 'express';
import { PecaController } from '../controllers/peca.controller.js';

const pecaRoutes = Router();

// Rota para buscar todas as peças
// URL: GET http://localhost:3000/api/pecas
pecaRoutes.get('/', PecaController.listar);

// Rota para buscar uma peça específica pelo código único
// URL: GET http://localhost:3000/api/pecas/:codigo
pecaRoutes.get('/:codigo', PecaController.buscarPorCodigo);

// Rota para cadastrar uma nova peça
// URL: POST http://localhost:3000/api/pecas
pecaRoutes.post('/', PecaController.criar);

// Rota para atualizar o status ou dados de uma peça (ex: mudar de "Em produção" para "Pronta")
// URL: PUT http://localhost:3000/api/pecas/:codigo
pecaRoutes.put('/:codigo', PecaController.atualizar);

// Rota para deletar uma peça do sistema
// URL: DELETE http://localhost:3000/api/pecas/:codigo
pecaRoutes.delete('/:codigo', PecaController.deletar);

export default pecaRoutes;