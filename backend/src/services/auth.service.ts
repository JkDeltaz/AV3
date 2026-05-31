import prisma from '../config/database.js';

export class AuthService {
  static async login(usuario: string, senha: string) {
    return await prisma.funcionario.findFirst({
      where: {
        usuario,
        senha,
      },
    });
  }
}
