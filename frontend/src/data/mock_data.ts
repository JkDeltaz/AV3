
export interface Funcionario {
    id: string;
    nome: string;
    telefone: string;
    endereco: string;
    usuario: string;
    senha: string;
    nivelPermissao: string;
}

export interface Etapa {
  id: string;
  nome: string;
  prazo: number;
  status: string;
  funcionarios: Array<string>;
}

export interface Aeronave {
  codigo: string;
  modelo: string;
  tipo: string;
  capacidade: number;
  alcance: number;
  etapas: Array<Etapa>;
  pecas: Array<string>;
}

export interface Peca {
  nome: string;
  codigo: string;
  tipo: string;
  fornecedor: string;
  status: string;
}

const funcionarios: Funcionario[] = [
  {
    id: 'F-001',
    nome: 'Rebeca Lima',
    telefone: '(12) 99876-5432',
    endereco: 'Av. Brigadeiro Faria Lima, 2000 - São José dos Campos, SP',
    usuario: 'rebeca.admin',
    senha: '123456789',
    nivelPermissao: 'Administrador'
  },
  {
    id: 'F-102',
    nome: 'Isaura de Lourdes',
    telefone: '(11) 98765-4321',
    endereco: 'Rua das Turbinas, 45 - Campinas, SP',
    usuario: 'isaura.eng',
    senha: 'abcdefghij',
    nivelPermissao: 'Engenheiro'
  },
  {
    id: 'F-201',
    nome: 'Guilherme Rosa',
    telefone: '(21) 97654-3210',
    endereco: 'Estrada do Galeão, s/n - Rio de Janeiro, RJ',
    usuario: 'guilherme.v',
    senha: '000000000',
    nivelPermissao: 'Engenheiro'
  },
  {
    id: 'F-305',
    nome: 'Letícia Gabrielly',
    telefone: '(31) 96543-2109',
    endereco: 'Rua Aeroporto, 12 - Belo Horizonte, MG',
    usuario: 'le.op',
    senha: '67676767',
    nivelPermissao: 'Operador'
  },
  {
    id: 'F-408',
    nome: 'Gustavo Monteiro',
    telefone: '(32) 95432-1098',
    endereco: 'Minas Gerais',
    usuario: 'gustavo.op',
    senha: 'paodequeijo',
    nivelPermissao: 'Operador'
  }
];

const pecas: Peca[] = [
  {
    nome: 'Bocal de Combustível',
    codigo: 'P-1001',
    tipo: 'Nacional',
    fornecedor: 'AeroParts Brasil',
    status: 'Em Produção'
  },
  {
    nome: 'Flap de Asa Direita',
    codigo: 'P-2005',
    tipo: 'Importado',
    fornecedor: 'Global Wings Corp',
    status: 'Em Transporte'
  },
  {
    nome: 'Pneu de Trem de Pouso',
    codigo: 'P-5080',
    tipo: 'Importado',
    fornecedor: 'Goodyear Aviation',
    status: 'Pronta'
  },
  {
    nome: 'Painel de Instrumentos LCD',
    codigo: 'P-0042',
    tipo: 'Importado',
    fornecedor: 'Avionics Tech',
    status: 'Em Produção'
  },
  {
    nome: 'Rebite de Titânio (Lote)',
    codigo: 'P-9901',
    tipo: 'Nacional',
    fornecedor: 'MetalForte S.A.',
    status: 'Pronta'
  }
];

const aeronaves = [
  {
    codigo: 'A001',
    modelo: 'Boeing 737',
    tipo: 'Comercial',
    capacidade: 180,
    alcance: 5000,
    pecas: ['P-1001', 'P-5080'], // Bocal de Combustível e Pneu
    etapas: [
      { id: "1", nome: 'Inspeção de Turbinas', prazo: 10, status: 'Concluída', funcionarios: ['F-102', 'F-201'] },
      { id: "2", nome: 'Revisão de Aviônicos', prazo: 20, status: 'Em Andamento', funcionarios: ['F-102'] },
      { id: "3", nome: 'Abastecimento', prazo: 30, status: 'Concluída', funcionarios: [] }
    ]
  },
  {
    codigo: 'A002',
    modelo: 'Airbus A320',
    tipo: 'Comercial',
    capacidade: 150,
    alcance: 4000,
    pecas: ['P-2005'], // Flap de Asa
    etapas: [
      { id: "1", nome: 'Limpeza Interna', prazo: 15, status: 'Concluída', funcionarios: ['F-305'] },
      { id: "2", nome: 'Checklist de Segurança', prazo: 16, status: 'Pendente', funcionarios: [] }
    ]
  },
  {
    codigo: 'A003',
    modelo: 'Cessna 172',
    tipo: 'Militar',
    capacidade: 4,
    alcance: 800,
    pecas: [], // Nenhuma peça vinculada
    etapas: []
  },
  {
    codigo: 'A004',
    modelo: 'Embraer E195',
    tipo: 'Comercial',
    capacidade: 120,
    alcance: 3500,
    pecas: ['P-9901', 'P-0042', 'P-5080'], // Rebites, Painel e Pneu
    etapas: [
      { id: "1", nome: 'Troca de Óleo', prazo: 67, status: 'Em Andamento', funcionarios: ['F-305', 'F-408'] }
    ]
  },
  {
    codigo: 'A005',
    modelo: 'Bombardier CRJ900',
    tipo: 'Militar',
    capacidade: 90,
    alcance: 3000,
    pecas: ['P-2005', 'P-9901'], // Flap e Rebites
    etapas: [
      { id: "1", nome: 'Pintura de Fuselagem', prazo: 13, status: 'Concluída', funcionarios: [] },
      { id: "2", nome: 'Ajuste de Flaps', prazo: 20, status: 'Concluída', funcionarios: ['F-201'] },
      { id: "3", nome: 'Teste de Voo', prazo: 90, status: 'Pendente', funcionarios: ['F-001', 'F-102'] }
    ]
  }
];


export function getAeronaves() {
    return aeronaves;
} 

export function getFuncionarios() {
    return funcionarios;
}

export function getPecas() {
    return pecas;
}

export function adicionarFuncionarioAEtapa(etapaId: string, funcionarioId: string) {
  for (const aeronave of aeronaves) {
    for (const etapa of aeronave.etapas) {
      if (etapa.id === etapaId) {
        if (!etapa.funcionarios.includes(funcionarioId)) {
          etapa.funcionarios.push(funcionarioId);
        }
        return;
        }
    }
  }
}

export function adicionarPecaAAeronave(aeronaveCodigo: string, pecaCodigo: string) {
  const aeronave = aeronaves.find(a => a.codigo === aeronaveCodigo);
  const peca = getPecas().find(p => p.codigo === pecaCodigo);

  if (aeronave && peca) {
    aeronave.pecas.push(pecaCodigo);
  }
}

export function deletarAeronave(aeronaveCodigo: string) {
  const index = aeronaves.findIndex(a => a.codigo === aeronaveCodigo);
  if (index !== -1) {
    aeronaves.splice(index, 1);
  }
}