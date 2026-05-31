import type { Request, Response } from 'express';
import { AeronaveService } from '../services/aeronave.service.js';

export class AeronaveController {
  
  // Busca todas as aeronaves
  static async listar(req: Request, res: Response): Promise<void> {
    try {
      const aeronaves = await AeronaveService.buscarTodas();
      res.status(200).json(aeronaves);
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao listar as aeronaves.', detalhe: error.message });
    }
  }

  // Busca por código único (GET /api/aeronaves/:codigo)
  static async buscarPorCodigo(req: Request, res: Response): Promise<void> {
    try {
      const { codigo } = req.params;

      if (!codigo) {
        res.status(400).json({ error: 'O parâmetro código é obrigatório na URL.' });
        return;
      }

      const aeronave = await AeronaveService.buscarPorCodigo(codigo);

      if (!aeronave) {
        res.status(404).json({ error: 'Aeronave não encontrada.' });
        return;
      }

      res.status(200).json(aeronave);
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao buscar a aeronave.', detalhe: error.message });
    }
  }

  // Post - Cadastrar Aeronave
  static async criar(req: Request, res: Response): Promise<void> {
    try {
      // Extrai os campos corretos enviados pelo formulário do frontend
      const { codigo, modelo, tipo, capacidade, alcance } = req.body;

      // Validação dos campos obrigatórios conforme o banco de dados
      if (!codigo || !modelo || !tipo || !capacidade || !alcance) {
        res.status(400).json({ error: 'Todos os campos (código, modelo, tipo, capacidade e alcance) são obrigatórios.' });
        return;
      }

      // Envia os parâmetros padronizados para o Service
      const novaAeronave = await AeronaveService.criar({ codigo, modelo, tipo, capacidade, alcance });
      res.status(201).json(novaAeronave);
    } catch (error: any) {
      // Trata erro de código duplicado no banco
      if (error.code === 'P2002') {
        res.status(400).json({ error: 'Já existe uma aeronave cadastrada com este código.' });
        return;
      }
      res.status(500).json({ error: 'Erro ao cadastrar a aeronave.', detalhe: error.message });
    }
  }

  // Put - Atualizar Aeronave
  static async atualizar(req: Request, res: Response): Promise<void> {
    try {
      const { codigo } = req.params;
      const dadosAtualizados = req.body;

      if (!codigo) {
        res.status(400).json({ error: 'O parâmetro código é obrigatório na URL.' });
        return;
      }

      const aeronaveAtualizada = await AeronaveService.atualizar(codigo, dadosAtualizados);
      res.status(200).json(aeronaveAtualizada);
    } catch (error: any) {
      if (error.code === 'P2025') {
        res.status(404).json({ error: 'Aeronave não encontrada para atualização.' });
        return;
      }
      res.status(500).json({ error: 'Erro ao atualizar a aeronave.', detalhe: error.message });
    }
  }

  // Delete - Remover Aeronave
  static async deletar(req: Request, res: Response): Promise<void> {
    try {
      const { codigo } = req.params;

      if (!codigo) {
        res.status(400).json({ error: 'O parâmetro código é obrigatório na URL.' });
        return;
      }

      await AeronaveService.deletar(codigo);
    
      res.status(200).json({ message: 'Aeronave deletada com sucesso.' });
    } catch (error: any) {
      if (error.code === 'P2025') {
        res.status(404).json({ error: 'Aeronave não encontrada para exclusão.' });
        return;
      }
      res.status(500).json({ error: 'Erro ao deletar a aeronave.', detalhe: error.message });
    }
  }
  
  // Adicionar uma peça a uma aeronave
  static async adicionarPeca(req: Request, res: Response): Promise<void> {
    try {
      const { codigo } = req.params;
      const { pecaCodigo } = req.body;

      if (!codigo) {
        res.status(400).json({ error: 'O parâmetro código da aeronave é obrigatório na URL.' });
        return;
      }

      if (!pecaCodigo) {
        res.status(400).json({ error: 'O código da peça é obrigatório no corpo da requisição.' });
        return;
      }

      const aeronaveAtualizada = await AeronaveService.adicionarPeca(codigo, pecaCodigo);
      res.status(200).json(aeronaveAtualizada);
    } catch (error: any) {
      if (error.code === 'P2025') {
        res.status(404).json({ error: 'Aeronave ou peça não encontrada para adicionar.' });
        return;
      }
      res.status(500).json({ error: 'Erro ao adicionar peça à aeronave.', detalhe: error.message });
    }
  }
}