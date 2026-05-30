const API_URL = 'http://localhost:3000/api/pecas';

export interface Peca {
  codigo: string;
  nome: string;
  tipo: 'Nacional' | 'Importada';
  fornecedor: string;
  status: 'Em produção' | 'Em transporte' | 'Pronta';
  aeronaveId?: number | null;
}

export const pecaApi = {
  listar: async (): Promise<Peca[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Erro ao buscar peças do servidor');
    return response.json();
  },

  // Cadastrar uma nova peça
  criar: async (novaPeca: Peca): Promise<Peca> => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(novaPeca),
    });

    if (!response.ok) {
      const erro = await response.json();
      throw new Error(erro.error || 'Erro ao criar peça');
    }
    return response.json();
  },

  atualizar: async (codigo: string, pecaAtualizada: Omit<Peca, 'codigo'>): Promise<Peca> => {
    const response = await fetch(`${API_URL}/${codigo}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pecaAtualizada),
    });

    if (!response.ok) {
      const erro = await response.json();
      throw new Error(erro.error || 'Erro ao atualizar peça');
    }
    return response.json();
  },

  // Eliminar uma peça
  deletar: async (codigo: string): Promise<void> => {
    const response = await fetch(`${API_URL}/${codigo}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao eliminar peça');
  }
};