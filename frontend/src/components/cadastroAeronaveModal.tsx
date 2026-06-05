import { useEffect, useState, type ChangeEvent, type SyntheticEvent } from 'react'
import '../App.css'
import { type Aeronave } from '../services/aeronaveApi';

export interface CadastroAeronaveProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (novaAeronave: Aeronave) => void;
  aeronave?: Aeronave;
}

function CadastroAeronaveModal({ isOpen, onClose, onSave, aeronave }: CadastroAeronaveProps) {
  const initialState: Aeronave = {
    codigo: '',
    modelo: '',
    tipo: 'Comercial',
    capacidade: 0,
    alcance: 0,
  };

  const [aeronaveData, setAeronaveData] = useState<Aeronave>(initialState);

  useEffect(() => {
    if (!isOpen) return;
    setAeronaveData(aeronave ?? initialState);
  }, [isOpen, aeronave]);

  if (!isOpen) return null;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const parsedValue = (name === 'capacidade' || name === 'alcance') ? Number(value) : value;

    setAeronaveData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const novoValor = event.target.value as 'Comercial' | 'Militar';

    setAeronaveData((prev) => ({
      ...prev,
      tipo: novoValor,
    }));
  }

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    event.preventDefault();

    onSave(aeronaveData);
    onClose();
  };

  const inputCss = 'rounded bg-gray-300 p-2 pl-3 w-full font-sans mb-2'
  const isEditMode = Boolean(aeronave);

  return (
    <div className="bg-gray-950/60 fixed w-screen h-screen flex justify-center align-center items-center">
      <div className='bg-superficie m-8 w-1/3 h-4/5 flex flex-col justify-center align-center border border-white/10 rounded'>
        <div className='mx-8 mt-6 mb-4'>
          <h1 className='font-mono text-3xl text-default text-center'>
            {isEditMode ? 'Editar Aeronave' : 'Cadastrar Aeronave'}
          </h1>
        </div>

        <div className='mx-8'>
          <form onSubmit={handleSubmit} className='flex flex-col items-center'>
            <label htmlFor="codigo" className="font-mono text-default self-start">
              Código
            </label>
            <input
              id="codigo"
              type="text"
              name="codigo"
              placeholder="Código"
              value={aeronaveData.codigo}
              onChange={handleChange}
              required
              className={inputCss}
              disabled={isEditMode}
            />
            <label htmlFor="modelo" className="font-mono text-default self-start">
              Modelo
            </label>
            <input
              id="modelo"
              type="text"
              name="modelo"
              placeholder="Modelo"
              value={aeronaveData.modelo}
              onChange={handleChange}
              required
              className={inputCss}
            />
            <label htmlFor="tipo" className="font-mono text-default self-start">
              Tipo
            </label>
            <select
              id="tipo"
              name="tipo"
              className={inputCss}
              required
              value={aeronaveData.tipo}
              onChange={handleSelectChange}
            >
              <option value="Comercial">Comercial</option>
              <option value="Militar">Militar</option>
            </select>
            <label htmlFor="capacidade" className="font-mono text-default self-start">
              Capacidade
            </label>
            <input
              id="capacidade"
              type="number"
              name="capacidade"
              placeholder="Capacidade"
              value={aeronaveData.capacidade}
              onChange={handleChange}
              required
              className={inputCss}
              min="1"
              onInput={(event) => {
                event.currentTarget.value = Math.abs(Number(event.currentTarget.value)).toString();
              }}
            />
            <label htmlFor="alcance" className="font-mono text-default self-start">
              Alcance
            </label>
            <input
              id="alcance"
              type="number"
              name="alcance"
              placeholder="Alcance"
              value={aeronaveData.alcance}
              onChange={handleChange}
              required
              className={inputCss}
              min="1"
              onInput={(event) => {
                event.currentTarget.value = Math.abs(Number(event.currentTarget.value)).toString();
              }}
            />
            <button
              className='bg-primario text-xl p-2 font-mono border border-white/10 rounded cursor-pointer hover:scale-102 hover:shadow-xl w-1/3'
              type='submit'
            >
              {isEditMode ? 'Salvar' : 'Cadastrar'}
            </button>
          </form>
        </div>

        <div className='mt-auto mr-auto m-8'>
          <button
            className='bg-red-500 font-sans rounded p-1.5 hover:scale-102 hover:shadow-xl cursor-pointer'
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}

export default CadastroAeronaveModal