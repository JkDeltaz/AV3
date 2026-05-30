import { type Etapa } from "./etapaApi";

const API_URL = 'http://localhost:3000/api/funcionarios';

export interface Funcionario {
  codigo: string;
  nome: string;
  telefone: string;
  endereco: string;
  usuario: string;
  senha: string;
  nivelPermissao: 'Administrador' | 'Engenheiro' | 'Operário';
  etapas: Etapa[];
}

export const funcionarioApi = {
  listar: async (): Promise<Funcionario[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Erro ao buscar funcionarios do servidor');
    return response.json();
  },

  // Cadastrar um novo funcionário
  criar: async (novoFuncionario: Funcionario): Promise<Funcionario> => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(novoFuncionario),
    });

    if (!response.ok) {
      const erro = await response.json();
      throw new Error(erro.error || 'Erro ao criar funcionário');
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

  // Eliminar um funcionário
  deletar: async (codigo: string): Promise<void> => {
    const response = await fetch(`${API_URL}/${codigo}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao eliminar funcionário');
  }
};