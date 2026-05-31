const API_URL = 'http://localhost:3000/api/auth';

export interface AuthLoginResponse {
  codigo: string;
  usuario: string;
  nivelPermissao: 'Administrador' | 'Engenheiro' | 'Operador';
}

export const authApi = {
  login: async (usuario: string, senha: string): Promise<AuthLoginResponse> => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ usuario, senha }),
    });

    if (!response.ok) {
      const erro = await response.json().catch(() => null);
      throw new Error(erro?.error || 'Erro ao autenticar');
    }

    return response.json();
  },
};
