import prisma from './database.js';

export async function seedDatabase() {
  try {
    const aeronaveCount = await prisma.aeronave.count();
    const adminUser = await prisma.funcionario.findUnique({
      where: { usuario: 'admin' },
    });

    if (!adminUser) {
      await prisma.funcionario.create({
        data: {
          codigo: 'ADMIN',
          nome: 'Administrador',
          telefone: '00000000000',
          endereco: 'Sede',
          usuario: 'admin',
          senha: 'admin123',
          nivelPermissao: 'Administrador',
        },
      });
      console.log('[SEED] Usuário admin criado.');
    }

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

      const peca = await prisma.peca.create({
        data: {
          codigo: 'P001',
          nome: 'Turbina X',
          tipo: 'Nacional',
          fornecedor: 'Acme Aero',
          status: 'Pronta',
          aeronaveId: aeronave.id,
        },
      });

      const etapa = await prisma.etapa.create({
        data: {
          codigo: 'E001',
          nome: 'Inspeção Inicial',
          prazo: 7,
          status: 'Pendente',
          aeronaveId: aeronave.id,
        },
      });

      const admin = await prisma.funcionario.findUnique({
        where: { usuario: 'admin' },
      });

      if (admin) {
        await prisma.etapa.update({
          where: { id: etapa.id },
          data: { funcionarios: { connect: { id: admin.id } } },
        });
      }

      console.log('[SEED] Dados iniciais inseridos.');
    } else {
      console.log('[SEED] Banco já contém dados, pulando seed.');
    }
  } catch (error: any) {
    console.error('[SEED] Erro ao popular banco:', error?.message ?? error);
  }
}

export default seedDatabase;
