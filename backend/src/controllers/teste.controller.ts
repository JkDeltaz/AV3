import type { Request, Response } from 'express';
import { TesteService } from '../services/teste.service.js';

export class TesteController {
  
  // Busca todas as testes
  static async listar(req: Request, res: Response): Promise<void> {
    try {
      const testes = await TesteService.buscarTodas();
      res.status(200).json(testes);
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao listar as testes.', detalhe: error.message });
    }
  }

  // Busca por código único (GET /api/testes/:codigo)
  static async buscarPorCodigo(req: Request, res: Response): Promise<void> {
    try {
      const { codigo } = req.params;

      if (!codigo) {
        res.status(400).json({ error: 'O parâmetro código é obrigatório na URL.' });
        return;
      }

      const teste = await TesteService.buscarPorCodigo(codigo);

      if (!teste) {
        res.status(404).json({ error: 'Teste não encontrada.' });
        return;
      }

      res.status(200).json(teste);
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao buscar a teste.', detalhe: error.message });
    }
  }

  // Post - Cadastrar Teste
  static async criar(req: Request, res: Response): Promise<void> {
    try {
      // Extrai os campos corretos enviados pelo formulário do frontend
      const { codigo, tipo, resultado, aeronaveId } = req.body;

      // Validação dos campos obrigatórios conforme o banco de dados
      if (!codigo || !tipo  || !resultado || !aeronaveId) {
        res.status(400).json({ error: 'Todos os campos (código, tipo, resultado e aeronaveId) são obrigatórios.' });
        return;
      }

      // Envia os parâmetros padronizados para o Service
      const novaTeste = await TesteService.criar({ codigo, tipo, resultado, aeronaveId });
      res.status(201).json(novaTeste);
    } catch (error: any) {
      // Trata erro de código duplicado no banco
      if (error.code === 'P2002') {
        res.status(400).json({ error: 'Já existe uma teste cadastrada com este código.' });
        return;
      }
      res.status(500).json({ error: 'Erro ao cadastrar a teste.', detalhe: error.message });
    }
  }

  // Put - Atualizar Teste
  static async atualizar(req: Request, res: Response): Promise<void> {
    try {
      const { codigo } = req.params;
      const dadosAtualizados = req.body;

      if (!codigo) {
        res.status(400).json({ error: 'O parâmetro código é obrigatório na URL.' });
        return;
      }

      const testeAtualizada = await TesteService.atualizar(codigo, dadosAtualizados);
      res.status(200).json(testeAtualizada);
    } catch (error: any) {
      if (error.code === 'P2025') {
        res.status(404).json({ error: 'Teste não encontrada para atualização.' });
        return;
      }
      res.status(500).json({ error: 'Erro ao atualizar a teste.', detalhe: error.message });
    }
  }

  // Delete - Remover Teste
  static async deletar(req: Request, res: Response): Promise<void> {
    try {
      const { codigo } = req.params;

      if (!codigo) {
        res.status(400).json({ error: 'O parâmetro código é obrigatório na URL.' });
        return;
      }

      await TesteService.deletar(codigo);
    
      res.status(200).json({ message: 'Teste deletada com sucesso.' });
    } catch (error: any) {
      if (error.code === 'P2025') {
        res.status(404).json({ error: 'Teste não encontrada para exclusão.' });
        return;
      }
      res.status(500).json({ error: 'Erro ao deletar a teste.', detalhe: error.message });
    }
  }
}