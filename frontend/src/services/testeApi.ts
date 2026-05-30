const API_URL = 'http://localhost:3000/api/testes';

export interface Teste {
  codigo: string;
  tipo: 'Elétrico' | 'Hidráulico' | 'Aerodinâmico';
  resultado: 'Aprovado' | 'Reprovado' | 'Pendente';
  aeronaveId?: number | null;
}

export const testeApi = {
  listar: async (): Promise<Teste[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Erro ao buscar testes do servidor');
    return response.json();
  },

  // Cadastrar um novo teste
  criar: async (novaTeste: Teste): Promise<Teste> => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(novaTeste),
    });

    if (!response.ok) {
      const erro = await response.json();
      throw new Error(erro.error || 'Erro ao criar teste');
    }
    return response.json();
  },

  atualizar: async (codigo: string, testeAtualizada: Omit<Teste, 'codigo'>): Promise<Teste> => {
    const response = await fetch(`${API_URL}/${codigo}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testeAtualizada),
    });

    if (!response.ok) {
      const erro = await response.json();
      throw new Error(erro.error || 'Erro ao atualizar teste');
    }
    return response.json();
  },

  // Eliminar um teste
  deletar: async (codigo: string): Promise<void> => {
    const response = await fetch(`${API_URL}/${codigo}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao eliminar teste');
  }
};