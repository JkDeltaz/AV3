const API_URL = 'http://localhost:3000/api/testes';

export interface Teste {
  codigo: string;
  tipo: 'Elétrico' | 'Hidráulico' | 'Aerodinâmico';
  resultado: 'Aprovado' | 'Reprovado' | 'Pendente';
  aeronaveId?: number | null;
}

export const testeApi = {
  listar: async (): Promise<Teste[]> => {
    const inicioFrontend = performance.now();

    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'x-client-timestamp': String(inicioFrontend),
      },
    });

    if (!response.ok) throw new Error('Erro ao buscar testes do servidor');

    const dados = await response.json();
    const fimFrontend = performance.now();
    const tempoProcessamentoServidor = Number(response.headers.get('x-server-processing-time') || 0);
    const tempoRespostaTotal = fimFrontend - inicioFrontend;
    const latenciaRealRede = tempoRespostaTotal - tempoProcessamentoServidor;

    console.log(`[PERF - GET /testes] Tempo de Resposta Total: ${tempoRespostaTotal.toFixed(2)} ms`);
    console.log(`[PERF - GET /testes] Tempo de Processamento Servidor: ${tempoProcessamentoServidor.toFixed(2)} ms`);
    console.log(`[PERF - GET /testes] Latência Real de Rede (Ida+Volta): ${latenciaRealRede.toFixed(2)} ms`);

    return dados;
  },

  // Cadastrar um novo teste
  criar: async (novaTeste: Teste): Promise<Teste> => {
    const inicioFrontend = performance.now();

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-timestamp': String(inicioFrontend),
      },
      body: JSON.stringify(novaTeste),
    });

    if (!response.ok) {
      const erro = await response.json();
      throw new Error(erro.error || 'Erro ao criar teste');
    }

    const dados = await response.json();
    const fimFrontend = performance.now();
    const tempoProcessamentoServidor = Number(response.headers.get('x-server-processing-time') || 0);
    const tempoRespostaTotal = fimFrontend - inicioFrontend;
    const latenciaRealRede = tempoRespostaTotal - tempoProcessamentoServidor;

    console.log(`[PERF - POST /testes] Tempo de Resposta Total: ${tempoRespostaTotal.toFixed(2)} ms`);
    console.log(`[PERF - POST /testes] Tempo de Processamento Servidor: ${tempoProcessamentoServidor.toFixed(2)} ms`);
    console.log(`[PERF - POST /testes] Latência Real de Rede (Ida+Volta): ${latenciaRealRede.toFixed(2)} ms`);

    return dados;
  },

  atualizar: async (codigo: string, testeAtualizada: Omit<Teste, 'codigo'>): Promise<Teste> => {
    const inicioFrontend = performance.now();

    const response = await fetch(`${API_URL}/${codigo}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-client-timestamp': String(inicioFrontend),
      },
      body: JSON.stringify(testeAtualizada),
    });

    if (!response.ok) {
      const erro = await response.json();
      throw new Error(erro.error || 'Erro ao atualizar teste');
    }

    const dados = await response.json();
    const fimFrontend = performance.now();
    const tempoProcessamentoServidor = Number(response.headers.get('x-server-processing-time') || 0);
    const tempoRespostaTotal = fimFrontend - inicioFrontend;
    const latenciaRealRede = tempoRespostaTotal - tempoProcessamentoServidor;

    console.log(`[PERF - PUT /testes/${codigo}] Tempo de Resposta Total: ${tempoRespostaTotal.toFixed(2)} ms`);
    console.log(`[PERF - PUT /testes/${codigo}] Tempo de Processamento Servidor: ${tempoProcessamentoServidor.toFixed(2)} ms`);
    console.log(`[PERF - PUT /testes/${codigo}] Latência Real de Rede (Ida+Volta): ${latenciaRealRede.toFixed(2)} ms`);

    return dados;
  },

  // Eliminar um teste
  deletar: async (codigo: string): Promise<void> => {
    const inicioFrontend = performance.now();

    const response = await fetch(`${API_URL}/${codigo}`, {
      method: 'DELETE',
      headers: {
        'x-client-timestamp': String(inicioFrontend),
      },
    });
    if (!response.ok) throw new Error('Erro ao eliminar teste');

    const fimFrontend = performance.now();
    const tempoProcessamentoServidor = Number(response.headers.get('x-server-processing-time') || 0);
    const tempoRespostaTotal = fimFrontend - inicioFrontend;
    const latenciaRealRede = tempoRespostaTotal - tempoProcessamentoServidor;

    console.log(`[PERF - DELETE /testes/${codigo}] Tempo de Resposta Total: ${tempoRespostaTotal.toFixed(2)} ms`);
    console.log(`[PERF - DELETE /testes/${codigo}] Tempo de Processamento Servidor: ${tempoProcessamentoServidor.toFixed(2)} ms`);
    console.log(`[PERF - DELETE /testes/${codigo}] Latência Real de Rede (Ida+Volta): ${latenciaRealRede.toFixed(2)} ms`);
  }
};