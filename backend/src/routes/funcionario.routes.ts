import { Router } from 'express';
import { FuncionarioController } from '../controllers/funcionario.controller.js';
import { PecaController } from '../controllers/peca.controller.js';
import pecaRoutes from './peca.routes.js';

const funcionarioRoutes = Router();

// Rota para buscar todas as funcionarios
// URL: GET http://localhost:3000/api/funcionarios
funcionarioRoutes.get('/', FuncionarioController.listar);

// Rota para buscar um funcionario específica pelo código único
// URL: GET http://localhost:3000/api/funcionarios/:codigo
funcionarioRoutes.get('/:codigo', FuncionarioController.buscarPorCodigo);

// Rota para cadastrar um nova funcionario
// URL: POST http://localhost:3000/api/funcionarios
funcionarioRoutes.post('/', FuncionarioController.criar);

// Rota para atualizar o status ou dados de um funcionario (ex: mudar de "Em produção" para "Pronta")
// URL: PUT http://localhost:3000/api/funcionarios/:codigo
funcionarioRoutes.put('/:codigo', FuncionarioController.atualizar);

// Rota para deletar um funcionario do sistema
// URL: DELETE http://localhost:3000/api/funcionarios/:codigo
funcionarioRoutes.delete('/:codigo', FuncionarioController.deletar);

export default funcionarioRoutes;