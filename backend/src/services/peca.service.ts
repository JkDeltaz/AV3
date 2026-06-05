import prisma from '../config/database.js';

// Definição da interface TypeScript para tipar a criação de uma nova peça
interface CriarPecaInput {
  codigo: string;
  nome: string;
  tipo: 'Nacional' | 'Importada';
  fornecedor: string;
  status: 'Em produção' | 'Em transporte' | 'Pronta';
}

// Definição da interface para atualização (torna todos os campos opcionais)
interface AtualizarPecaInput {
  nome?: string;
  tipo?: 'Nacional' | 'Importada';
  fornecedor?: string;
  status?: 'Em produção' | 'Em transporte' | 'Pronta';
}

export class PecaService {
  
  // 1. Buscar todas as peças cadastradas no MySQL
  static async buscarTodas() {
    const pecas = await prisma.peca.findMany({
      include: {
        aeronave: {
          select: {
            codigo: true
          }
        }
      }
    });

    return pecas.map((peca) => {
      const { aeronave, ...rest } = peca as any;
      return {
        ...rest,
        aeronaveCodigo: aeronave?.codigo ?? null,
      };
    });
  }

  // 2. Buscar uma única peça pelo seu código único (que mapeamos no schema)
  static async buscarPorCodigo(codigo: string) {
    const peca = await prisma.peca.findUnique({
      where: { codigo },
      include: {
        aeronave: {
          select: {
            codigo: true
          }
        }
      }
    });

    if (!peca) return null;

    const { aeronave, ...rest } = peca as any;
    return {
      ...rest,
      aeronaveCodigo: aeronave?.codigo ?? null,
    };
  }

  // 3. Inserir uma nova peça no banco de dados
  static async criar(dados: CriarPecaInput) {
    return await prisma.peca.create({
      data: {
        codigo: dados.codigo,
        nome: dados.nome,
        tipo: dados.tipo,
        fornecedor: dados.fornecedor,
        status: dados.status
      }
    });
  }

  // 4. Atualizar os dados ou o status de uma peça existente
  static async atualizar(codigo: string, dados: AtualizarPecaInput) {
    return await prisma.peca.update({
      where: { codigo },
      data: dados
    });
  }

  // 5. Deletar uma peça do sistema pelo código
  static async deletar(codigo: string) {
    return await prisma.peca.delete({
      where: { codigo }
    });
  }
}