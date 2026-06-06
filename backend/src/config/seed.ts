import prisma from './database.js';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function seedDatabase() {
  let tentativas = 15;
  const tempoEspera = 5000; 

  while (tentativas > 0) {
    try {
      const aeronaveCount = await prisma.aeronave.count();
      
      console.log('[SEED] Conexão com o banco estabelecida com sucesso!');

      const adminUser = await prisma.funcionario.upsert({
        where: { codigo: 'ADMIN' },
        update: {}, 
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

      break;

    } catch (error: any) {
      tentativas--;
      
      const erroConexao = error?.message?.includes("Can't reach database server") || error?.code === 'P1001';
      
      if (erroConexao && tentativas > 0) {
        console.warn(`[SEED] O banco de dados ainda não aceita conexões. Aguardando ${tempoEspera / 1000}s... (Tentativas restantes: ${tentativas})`);
        await sleep(tempoEspera);
      } else {
        console.error('[SEED] Erro crítico ao popular banco:', error?.message ?? error);
        break;
      }
    }
  }
}

export default seedDatabase;