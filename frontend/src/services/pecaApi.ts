const API_URL = 'http://localhost:3000/api/pecas';

export interface Peca {
  codigo: string;
  nome: string;
  tipo: 'Nacional' | 'Importada';
  fornecedor: string;
  status: 'Em produção' | 'Em transporte' | 'Pronta';
  aeronaveId?: string | number | null;
  aeronaveCodigo?: string | null;
}

export const pecaApi = {
  // Buscar todas as peças medindo a performance de ponta a ponta (E2E)
  listar: async (): Promise<Peca[]> => {
    // 1. Marca o início absoluto do envio no navegador do usuário
    const inicioFrontend = performance.now();

    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        // Envia o timestamp de alta resolução atual para o backend calcular a latência de ida
        'x-client-timestamp': String(inicioFrontend)
      }
    });

    if (!response.ok) throw new Error('Erro ao buscar peças do servidor');
    const dados = await response.json();

    // 2. Marca o fim absoluto assim que a resposta terminou de ser baixada no navegador
    const fimFrontend = performance.now();

    // 3. Recupera o tempo exato que o servidor passou executando código e acessando o MySQL/Prisma
    const tempoProcessamentoServidor = Number(response.headers.get('x-server-processing-time') || 0);

    // 4. CÁLCULO DAS MÉTRICAS REAIS EM MILISSEGUNDOS (ms)
    const tempoRespostaTotal = fimFrontend - inicioFrontend;
    const latenciaRealRede = tempoRespostaTotal - tempoProcessamentoServidor;

    // Pronta os logs no console do navegador para você copiar os dados para os gráficos do relatório
    console.log(`[PERF - GET /pecas] Tempo de Resposta Total: ${tempoRespostaTotal.toFixed(2)} ms`);
    console.log(`[PERF - GET /pecas] Tempo de Processamento Servidor: ${tempoProcessamentoServidor.toFixed(2)} ms`);
    console.log(`[PERF - GET /pecas] Latência Real de Rede (Ida+Volta): ${latenciaRealRede.toFixed(2)} ms`);

    return dados;
  },

  // Cadastrar uma nova peça medindo a performance de escrita
  criar: async (novaPeca: Peca): Promise<Peca> => {
    const inicioFrontend = performance.now();

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-timestamp': String(inicioFrontend) // Injeta o marcador de tempo para o relatório
      },
      body: JSON.stringify(novaPeca),
    });

    if (!response.ok) {
      const erro = await response.json();
      throw new Error(erro.error || 'Erro ao criar peça');
    }
    
    const dados = await response.json();
    const fimFrontend = performance.now();
    
    const tempoProcessamentoServidor = Number(response.headers.get('x-server-processing-time') || 0);
    const tempoRespostaTotal = fimFrontend - inicioFrontend;
    const latenciaRealRede = tempoRespostaTotal - tempoProcessamentoServidor;

    console.log(`[PERF - POST /pecas] Tempo de Resposta Total: ${tempoRespostaTotal.toFixed(2)} ms`);
    console.log(`[PERF - POST /pecas] Tempo de Processamento Servidor: ${tempoProcessamentoServidor.toFixed(2)} ms`);
    console.log(`[PERF - POST /pecas] Latência Real de Rede (Ida+Volta): ${latenciaRealRede.toFixed(2)} ms`);

    return dados;
  },

  // Atualizar dados de uma peça existente
  atualizar: async (codigo: string, pecaAtualizada: Omit<Peca, 'codigo'>): Promise<Peca> => {
    const inicioFrontend = performance.now();

    const response = await fetch(`${API_URL}/${codigo}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-client-timestamp': String(inicioFrontend)
      },
      body: JSON.stringify(pecaAtualizada),
    });

    if (!response.ok) {
      const erro = await response.json();
      throw new Error(erro.error || 'Erro ao atualizar peça');
    }

    const dados = await response.json();
    const fimFrontend = performance.now();
    
    const tempoProcessamentoServidor = Number(response.headers.get('x-server-processing-time') || 0);
    const tempoRespostaTotal = fimFrontend - inicioFrontend;
    const latenciaRealRede = tempoRespostaTotal - tempoProcessamentoServidor;

    console.log(`[PERF - PUT /pecas/:codigo] Tempo de Resposta Total: ${tempoRespostaTotal.toFixed(2)} ms`);
    console.log(`[PERF - PUT /pecas/:codigo] Tempo de Processamento Servidor: ${tempoProcessamentoServidor.toFixed(2)} ms`);
    console.log(`[PERF - PUT /pecas/:codigo] Latência Real de Rede (Ida+Volta): ${latenciaRealRede.toFixed(2)} ms`);

    return dados;
  },

  // Eliminar uma peça do sistema
  deletar: async (codigo: string): Promise<void> => {
    const inicioFrontend = performance.now();

    const response = await fetch(`${API_URL}/${codigo}`, {
      method: 'DELETE',
      headers: {
        'x-client-timestamp': String(inicioFrontend)
      }
    });

    if (!response.ok) throw new Error('Erro ao eliminar peça');

    const fimFrontend = performance.now();
    
    const tempoProcessamentoServidor = Number(response.headers.get('x-server-processing-time') || 0);
    const tempoRespostaTotal = fimFrontend - inicioFrontend;
    const latenciaRealRede = tempoRespostaTotal - tempoProcessamentoServidor;

    console.log(`[PERF - DELETE /pecas/:codigo] Tempo de Resposta Total: ${tempoRespostaTotal.toFixed(2)} ms`);
    console.log(`[PERF - DELETE /pecas/:codigo] Tempo de Processamento Servidor: ${tempoProcessamentoServidor.toFixed(2)} ms`);
    console.log(`[PERF - DELETE /pecas/:codigo] Latência Real de Rede (Ida+Volta): ${latenciaRealRede.toFixed(2)} ms`);
  }
};