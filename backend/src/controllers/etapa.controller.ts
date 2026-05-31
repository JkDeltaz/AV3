import type { Request, Response } from 'express';
import { EtapaService } from '../services/etapa.service.js';

export class EtapaController {
  
  // Busca todas as etapas
  static async listar(req: Request, res: Response): Promise<void> {
    try {
      const etapas = await EtapaService.buscarTodas();
      res.status(200).json(etapas);
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao listar as etapas.', detalhe: error.message });
    }
  }

  // Busca por código único (GET /api/etapas/:codigo)
  static async buscarPorCodigo(req: Request, res: Response): Promise<void> {
    try {
      const { codigo } = req.params;

      if (!codigo) {
        res.status(400).json({ error: 'O parâmetro código é obrigatório na URL.' });
        return;
      }

      const etapa = await EtapaService.buscarPorCodigo(codigo);

      if (!etapa) {
        res.status(404).json({ error: 'Etapa não encontrada.' });
        return;
      }

      res.status(200).json(etapa);
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao buscar a etapa.', detalhe: error.message });
    }
  }

  // Post - Cadastrar Etapa
  static async criar(req: Request, res: Response): Promise<void> {
    try {
      // Extrai os campos corretos enviados pelo formulário do frontend
      const { codigo, nome, prazo, status, aeronaveId } = req.body;

      // Validação dos campos obrigatórios conforme o banco de dados
      if (!codigo || !nome || !prazo || !status || !aeronaveId) {
        res.status(400).json({ error: 'Todos os campos (código, nome, prazo, status e aeronaveId) são obrigatórios.' });
        return;
      }

      // Envia os parâmetros padronizados para o Service
      const novaEtapa = await EtapaService.criar({ codigo, nome, prazo, status, aeronaveId });
      res.status(201).json(novaEtapa);
    } catch (error: any) {
      // Trata erro de código duplicado no banco
      if (error.code === 'P2002') {
        res.status(400).json({ error: 'Já existe uma etapa cadastrada com este código.' });
        return;
      }
      res.status(500).json({ error: 'Erro ao cadastrar a etapa.', detalhe: error.message });
    }
  }

  // Put - Atualizar Etapa
  static async atualizar(req: Request, res: Response): Promise<void> {
    try {
      const { codigo } = req.params;
      const dadosAtualizados = req.body;

      if (!codigo) {
        res.status(400).json({ error: 'O parâmetro código é obrigatório na URL.' });
        return;
      }

      const etapaAtualizada = await EtapaService.atualizar(codigo, dadosAtualizados);
      res.status(200).json(etapaAtualizada);
    } catch (error: any) {
      if (error.code === 'P2025') {
        res.status(404).json({ error: 'Etapa não encontrada para atualização.' });
        return;
      }
      res.status(500).json({ error: 'Erro ao atualizar a etapa.', detalhe: error.message });
    }
  }

  // Delete - Remover Etapa
  static async deletar(req: Request, res: Response): Promise<void> {
    try {
      const { codigo } = req.params;

      if (!codigo) {
        res.status(400).json({ error: 'O parâmetro código é obrigatório na URL.' });
        return;
      }

      await EtapaService.deletar(codigo);
    
      res.status(200).json({ message: 'Etapa deletada com sucesso.' });
    } catch (error: any) {
      if (error.code === 'P2025') {
        res.status(404).json({ error: 'Etapa não encontrada para exclusão.' });
        return;
      }
      res.status(500).json({ error: 'Erro ao deletar a etapa.', detalhe: error.message });
    }
  }

  // POST - Adicionar funcionário a uma etapa
  static async adicionarFuncionario(req: Request, res: Response): Promise<void> {
    try {
      const { codigo } = req.params;
      const { funcionarioCodigo } = req.body;

    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao adicionar funcionário à etapa.', detalhe: error.message });
    }
  }
}