import prisma from '../config/database.js';

// Definição da interface TypeScript para tipar a criação de uma nova funcionario
interface CriarFuncionarioInput {
  codigo: string;
  nome: string;
  telefone: string;
  endereco: string;
  usuario: string;
  senha: string;
  nivelPermissao: 'Administrador'|'Engenheiro'|'Operador'
}

// Definição da interface para atualização (torna todos os campos opcionais)
interface AtualizarFuncionarioInput {
  nome?: string;
  telefone?: string;
  endereco?: string;
  usuario?: string;
  senha?: string;
  nivelPermissao?: 'Administrador'|'Engenheiro'|'Operador'
}

export class FuncionarioService {
  
  // 1. Buscar todas as funcionarios cadastradas no MySQL
  static async buscarTodas() {

    const funcionarios = prisma.funcionario.findMany();
    console.log(funcionarios)
    if (!funcionarios) {
      return [];
    }

    return await prisma.funcionario.findMany();
  }

  // 2. Buscar uma única funcionario pelo seu código único (que mapeamos no schema)
  static async buscarPorCodigo(codigo: string) {
    return await prisma.funcionario.findUnique({
      where: { codigo }
    });
  }

  // 3. Inserir uma nova funcionario no banco de dados
  static async criar(dados: CriarFuncionarioInput) {
    return await prisma.funcionario.create({
      data: {
        codigo: dados.codigo,
        nome: dados.nome,
        telefone: dados.telefone,
        endereco: dados.endereco,
        usuario: dados.usuario,
        senha: dados.senha,
        nivelPermissao: dados.nivelPermissao
      }
    });
  }

  // 4. Atualizar os dados ou o status de uma funcionario existente
  static async atualizar(codigo: string, dados: AtualizarFuncionarioInput) {
    return await prisma.funcionario.update({
      where: { codigo },
      data: dados
    });
  }

  // 5. Deletar uma funcionario do sistema pelo código
  static async deletar(codigo: string) {
    return await prisma.funcionario.delete({
      where: { codigo }
    });
  }
}