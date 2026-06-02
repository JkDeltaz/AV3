import prisma from '../config/database.js';

// Definição da interface TypeScript para tipar a criação de uma nova aeronave
interface CriarAeronaveInput {
  codigo: string;
  modelo: string;
  tipo: 'Comercial' | 'Militar';
  capacidade: number;
  alcance: number;
}

// Definição da interface para atualização (torna todos os campos opcionais)
interface AtualizarAeronaveInput {
  modelo?: string;
  tipo?: 'Comercial' | 'Militar';
  capacidade?: number;
  alcance?: number;
}

export class AeronaveService {
  
  // 1. Buscar todas as aeronaves cadastradas no MySQL
  static async buscarTodas() {
    return await prisma.aeronave.findMany({
      include: {
        pecas: true,
        testes: true,
        etapas: {
          include: {
            funcionarios: true,
          },
        },
      },
    });
  }

  // 2. Buscar uma única aeronave pelo seu código único (que mapeamos no schema)
  static async buscarPorCodigo(codigo: string) {
    return await prisma.aeronave.findUnique({
      where: { codigo },
      include: {
        pecas: true,
        testes: true,
        etapas: {
          include: {
            funcionarios: true,
          },
        },
      },
    });
  }

  // 3. Inserir uma nova aeronave no banco de dados
  static async criar(dados: CriarAeronaveInput) {
    return await prisma.aeronave.create({
      data: {
        codigo: dados.codigo,
        modelo: dados.modelo,
        tipo: dados.tipo,
        capacidade: dados.capacidade,
        alcance: dados.alcance
      }
    });
  }

  // 4. Atualizar os dados ou o status de uma aeronave existente
  static async atualizar(codigo: string, dados: AtualizarAeronaveInput) {
    return await prisma.aeronave.update({
      where: { codigo },
      data: dados,
      include: {
        pecas: true,
        testes: true,
        etapas: {
          include: {
            funcionarios: true,
          },
        },
      },
    });
  }

  // 5. Deletar uma aeronave do sistema pelo código
  static async deletar(codigo: string) {
    return await prisma.aeronave.delete({
      where: { codigo }
    });
  }

  // 6. Adicionar uma peça à aeronave (vincular por código)
  static async adicionarPeca(codigo: string, pecaCodigo: string) {
    return await prisma.aeronave.update({
      where: { codigo },
      data: {
        pecas: {
          connect: { codigo: pecaCodigo }
        }
      },
      include: {
        pecas: true,
        testes: true,
        etapas: {
          include: {
            funcionarios: true,
          }
        }
      }
    });
  }
}