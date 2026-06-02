import prisma from './database.js';

export async function seedDatabase() {
  try {
    const aeronaveCount = await prisma.aeronave.count();

    // 1. Garante a criação dos usuários usando UPSERT baseado no CODIGO (evita conflito de chaves únicas)
    const adminUser = await prisma.funcionario.upsert({
      where: { codigo: 'ADMIN' },
      update: {}, // Não altera nada se o código 'ADMIN' já existir
      create: {
        codigo: 'ADMIN',
        nome: 'Administrador',
        telefone: '00000000000',
        endereco: 'Sede',
        usuario: 'admin',
        senha: 'admin123',
        nivelPermissao: 'Administrador',
      },
    });
    console.log('[SEED] Usuário admin verificado/criado.');

    const engenheiroUser = await prisma.funcionario.upsert({
      where: { codigo: 'ENGENHEIRO' },
      update: {},
      create: {
        codigo: 'ENGENHEIRO',
        nome: 'Engenheiro',
        telefone: '00000000000',
        endereco: 'Sede',
        usuario: 'engenheiro',
        senha: 'engenheiro123',
        nivelPermissao: 'Engenheiro',
      },
    });
    console.log('[SEED] Usuário engenheiro verificado/criado.');

    const operadorUser = await prisma.funcionario.upsert({
      where: { codigo: 'OPERADOR' },
      update: {},
      create: {
        codigo: 'OPERADOR',
        nome: 'Operador',
        telefone: '00000000000',
        endereco: 'Sede',
        usuario: 'operador',
        senha: 'operador123',
        nivelPermissao: 'Operador',
      },
    });
    console.log('[SEED] Usuário operador verificado/criado.');

    // 2. Popula os dados de aeronaves, peças e etapas
    if (aeronaveCount === 0) {
      const aeronave = await prisma.aeronave.create({
        data: {
          codigo: 'A001',
          modelo: 'A320',
          tipo: 'Comercial',
          capacidade: 180,
          alcance: 6100,
        },
      });

      await prisma.peca.create({
        data: {
          codigo: 'P001',
          nome: 'Turbina X',
          tipo: 'Nacional',
          fornecedor: 'Acme Aero',
          status: 'Pronta',
          aeronaveId: aeronave.id,
        },
      });

      await prisma.etapa.create({
        data: {
          codigo: 'E001',
          nome: 'Inspeção Inicial',
          prazo: 7,
          status: 'Pendente',
          aeronaveId: aeronave.id,
          funcionarios: {
            connect: { id: operadorUser.id }
          }
        },
      });

      console.log('[SEED] Dados iniciais (Aeronave, Peça e Etapa) inseridos.');
    } else {
      console.log('[SEED] Banco já contém aeronaves, pulando criação de dados operacionais.');
    }
  } catch (error: any) {
    console.error('[SEED] Erro ao popular banco:', error?.message ?? error);
  }
}

export default seedDatabase;