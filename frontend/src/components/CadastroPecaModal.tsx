import { useEffect, useState, type ChangeEvent, type SyntheticEvent } from 'react';
import '../App.css';
import { pecaApi, type Peca } from '../services/pecaApi';

export interface CadastroPecaProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (peca?: Peca) => void;
  peca?: Peca;
}

const initialPecaData: Peca = {
  nome: '',
  codigo: '',
  tipo: 'Nacional',
  fornecedor: '',
  status: 'Em produção'
};

function CadastroPecaModal({ isOpen, onClose, onSave, peca }: CadastroPecaProps) {
  
  const [pecaData, setPecaData] = useState<Peca>(initialPecaData);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (peca) {
      setPecaData(peca);
    } else {
      setPecaData(initialPecaData);
    }
  }, [peca]);
  
  if (!isOpen) return null;
  const isEdit = Boolean(peca);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPecaData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setPecaData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    event.preventDefault();
    setCarregando(true);

    try {
      if (isEdit && peca) {
        const { codigo: _, ...dadosAtualizados } = pecaData;
        await pecaApi.atualizar(peca.codigo, dadosAtualizados);
        onSave();
      } else {
        const pecaCriada = await pecaApi.criar(pecaData);
        onSave(pecaCriada); // Passar a peça retornada pelo servidor
      }
      onClose();
    } catch (error: any) {
      alert(`Falha ao salvar a peça: ${error.message}`);
    } finally {
      setCarregando(false);
    }
  };

  const inputCss = 'rounded bg-gray-300 p-2 pl-3 w-full font-sans text-gray-900 mb-2';

  return (
    <div className="bg-gray-950/60 fixed w-screen h-screen flex justify-center items-center z-50">
      <div className='bg-superficie m-8 w-1/4 h-auto flex flex-col justify-center border border-white/10 rounded'>
        <div className='mx-8 mt-6 mb-4'>
          <h1 className='font-mono text-3xl text-default text-center'>
            {isEdit ? 'Editar Peça' : 'Cadastrar Peça'}
          </h1>
        </div>

        <div className='mx-8'>
          <form onSubmit={handleSubmit} className='flex flex-col items-center'>
            <label htmlFor="nome" className="font-mono text-default self-start">
              Nome
            </label>
            <input
              id="nome"
              type="text"
              name="nome"
              placeholder="Nome"
              onChange={handleChange}
              required
              value={pecaData.nome}
              className={inputCss}
              disabled={carregando}
            />

            <label htmlFor="codigo" className="font-mono text-default self-start">
              Código
            </label>
            <input
              id="codigo"
              type="text"
              name="codigo"
              placeholder="Código"
              onChange={handleChange}
              required
              value={pecaData.codigo}
              className={inputCss}
              disabled={carregando || isEdit}
            />

            <label htmlFor="tipo" className="font-mono text-default self-start">
              Tipo
            </label>
            <select
              id="tipo"
              name="tipo"
              className={inputCss}
              required
              value={pecaData.tipo}
              onChange={handleSelectChange}
              disabled={carregando}
            >
              <option value="Nacional">Nacional</option>
              <option value="Importada">Importada</option>
            </select>

            <label htmlFor="fornecedor" className="font-mono text-default self-start">
              Fornecedor
            </label>
            <input
              id="fornecedor"
              type="text"
              name="fornecedor"
              placeholder="Fornecedor"
              onChange={handleChange}
              required
              value={pecaData.fornecedor}
              className={inputCss}
              disabled={carregando}
            />

            <label htmlFor="status" className="font-mono text-default self-start">
              Status
            </label>
            <select
              id="status"
              name="status"
              className={inputCss}
              required
              value={pecaData.status}
              onChange={handleSelectChange}
              disabled={carregando}
            >
              <option value="Em produção">Em Produção</option>
              <option value="Em transporte">Em Transporte</option>
              <option value="Pronta">Pronta</option>
            </select>

            <button
              className='bg-primario text-xl p-2 font-mono border border-white/10 rounded cursor-pointer hover:scale-102 hover:shadow-xl w-1/3 disabled:opacity-50 mb-1'
              type='submit'
              disabled={carregando}
            >
              {carregando ? 'Salvando...' : isEdit ? 'Salvar' : 'Cadastrar'}
            </button>
          </form>
        </div>

        <div className='mt-auto mr-auto m-8 flex gap-3'>
          <button
            className='bg-red-500  font-sans rounded p-2 hover:scale-102 hover:shadow-xl cursor-pointer disabled:opacity-50'
            onClick={onClose}
            disabled={carregando}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default CadastroPecaModal;