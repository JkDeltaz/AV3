import { useState, type ChangeEvent, type FormEvent, type FormEventHandler, type SyntheticEvent } from 'react'
import { useNavigate } from 'react-router-dom';
import '../App.css'
import { type Aeronave, type Etapa } from '../data/mock_data';

export interface IniciarEtapaProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (novaEtapa: Etapa) => void;
}

function IniciarEtapaModal({ isOpen, onClose, onSave }: IniciarEtapaProps) {
  if (!isOpen) return null;

  const [etapaData, setEtapaData] = useState<Etapa>({
    id: "",
    nome: "",
    prazo: 0,
    status: "Pendente",
    funcionarios: []
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setEtapaData((prev) => ({
        ...prev,
        [name]: value,
    }));
  };

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const novoValor = event.target.value;

    setEtapaData((prev) => ({
        ...prev,
        status: novoValor,
    }));
  }

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    event.preventDefault();
  
    onSave({
      ...etapaData
    });
    
    onClose();
  };

  const inputCss = 'rounded bg-gray-300 p-2 pl-3 w-full font-sans'

  return (
    <div className="bg-gray-950/60 fixed w-screen h-screen flex justify-center align-center items-center">
        
        <div className='bg-superficie m-8 w-1/4 h-2/4 flex flex-col justify-center align-center border border-white/10 rounded'>
            
            <div className='mx-8 mt-6 mb-4'>
                <h1 className='font-mono text-3xl text-default text-center'>Iniciar Etapa</h1>
            </div>

            <div className='mx-8'>
                <form onSubmit={handleSubmit}
                className='gap-4 flex flex-col items-center'>

                    <input type="text" name="nome" placeholder="Nome" onChange={handleChange} required
                    className={inputCss}>
                    </input>

                    <input type="number" name="prazo" placeholder="Prazo (Dias)" onChange={handleChange} required
                    className={inputCss}>
                    </input>

                    <select name="status" className={inputCss} required
                    value={etapaData.status} onChange={handleSelectChange}> 
                        <option value="Pendente">Pendente</option>
                        <option value="Em Andamento">Em Andamento</option>
                        <option value="Concluída">Concluída</option>
                    </select>


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

export default IniciarEtapaModal