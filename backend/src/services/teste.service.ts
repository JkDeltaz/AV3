import prisma from '../config/database.js';

// Definição da interface TypeScript para tipar a criação de uma nova teste
interface CriarTesteInput {
  codigo: string;
  tipo: 'Hidráulico' | 'Elétrico' | 'Aerodinâmico';
  resultado: 'Aprovado' | 'Recusado' | 'Pendente';

  aeronaveId: number; // Relacionamento com a aeronave
}

// Definição da interface para atualização (torna todos os campos opcionais)
interface AtualizarTesteInput {
  codigo?: string;
  tipo?: 'Hidráulico' | 'Elétrico' | 'Aerodinâmico';
  resultado?: 'Aprovado' | 'Recusado' | 'Pendente';
}

export class TesteService {
  
  // 1. Buscar todas as testes cadastradas no MySQL
  static async buscarTodas() {

    const testes = prisma.teste.findMany();
    console.log(testes)
    if (!testes) {
      return [];
    }

    return await prisma.teste.findMany();
  }

  // 2. Buscar uma única teste pelo seu código único (que mapeamos no schema)
  static async buscarPorCodigo(codigo: string) {
    return await prisma.teste.findUnique({
      where: { codigo }
    });
  }

  // 3. Inserir uma nova teste no banco de dados
  static async criar(dados: CriarTesteInput) {
    return await prisma.teste.create({
      data: {
        codigo: dados.codigo,
        tipo: dados.tipo,
        resultado: dados.resultado,
        aeronaveId: dados.aeronaveId
      }
    });
  }

  // 4. Atualizar os dados ou o status de uma teste existente
  static async atualizar(codigo: string, dados: AtualizarTesteInput) {
    return await prisma.teste.update({
      where: { codigo },
      data: dados
    });
  }

  // 5. Deletar uma teste do sistema pelo código
  static async deletar(codigo: string) {
    return await prisma.teste.delete({
      where: { codigo }
    });
  }
}