import type { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';

export class AuthController {
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { usuario, senha } = req.body;

      if (!usuario || !senha) {
        res.status(400).json({ error: 'Usuário e senha são obrigatórios.' });
        return;
      }

      const funcionario = await AuthService.login(usuario, senha);

      if (!funcionario) {
        res.status(401).json({ error: 'Usuário ou senha inválidos.' });
        return;
      }

      res.status(200).json({
        codigo: funcionario.codigo,
        usuario: funcionario.usuario,
        nivelPermissao: funcionario.nivelPermissao,
      });
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao autenticar.', detalhe: error.message });
    }
  }
}
