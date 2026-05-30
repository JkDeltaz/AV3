import prisma from '../config/database.js';

// Definição da interface TypeScript para tipar a criação de uma nova etapa
interface CriarEtapaInput {
  codigo: string;
  nome: string;
  prazo: number;
  status: 'Pendente' | 'Em andamento' | 'Concluída';
  
  aeronaveId: number; // Relacionamento com aeronave
}

// Definição da interface para atualização (torna todos os campos opcionais)
interface AtualizarEtapaInput {
  nome?: string;
  prazo?: number;
  status?: 'Pendente' | 'Em andamento' | 'Concluída';
}

interface AdicionarFuncionarioInput {
  funcionarioId: number;
}

export class EtapaService {
  
  // 1. Buscar todas as etapas cadastradas no MySQL
  static async buscarTodas() {

    const etapas = prisma.etapa.findMany();
    console.log(etapas)
    if (!etapas) {
      return [];
    }

    return await prisma.etapa.findMany();
  }

  // 2. Buscar uma única etapa pelo seu código único (que mapeamos no schema)
  static async buscarPorCodigo(codigo: string) {
    return await prisma.etapa.findUnique({
      where: { codigo }
    });
  }

  // 3. Inserir uma nova etapa no banco de dados
  static async criar(dados: CriarEtapaInput) {
    return await prisma.etapa.create({
      data: {
        codigo: dados.codigo,
        nome: dados.nome,
        prazo: dados.prazo,
        status: dados.status,
      }
    });
  }

  // 4. Atualizar os dados ou o status de uma etapa existente
  static async atualizar(codigo: string, dados: AtualizarEtapaInput) {
    return await prisma.etapa.update({
      where: { codigo },
      data: dados
    });
  }

  // 5. Deletar uma etapa do sistema pelo código
  static async deletar(codigo: string) {
    return await prisma.etapa.delete({
      where: { codigo }
    });
  }

  // 6. Adicionar um funcionário responsável a uma etapa
  static async adicionarFuncionario(codigo: string, dados: AdicionarFuncionarioInput) {
    return await prisma.etapa.update({
      where: { codigo },
      data: {
        funcionarios: {
          connect: { id: dados.funcionarioId }
        }
      }
    });
  }

}