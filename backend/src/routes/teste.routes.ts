import { Router } from 'express';
import { TesteController } from '../controllers/teste.controller.js';

const testeRoutes = Router();

// Rota para buscar todas as testes
// URL: GET http://localhost:3000/api/testes
testeRoutes.get('/', TesteController.listar);

// Rota para buscar uma teste específica pelo código único
// URL: GET http://localhost:3000/api/testes/:codigo
testeRoutes.get('/:codigo', TesteController.buscarPorCodigo);

// Rota para cadastrar uma nova teste
// URL: POST http://localhost:3000/api/testes
testeRoutes.post('/', TesteController.criar);

// Rota para atualizar o status ou dados de uma teste (ex: mudar de "Em produção" para "Pronta")
// URL: PUT http://localhost:3000/api/testes/:codigo
testeRoutes.put('/:codigo', TesteController.atualizar);

// Rota para deletar uma teste do sistema
// URL: DELETE http://localhost:3000/api/testes/:codigo
testeRoutes.delete('/:codigo', TesteController.deletar);

export default testeRoutes;