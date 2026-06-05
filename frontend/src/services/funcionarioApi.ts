import { type Etapa } from "./etapaApi";

const API_URL = 'http://localhost:3000/api/funcionarios';

export interface Funcionario {
  codigo: string;
  nome: string;
  telefone: string;
  endereco: string;
  usuario: string;
  senha: string;
  nivelPermissao: 'Administrador' | 'Engenheiro' | 'Operador';
  etapas?: Etapa[];
}

export const funcionarioApi = {
  listar: async (): Promise<Funcionario[]> => {
    const inicioFrontend = performance.now();

    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'x-client-timestamp': String(inicioFrontend),
      },
    });

    if (!response.ok) throw new Error('Erro ao buscar funcionarios do servidor');

    const dados = await response.json();
    const fimFrontend = performance.now();
    const tempoProcessamentoServidor = Number(response.headers.get('x-server-processing-time') || 0);
    const tempoRespostaTotal = fimFrontend - inicioFrontend;
    const latenciaRealRede = tempoRespostaTotal - tempoProcessamentoServidor;

    console.log(`[PERF - GET /funcionarios] Tempo de Resposta Total: ${tempoRespostaTotal.toFixed(2)} ms`);
    console.log(`[PERF - GET /funcionarios] Tempo de Processamento Servidor: ${tempoProcessamentoServidor.toFixed(2)} ms`);
    console.log(`[PERF - GET /funcionarios] Latência Real de Rede (Ida+Volta): ${latenciaRealRede.toFixed(2)} ms`);

    return dados;
  },

  // Cadastrar um novo funcionário
  criar: async (novoFuncionario: Funcionario): Promise<Funcionario> => {
    const inicioFrontend = performance.now();

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-timestamp': String(inicioFrontend),
      },
      body: JSON.stringify(novoFuncionario),
    });

    if (!response.ok) {
      const erro = await response.json();
      throw new Error(erro.error || 'Erro ao criar funcionário');
    }

    const dados = await response.json();
    const fimFrontend = performance.now();
    const tempoProcessamentoServidor = Number(response.headers.get('x-server-processing-time') || 0);
    const tempoRespostaTotal = fimFrontend - inicioFrontend;
    const latenciaRealRede = tempoRespostaTotal - tempoProcessamentoServidor;

    console.log(`[PERF - POST /funcionarios] Tempo de Resposta Total: ${tempoRespostaTotal.toFixed(2)} ms`);
    console.log(`[PERF - POST /funcionarios] Tempo de Processamento Servidor: ${tempoProcessamentoServidor.toFixed(2)} ms`);
    console.log(`[PERF - POST /funcionarios] Latência Real de Rede (Ida+Volta): ${latenciaRealRede.toFixed(2)} ms`);

    return dados;
  },

  atualizar: async (codigo: string, funcionarioAtualizado: Partial<Omit<Funcionario, 'codigo'>>): Promise<Funcionario> => {
    const inicioFrontend = performance.now();

    const response = await fetch(`${API_URL}/${codigo}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-client-timestamp': String(inicioFrontend),
      },
      body: JSON.stringify(funcionarioAtualizado),
    });

    if (!response.ok) {
      const erro = await response.json();
      throw new Error(erro.error || 'Erro ao atualizar funcionário');
    }

    const dados = await response.json();
    const fimFrontend = performance.now();
    const tempoProcessamentoServidor = Number(response.headers.get('x-server-processing-time') || 0);
    const tempoRespostaTotal = fimFrontend - inicioFrontend;
    const latenciaRealRede = tempoRespostaTotal - tempoProcessamentoServidor;

    console.log(`[PERF - PUT /funcionarios/${codigo}] Tempo de Resposta Total: ${tempoRespostaTotal.toFixed(2)} ms`);
    console.log(`[PERF - PUT /funcionarios/${codigo}] Tempo de Processamento Servidor: ${tempoProcessamentoServidor.toFixed(2)} ms`);
    console.log(`[PERF - PUT /funcionarios/${codigo}] Latência Real de Rede (Ida+Volta): ${latenciaRealRede.toFixed(2)} ms`);

    return dados;
  },

  // Eliminar um funcionário
  deletar: async (codigo: string): Promise<void> => {
    const inicioFrontend = performance.now();

    const response = await fetch(`${API_URL}/${codigo}`, {
      method: 'DELETE',
      headers: {
        'x-client-timestamp': String(inicioFrontend),
      },
    });
    if (!response.ok) throw new Error('Erro ao eliminar funcionário');

    const fimFrontend = performance.now();
    const tempoProcessamentoServidor = Number(response.headers.get('x-server-processing-time') || 0);
    const tempoRespostaTotal = fimFrontend - inicioFrontend;
    const latenciaRealRede = tempoRespostaTotal - tempoProcessamentoServidor;

    console.log(`[PERF - DELETE /funcionarios/${codigo}] Tempo de Resposta Total: ${tempoRespostaTotal.toFixed(2)} ms`);
    console.log(`[PERF - DELETE /funcionarios/${codigo}] Tempo de Processamento Servidor: ${tempoProcessamentoServidor.toFixed(2)} ms`);
    console.log(`[PERF - DELETE /funcionarios/${codigo}] Latência Real de Rede (Ida+Volta): ${latenciaRealRede.toFixed(2)} ms`);
  }
};