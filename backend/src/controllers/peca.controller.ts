import type { Request, Response } from 'express';
import { PecaService } from '../services/peca.service.js';

export class PecaController {
  
  // Busca todas as peças
  static async listar(req: Request, res: Response): Promise<void> {
    try {
      const pecas = await PecaService.buscarTodas();
      res.status(200).json(pecas);
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao listar as peças.', detalhe: error.message });
    }
  }

  // Busca por código único (GET /api/pecas/:codigo)
  static async buscarPorCodigo(req: Request, res: Response): Promise<void> {
    try {
      const { codigo } = req.params;

      if (!codigo) {
        res.status(400).json({ error: 'O parâmetro código é obrigatório na URL.' });
        return;
      }

      const peca = await PecaService.buscarPorCodigo(codigo);

      if (!peca) {
        res.status(404).json({ error: 'Peça não encontrada.' });
        return;
      }

      res.status(200).json(peca);
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao buscar a peça.', detalhe: error.message });
    }
  }

  // Post - Cadastrar Peça
  static async criar(req: Request, res: Response): Promise<void> {
    try {
      // Extrai os campos corretos enviados pelo formulário do frontend
      const { codigo, nome, tipo, fornecedor, status } = req.body;

      // Validação dos campos obrigatórios conforme o banco de dados
      if (!codigo || !nome || !tipo || !fornecedor || !status) {
        res.status(400).json({ error: 'Todos os campos (código, nome, tipo, fornecedor e status) são obrigatórios.' });
        return;
      }

      // Envia os parâmetros padronizados para o Service
      const novaPeca = await PecaService.criar({ codigo, nome, tipo, fornecedor, status });
      res.status(201).json(novaPeca);
    } catch (error: any) {
      // Trata erro de código duplicado no banco
      if (error.code === 'P2002') {
        res.status(400).json({ error: 'Já existe uma peça cadastrada com este código.' });
        return;
      }
      res.status(500).json({ error: 'Erro ao cadastrar a peça.', detalhe: error.message });
    }
  }

  // Put - Atualizar Peça
  static async atualizar(req: Request, res: Response): Promise<void> {
    try {
      const { codigo } = req.params;
      const dadosAtualizados = req.body;

      if (!codigo) {
        res.status(400).json({ error: 'O parâmetro código é obrigatório na URL.' });
        return;
      }

      const pecaAtualizada = await PecaService.atualizar(codigo, dadosAtualizados);
      res.status(200).json(pecaAtualizada);
    } catch (error: any) {
      if (error.code === 'P2025') {
        res.status(404).json({ error: 'Peça não encontrada para atualização.' });
        return;
      }
      res.status(500).json({ error: 'Erro ao atualizar a peça.', detalhe: error.message });
    }
  }

  // Delete - Remover Peça
  static async deletar(req: Request, res: Response): Promise<void> {
    try {
      const { codigo } = req.params;

      if (!codigo) {
        res.status(400).json({ error: 'O parâmetro código é obrigatório na URL.' });
        return;
      }

      await PecaService.deletar(codigo);
    
      res.status(200).json({ message: 'Peça deletada com sucesso.' });
    } catch (error: any) {
      if (error.code === 'P2025') {
        res.status(404).json({ error: 'Peça não encontrada para exclusão.' });
        return;
      }
      res.status(500).json({ error: 'Erro ao deletar a peça.', detalhe: error.message });
    }
  }
}