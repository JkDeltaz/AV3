const API_URL = 'http://localhost:3000/api/auth';

export interface AuthLoginResponse {
  codigo: string;
  usuario: string;
  nivelPermissao: 'Administrador' | 'Engenheiro' | 'Operador';
}

export const authApi = {
  login: async (usuario: string, senha: string): Promise<AuthLoginResponse> => {
    const inicioFrontend = performance.now();

    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-timestamp': String(inicioFrontend),
      },
      body: JSON.stringify({ usuario, senha }),
    });

    if (!response.ok) {
      const erro = await response.json().catch(() => null);
      throw new Error(erro?.error || 'Erro ao autenticar');
    }

    const dados = await response.json();
    const fimFrontend = performance.now();
    const tempoProcessamentoServidor = Number(response.headers.get('x-server-processing-time') || 0);
    const tempoRespostaTotal = fimFrontend - inicioFrontend;
    const latenciaRealRede = tempoRespostaTotal - tempoProcessamentoServidor;

    console.log(`[PERF - POST /auth/login] Tempo de Resposta Total: ${tempoRespostaTotal.toFixed(2)} ms`);
    console.log(`[PERF - POST /auth/login] Tempo de Processamento Servidor: ${tempoProcessamentoServidor.toFixed(2)} ms`);
    console.log(`[PERF - POST /auth/login] Latência Real de Rede (Ida+Volta): ${latenciaRealRede.toFixed(2)} ms`);

    return dados;
  },
};
