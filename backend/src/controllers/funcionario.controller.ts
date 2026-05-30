import type { Request, Response } from 'express';
import { FuncionarioService } from '../services/funcionario.service.js';

export class FuncionarioController {
  
  // Busca todas as funcionarios
  static async listar(req: Request, res: Response): Promise<void> {
    try {
      const funcionarios = await FuncionarioService.buscarTodas();
      res.status(200).json(funcionarios);
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao listar as funcionarios.', detalhe: error.message });
    }
  }

  // Busca por código único (GET /api/funcionarios/:codigo)
  static async buscarPorCodigo(req: Request, res: Response): Promise<void> {
    try {
      const { codigo } = req.params;

      if (!codigo) {
        res.status(400).json({ error: 'O parâmetro código é obrigatório na URL.' });
        return;
      }

      const funcionario = await FuncionarioService.buscarPorCodigo(codigo);

      if (!funcionario) {
        res.status(404).json({ error: 'Funcionario não encontrada.' });
        return;
      }

      res.status(200).json(funcionario);
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao buscar a funcionario.', detalhe: error.message });
    }
  }

  // Post - Cadastrar Funcionario
  static async criar(req: Request, res: Response): Promise<void> {
    try {
      // Extrai os campos corretos enviados pelo formulário do frontend
      const { codigo, nome, telefone, endereco, usuario, senha, nivelPermissao } = req.body;

      // Validação dos campos obrigatórios conforme o banco de dados
      if (!codigo || !nome || !telefone || !endereco || !usuario || !senha || !nivelPermissao) {
        res.status(400).json({ error: 'Todos os campos (código, nome, telefone, endereco, usuario, senha e nivelPermissao) são obrigatórios.' });
        return;
      }

      // Envia os parâmetros padronizados para o Service
      const novaFuncionario = await FuncionarioService.criar({ codigo, nome, telefone, endereco, usuario, senha, nivelPermissao });
      res.status(201).json(novaFuncionario);
    } catch (error: any) {
      // Trata erro de código duplicado no banco
      if (error.code === 'P2002') {
        res.status(400).json({ error: 'Já existe uma funcionario cadastrada com este código.' });
        return;
      }
      res.status(500).json({ error: 'Erro ao cadastrar a funcionario.', detalhe: error.message });
    }
  }

  // Put - Atualizar Funcionario
  static async atualizar(req: Request, res: Response): Promise<void> {
    try {
      const { codigo } = req.params;
      const dadosAtualizados = req.body;

      if (!codigo) {
        res.status(400).json({ error: 'O parâmetro código é obrigatório na URL.' });
        return;
      }

      const funcionarioAtualizada = await FuncionarioService.atualizar(codigo, dadosAtualizados);
      res.status(200).json(funcionarioAtualizada);
    } catch (error: any) {
      if (error.code === 'P2025') {
        res.status(404).json({ error: 'Funcionario não encontrada para atualização.' });
        return;
      }
      res.status(500).json({ error: 'Erro ao atualizar a funcionario.', detalhe: error.message });
    }
  }

  // Delete - Remover Funcionario
  static async deletar(req: Request, res: Response): Promise<void> {
    try {
      const { codigo } = req.params;

      if (!codigo) {
        res.status(400).json({ error: 'O parâmetro código é obrigatório na URL.' });
        return;
      }

      await FuncionarioService.deletar(codigo);
    
      res.status(200).json({ message: 'Funcionario deletada com sucesso.' });
    } catch (error: any) {
      if (error.code === 'P2025') {
        res.status(404).json({ error: 'Funcionario não encontrada para exclusão.' });
        return;
      }
      res.status(500).json({ error: 'Erro ao deletar a funcionario.', detalhe: error.message });
    }
  }
}