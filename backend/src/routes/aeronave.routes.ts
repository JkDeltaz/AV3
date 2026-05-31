import { Router } from 'express';
import { AeronaveController } from '../controllers/aeronave.controller.js';

const aeronaveRoutes = Router();

// Rota para buscar todas as aeronaves
// URL: GET http://localhost:3000/api/aeronaves
aeronaveRoutes.get('/', AeronaveController.listar);

// Rota para buscar uma aeronave específica pelo código único
// URL: GET http://localhost:3000/api/aeronaves/:codigo
aeronaveRoutes.get('/:codigo', AeronaveController.buscarPorCodigo);

// Rota para cadastrar uma nova aeronave
// URL: POST http://localhost:3000/api/aeronaves
aeronaveRoutes.post('/', AeronaveController.criar);

// Rota para atualizar o status ou dados de uma aeronave (ex: mudar de "Em produção" para "Pronta")
// URL: PUT http://localhost:3000/api/aeronaves/:codigo
aeronaveRoutes.put('/:codigo', AeronaveController.atualizar);

// Rota para adicionar uma peça a uma aeronave
// URL: POST http://localhost:3000/api/aeronaves/:codigo/pecas
aeronaveRoutes.post('/:codigo/pecas', AeronaveController.adicionarPeca);

// Rota para deletar uma aeronave do sistema
// URL: DELETE http://localhost:3000/api/aeronaves/:codigo
aeronaveRoutes.delete('/:codigo', AeronaveController.deletar);

export default aeronaveRoutes;