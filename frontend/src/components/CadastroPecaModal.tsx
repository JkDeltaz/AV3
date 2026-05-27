import { useState, type ChangeEvent, type FormEvent, type FormEventHandler, type SyntheticEvent } from 'react'
import { useNavigate } from 'react-router-dom';
import '../App.css'
import { type Peca } from '../data/mock_data';

export interface CadastroPecaProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (novaPeca: Peca) => void;
}

function CadastroPecaModal({ isOpen, onClose, onSave }: CadastroPecaProps) {
  if (!isOpen) return null;

  const [pecaData, setPecaData] = useState<Peca>({
    nome: "",
    codigo: "",
    tipo: "Nacional",
    fornecedor: "",
    status: "Em Produção"
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setPecaData((prev) => ({
        ...prev,
        [name]: value,
    }));
  };

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const {name, value} = event.target;

    setPecaData((prev) => ({
        ...prev,
        [name]: value,
    }));
  }

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    event.preventDefault();
  
    onSave({
      ...pecaData,
      nome: pecaData.nome,
      codigo: pecaData.codigo,
      tipo: pecaData.tipo,
      fornecedor: pecaData.fornecedor,
      status: pecaData.status
    });
  
    onClose();
  };

  const inputCss = 'rounded bg-gray-300 p-2 pl-3 w-full font-sans'

  return (
    <div className="bg-gray-950/60 fixed w-screen h-screen flex justify-center align-center items-center">
        
        <div className='bg-superficie m-8 w-1/4 h-2/3 flex flex-col justify-center align-center border border-white/10 rounded'>
            
            <div className='mx-8 mt-6 mb-4'>
                <h1 className='font-mono text-3xl text-default text-center'>Cadastrar Peca</h1>
            </div>

            <div className='mx-8'>
                <form onSubmit={handleSubmit}
                className='gap-4 flex flex-col items-center'>

                    <input type="text" name="nome" placeholder="Nome" onChange={handleChange} required
                    className={inputCss}>
                    </input>

                    <input type="text" name="codigo" placeholder="Código" onChange={handleChange} required
                    className={inputCss}>
                    </input>


                    <select name="tipo" className={inputCss} required
                    value={pecaData.tipo} onChange={handleSelectChange}> 
                        <option value="Nacional">Nacional</option>
                        <option value="Importada">Importada</option>
                    </select>

                    <input type="text" name="fornecedor" placeholder="Fornecedor" onChange={handleChange}required
                    className={inputCss}>
                    </input>

                    <select name="status" className={inputCss} required
                    value={pecaData.status} onChange={handleSelectChange}> 
                        <option value="Em Produção">Em Produção</option>
                        <option value="Em Transporte">Em Transporte</option>
                        <option value="Pronta">Pronta</option>
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

export default CadastroPecaModal