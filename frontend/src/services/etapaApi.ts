import {type Funcionario} from "./funcionarioApi";

const API_URL = 'http://localhost:3000/api/etapas';

export interface Etapa {
  codigo: string;
  nome: string;
  prazo: number;
  status: 'Pendente' | 'Em andamento' | 'Concluída';
  aeronaveId: number;
  funcionarios: Funcionario[];
}

export const etapaApi = {
  listar: async (): Promise<Etapa[]> => {
    const inicioFrontend = performance.now();

    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'x-client-timestamp': String(inicioFrontend),
      },
    });

    if (!response.ok) throw new Error('Erro ao buscar etapas do servidor');

    const dados = await response.json();
    const fimFrontend = performance.now();
    const tempoProcessamentoServidor = Number(response.headers.get('x-server-processing-time') || 0);
    const tempoRespostaTotal = fimFrontend - inicioFrontend;
    const latenciaRealRede = tempoRespostaTotal - tempoProcessamentoServidor;

    console.log(`[PERF - GET /etapas] Tempo de Resposta Total: ${tempoRespostaTotal.toFixed(2)} ms`);
    console.log(`[PERF - GET /etapas] Tempo de Processamento Servidor: ${tempoProcessamentoServidor.toFixed(2)} ms`);
    console.log(`[PERF - GET /etapas] Latência Real de Rede (Ida+Volta): ${latenciaRealRede.toFixed(2)} ms`);

    return dados;
  },

  // Cadastrar uma nova etapa
  criar: async (novaEtapa: Etapa): Promise<Etapa> => {
    const inicioFrontend = performance.now();

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-timestamp': String(inicioFrontend),
      },
      body: JSON.stringify(novaEtapa),
    });

    if (!response.ok) {
      const erro = await response.json();
      throw new Error(erro.error || 'Erro ao criar etapa');
    }

    const dados = await response.json();
    const fimFrontend = performance.now();
    const tempoProcessamentoServidor = Number(response.headers.get('x-server-processing-time') || 0);
    const tempoRespostaTotal = fimFrontend - inicioFrontend;
    const latenciaRealRede = tempoRespostaTotal - tempoProcessamentoServidor;

    console.log(`[PERF - POST /etapas] Tempo de Resposta Total: ${tempoRespostaTotal.toFixed(2)} ms`);
    console.log(`[PERF - POST /etapas] Tempo de Processamento Servidor: ${tempoProcessamentoServidor.toFixed(2)} ms`);
    console.log(`[PERF - POST /etapas] Latência Real de Rede (Ida+Volta): ${latenciaRealRede.toFixed(2)} ms`);

    return dados;
  },

  atualizar: async (codigo: string, etapaAtualizada: Partial<Omit<Etapa, 'codigo'>>): Promise<Etapa> => {
    const inicioFrontend = performance.now();

    const response = await fetch(`${API_URL}/${codigo}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-client-timestamp': String(inicioFrontend),
      },
      body: JSON.stringify(etapaAtualizada),
    });

    if (!response.ok) {
      const erro = await response.json();
      throw new Error(erro.error || 'Erro ao atualizar etapa');
    }

    const dados = await response.json();
    const fimFrontend = performance.now();
    const tempoProcessamentoServidor = Number(response.headers.get('x-server-processing-time') || 0);
    const tempoRespostaTotal = fimFrontend - inicioFrontend;
    const latenciaRealRede = tempoRespostaTotal - tempoProcessamentoServidor;

    console.log(`[PERF - PUT /etapas/${codigo}] Tempo de Resposta Total: ${tempoRespostaTotal.toFixed(2)} ms`);
    console.log(`[PERF - PUT /etapas/${codigo}] Tempo de Processamento Servidor: ${tempoProcessamentoServidor.toFixed(2)} ms`);
    console.log(`[PERF - PUT /etapas/${codigo}] Latência Real de Rede (Ida+Volta): ${latenciaRealRede.toFixed(2)} ms`);

    return dados;
  },

  adicionarFuncionario: async (codigo: string, funcionarioCodigo: string): Promise<Etapa> => {
    const inicioFrontend = performance.now();

    const response = await fetch(`${API_URL}/${codigo}/funcionarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-timestamp': String(inicioFrontend),
      },
      body: JSON.stringify({ funcionarioCodigo }),
    });

    if (!response.ok) {
      const erro = await response.json();
      throw new Error(erro.error || 'Erro ao adicionar funcionário à etapa');
    }

    const dados = await response.json();
    const fimFrontend = performance.now();
    const tempoProcessamentoServidor = Number(response.headers.get('x-server-processing-time') || 0);
    const tempoRespostaTotal = fimFrontend - inicioFrontend;
    const latenciaRealRede = tempoRespostaTotal - tempoProcessamentoServidor;

    console.log(`[PERF - POST /etapas/${codigo}/funcionarios] Tempo de Resposta Total: ${tempoRespostaTotal.toFixed(2)} ms`);
    console.log(`[PERF - POST /etapas/${codigo}/funcionarios] Tempo de Processamento Servidor: ${tempoProcessamentoServidor.toFixed(2)} ms`);
    console.log(`[PERF - POST /etapas/${codigo}/funcionarios] Latência Real de Rede (Ida+Volta): ${latenciaRealRede.toFixed(2)} ms`);

    return dados;
  },

  // Eliminar uma etapa
  deletar: async (codigo: string): Promise<void> => {
    const inicioFrontend = performance.now();

    const response = await fetch(`${API_URL}/${codigo}`, {
      method: 'DELETE',
      headers: {
        'x-client-timestamp': String(inicioFrontend),
      },
    });
    if (!response.ok) throw new Error('Erro ao eliminar etapa');

    const fimFrontend = performance.now();
    const tempoProcessamentoServidor = Number(response.headers.get('x-server-processing-time') || 0);
    const tempoRespostaTotal = fimFrontend - inicioFrontend;
    const latenciaRealRede = tempoRespostaTotal - tempoProcessamentoServidor;

    console.log(`[PERF - DELETE /etapas/${codigo}] Tempo de Resposta Total: ${tempoRespostaTotal.toFixed(2)} ms`);
    console.log(`[PERF - DELETE /etapas/${codigo}] Tempo de Processamento Servidor: ${tempoProcessamentoServidor.toFixed(2)} ms`);
    console.log(`[PERF - DELETE /etapas/${codigo}] Latência Real de Rede (Ida+Volta): ${latenciaRealRede.toFixed(2)} ms`);
  }
};