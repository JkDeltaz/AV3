import { type Peca } from "./pecaApi";
import { type Etapa } from "./etapaApi";
import { type Teste } from "./testeApi";

const API_URL = 'http://localhost:3000/api/aeronaves';

export interface Aeronave {
  id?: number;
  codigo: string;
  modelo: string;
  tipo: 'Comercial' | 'Militar';
  capacidade: number;
  alcance: number;
  pecas?: Peca[];
  etapas?: Etapa[];
  testes?: Teste[];
}

export const aeronaveApi = {
  buscarPorCodigo: async (codigo: string): Promise<Aeronave> => {
    const inicioFrontend = performance.now();

    const response = await fetch(`${API_URL}/${codigo}`, {
      method: 'GET',
      headers: {
        'x-client-timestamp': String(inicioFrontend),
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar aeronave do servidor');
    }

    const dados = await response.json();
    const fimFrontend = performance.now();
    const tempoProcessamentoServidor = Number(response.headers.get('x-server-processing-time') || 0);
    const tempoRespostaTotal = fimFrontend - inicioFrontend;
    const latenciaRealRede = tempoRespostaTotal - tempoProcessamentoServidor;

    console.log(`[PERF - GET /aeronaves/${codigo}] Tempo de Resposta Total: ${tempoRespostaTotal.toFixed(2)} ms`);
    console.log(`[PERF - GET /aeronaves/${codigo}] Tempo de Processamento Servidor: ${tempoProcessamentoServidor.toFixed(2)} ms`);
    console.log(`[PERF - GET /aeronaves/${codigo}] Latência Real de Rede (Ida+Volta): ${latenciaRealRede.toFixed(2)} ms`);

    return dados;
  },


  listar: async (): Promise<Aeronave[]> => {
    const inicioFrontend = performance.now();

    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'x-client-timestamp': String(inicioFrontend),
      },
    });

    if (!response.ok) throw new Error('Erro ao buscar aeronaves do servidor');

    const dados = await response.json();
    const fimFrontend = performance.now();
    const tempoProcessamentoServidor = Number(response.headers.get('x-server-processing-time') || 0);
    const tempoRespostaTotal = fimFrontend - inicioFrontend;
    const latenciaRealRede = tempoRespostaTotal - tempoProcessamentoServidor;

    console.log(`[PERF - GET /aeronaves] Tempo de Resposta Total: ${tempoRespostaTotal.toFixed(2)} ms`);
    console.log(`[PERF - GET /aeronaves] Tempo de Processamento Servidor: ${tempoProcessamentoServidor.toFixed(2)} ms`);
    console.log(`[PERF - GET /aeronaves] Latência Real de Rede (Ida+Volta): ${latenciaRealRede.toFixed(2)} ms`);

    return dados;
  },

  // Cadastrar uma nova aeronave
  criar: async (novaAeronave: Aeronave): Promise<Aeronave> => {
    const inicioFrontend = performance.now();

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-timestamp': String(inicioFrontend),
      },
      body: JSON.stringify(novaAeronave),
    });

    if (!response.ok) {
      const erro = await response.json();
      throw new Error(erro.error || 'Erro ao criar aeronave');
    }

    const dados = await response.json();
    const fimFrontend = performance.now();
    const tempoProcessamentoServidor = Number(response.headers.get('x-server-processing-time') || 0);
    const tempoRespostaTotal = fimFrontend - inicioFrontend;
    const latenciaRealRede = tempoRespostaTotal - tempoProcessamentoServidor;

    console.log(`[PERF - POST /aeronaves] Tempo de Resposta Total: ${tempoRespostaTotal.toFixed(2)} ms`);
    console.log(`[PERF - POST /aeronaves] Tempo de Processamento Servidor: ${tempoProcessamentoServidor.toFixed(2)} ms`);
    console.log(`[PERF - POST /aeronaves] Latência Real de Rede (Ida+Volta): ${latenciaRealRede.toFixed(2)} ms`);

    return dados;
  },

  atualizar: async (codigo: string, aeronaveAtualizada: Pick<Aeronave, 'modelo' | 'tipo' | 'capacidade' | 'alcance'>): Promise<Aeronave> => {
    const inicioFrontend = performance.now();

    const response = await fetch(`${API_URL}/${codigo}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-client-timestamp': String(inicioFrontend),
      },
      body: JSON.stringify(aeronaveAtualizada),
    });

    if (!response.ok) {
      const erro = await response.json();
      throw new Error(erro.error || 'Erro ao atualizar aeronave');
    }

    const dados = await response.json();
    const fimFrontend = performance.now();
    const tempoProcessamentoServidor = Number(response.headers.get('x-server-processing-time') || 0);
    const tempoRespostaTotal = fimFrontend - inicioFrontend;
    const latenciaRealRede = tempoRespostaTotal - tempoProcessamentoServidor;

    console.log(`[PERF - PUT /aeronaves/${codigo}] Tempo de Resposta Total: ${tempoRespostaTotal.toFixed(2)} ms`);
    console.log(`[PERF - PUT /aeronaves/${codigo}] Tempo de Processamento Servidor: ${tempoProcessamentoServidor.toFixed(2)} ms`);
    console.log(`[PERF - PUT /aeronaves/${codigo}] Latência Real de Rede (Ida+Volta): ${latenciaRealRede.toFixed(2)} ms`);

    return dados;
  },

  // Eliminar uma aeronave
  deletar: async (codigo: string): Promise<void> => {
    const inicioFrontend = performance.now();

    const response = await fetch(`${API_URL}/${codigo}`, {
      method: 'DELETE',
      headers: {
        'x-client-timestamp': String(inicioFrontend),
      },
    });
    if (!response.ok) throw new Error('Erro ao eliminar aeronave');

    const fimFrontend = performance.now();
    const tempoProcessamentoServidor = Number(response.headers.get('x-server-processing-time') || 0);
    const tempoRespostaTotal = fimFrontend - inicioFrontend;
    const latenciaRealRede = tempoRespostaTotal - tempoProcessamentoServidor;

    console.log(`[PERF - DELETE /aeronaves/${codigo}] Tempo de Resposta Total: ${tempoRespostaTotal.toFixed(2)} ms`);
    console.log(`[PERF - DELETE /aeronaves/${codigo}] Tempo de Processamento Servidor: ${tempoProcessamentoServidor.toFixed(2)} ms`);
    console.log(`[PERF - DELETE /aeronaves/${codigo}] Latência Real de Rede (Ida+Volta): ${latenciaRealRede.toFixed(2)} ms`);
  }
  ,
  adicionarPeca: async (codigo: string, pecaCodigo: string) => {
    const inicioFrontend = performance.now();

    const response = await fetch(`${API_URL}/${codigo}/pecas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-timestamp': String(inicioFrontend),
      },
      body: JSON.stringify({ pecaCodigo }),
    });

    if (!response.ok) {
      const erro = await response.json();
      throw new Error(erro.error || 'Erro ao adicionar peça à aeronave');
    }

    const dados = await response.json();
    const fimFrontend = performance.now();
    const tempoProcessamentoServidor = Number(response.headers.get('x-server-processing-time') || 0);
    const tempoRespostaTotal = fimFrontend - inicioFrontend;
    const latenciaRealRede = tempoRespostaTotal - tempoProcessamentoServidor;

    console.log(`[PERF - POST /aeronaves/${codigo}/pecas] Tempo de Resposta Total: ${tempoRespostaTotal.toFixed(2)} ms`);
    console.log(`[PERF - POST /aeronaves/${codigo}/pecas] Tempo de Processamento Servidor: ${tempoProcessamentoServidor.toFixed(2)} ms`);
    console.log(`[PERF - POST /aeronaves/${codigo}/pecas] Latência Real de Rede (Ida+Volta): ${latenciaRealRede.toFixed(2)} ms`);

    return dados;
  }
};