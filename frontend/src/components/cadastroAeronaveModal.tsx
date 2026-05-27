import { useState, type ChangeEvent, type FormEvent, type FormEventHandler, type SyntheticEvent } from 'react'
import { useNavigate } from 'react-router-dom';
import '../App.css'
import { type Aeronave } from '../data/mock_data';

export interface CadastroAeronaveProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (novaAeronave: Aeronave) => void;
}

function CadastroAeronaveModal({ isOpen, onClose, onSave }: CadastroAeronaveProps) {
  if (!isOpen) return null;

  const [aeronaveData, setAeronaveData] = useState<Aeronave>({
    codigo: "",
    modelo: "",
    tipo: "Comercial",
    capacidade: 0,
    alcance: 0,
    etapas: [],
    pecas: [],
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setAeronaveData((prev) => ({
        ...prev,
        [name]: value,
    }));
  };

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const novoValor = event.target.value;

    setAeronaveData((prev) => ({
        ...prev,
        tipo: novoValor,
    }));
  }

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    event.preventDefault();
  
    onSave({
      ...aeronaveData,
      codigo: aeronaveData.codigo,
      modelo: aeronaveData.modelo,
      tipo: aeronaveData.tipo,
      capacidade: aeronaveData.capacidade,
      alcance: aeronaveData.alcance
    });
  
    onClose();
  };

  const inputCss = 'rounded bg-gray-300 p-2 pl-3 w-full font-sans'

  return (
    <div className="bg-gray-950/60 fixed w-screen h-screen flex justify-center align-center items-center">
        
        <div className='bg-superficie m-8 w-1/4 h-2/3 flex flex-col justify-center align-center border border-white/10 rounded'>
            
            <div className='mx-8 mt-6 mb-4'>
                <h1 className='font-mono text-3xl text-default text-center'>Cadastrar Aeronave</h1>
            </div>

            <div className='mx-8'>
                <form onSubmit={handleSubmit}
                className='gap-4 flex flex-col items-center'>

                    <input type="text" name="codigo" placeholder="Código" onChange={handleChange} required
                    className={inputCss}>
                    </input>

                    <input type="text" name="modelo" placeholder="Modelo" onChange={handleChange} required
                    className={inputCss}>
                    </input>


                    <select name="tipo" className={inputCss} required
                    value={aeronaveData.tipo} onChange={handleSelectChange}> 
                        <option value="Comercial">Comercial</option>
                        <option value="Militar">Militar</option>
                    </select>

                    <input type="number" name="capacidade" placeholder="Capacidade" onChange={handleChange}required
                    className={inputCss}>
                    </input>

                    <input type="number" name="alcance" placeholder="Alcance" onChange={handleChange} required
                    className={inputCss}>
                    </input>

                    <button 
                    className='bg-primario text-xl p-2 font-mono border border-white/10 rounded cursor-pointer hover:scale-102 hover:shadow-xl w-1/3'
                    type='submit'>Cadastrar</button>
                </form>
            </div>


            <div className='mt-auto mr-auto m-8'>
                <button className='bg-red-500 font-sans rounded p-1.5 hover:scale-102 hover:shadow-xl cursor-pointer'
                onClick={onClose}>
                    Cancelar
                </button>
            </div>

        </div>

    </div>
  )
}

export default CadastroAeronaveModal