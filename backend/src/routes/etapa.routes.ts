import { Router } from 'express';
import { EtapaController } from '../controllers/etapa.controller.js';
import { PecaController } from '../controllers/peca.controller.js';
import pecaRoutes from './peca.routes.js';

const etapaRoutes = Router();

// Rota para buscar todas as etapas
// URL: GET http://localhost:3000/api/etapas
etapaRoutes.get('/', EtapaController.listar);

// Rota para buscar uma etapa específica pelo código único
// URL: GET http://localhost:3000/api/etapas/:codigo
etapaRoutes.get('/:codigo', EtapaController.buscarPorCodigo);

// Rota para cadastrar uma nova etapa
// URL: POST http://localhost:3000/api/etapas
etapaRoutes.post('/', EtapaController.criar);

// Rota para atualizar o status ou dados de uma etapa (ex: mudar de "Em produção" para "Pronta")
// URL: PUT http://localhost:3000/api/etapas/:codigo
etapaRoutes.put('/:codigo', EtapaController.atualizar);

// Rota para adicionar um funcionário a uma etapa existente
// URL: POST http://localhost:3000/api/etapas/:codigo/funcionarios
etapaRoutes.post('/:codigo/funcionarios', EtapaController.adicionarFuncionario);

// Rota para deletar uma etapa do sistema
// URL: DELETE http://localhost:3000/api/etapas/:codigo
etapaRoutes.delete('/:codigo', EtapaController.deletar);

export default etapaRoutes;