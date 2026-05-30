import { type Peca } from "./pecaApi";
import { type Etapa } from "./etapaApi";
import { type Teste } from "./testeApi";

const API_URL = 'http://localhost:3000/api/aeronaves';

export interface Aeronave {
  codigo: string;
  modelo: string;
  tipo: 'Comercial' | 'Militar';
  capacidade: number;
  alcance: number;
  pecas: Peca[];
  etapas: Etapa[];
  testes: Teste[];
}

export const aeronaveApi = {
  listar: async (): Promise<Aeronave[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Erro ao buscar aeronaves do servidor');
    return response.json();
  },

  // Cadastrar uma nova aeronave
  criar: async (novaAeronave: Aeronave): Promise<Aeronave> => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(novaAeronave),
    });

    if (!response.ok) {
      const erro = await response.json();
      throw new Error(erro.error || 'Erro ao criar aeronave');
    }
    return response.json();
  },

  atualizar: async (codigo: string, aeronaveAtualizada: Omit<Aeronave, 'codigo'>): Promise<Aeronave> => {
    const response = await fetch(`${API_URL}/${codigo}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(aeronaveAtualizada),
    });

    if (!response.ok) {
      const erro = await response.json();
      throw new Error(erro.error || 'Erro ao atualizar aeronave');
    }
    return response.json();
  },

  // Eliminar uma aeronave
  deletar: async (codigo: string): Promise<void> => {
    const response = await fetch(`${API_URL}/${codigo}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao eliminar aeronave');
  }
};