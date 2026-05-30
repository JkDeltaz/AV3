import {type Funcionario} from "./funcionarioApi";

const API_URL = 'http://localhost:3000/api/etapas';

export interface Etapa {
  codigo: string;
  nome: string;
  prazo: number;
  status: 'Pendente' | 'Em andamento' | 'Concluída';
  aeronaveId?: number | null;
  funcionarios: Funcionario[];
}

export const etapaApi = {
  listar: async (): Promise<Etapa[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Erro ao buscar etapas do servidor');
    return response.json();
  },

  // Cadastrar uma nova etapa
  criar: async (novaEtapa: Etapa): Promise<Etapa> => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(novaEtapa),
    });

    if (!response.ok) {
      const erro = await response.json();
      throw new Error(erro.error || 'Erro ao criar etapa');
    }
    return response.json();
  },

  atualizar: async (codigo: string, etapaAtualizada: Omit<Etapa, 'codigo'>): Promise<Etapa> => {
    const response = await fetch(`${API_URL}/${codigo}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(etapaAtualizada),
    });

    if (!response.ok) {
      const erro = await response.json();
      throw new Error(erro.error || 'Erro ao atualizar etapa');
    }
    return response.json();
  },

  // Eliminar uma etapa
  deletar: async (codigo: string): Promise<void> => {
    const response = await fetch(`${API_URL}/${codigo}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao eliminar etapa');
  }
};