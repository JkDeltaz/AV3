import { useState, type ChangeEvent, type FormEvent, type FormEventHandler, type SyntheticEvent } from 'react'
import { useNavigate } from 'react-router-dom';
import '../App.css'
import { type Aeronave } from '../data/mock_data';

export interface novoTesteProps {
  isOpen: boolean;
  onClose: () => void;
}

function NovoTesteModal({ isOpen, onClose }: novoTesteProps) {
  if (!isOpen) return null;

  const [selectedTest, setSelectedTest] = useState<string>("Elétrico");

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const novoValor = event.target.value;
    setSelectedTest(novoValor);
  }

  const inputCss = 'rounded bg-gray-300 p-2 pl-3 w-full font-sans'

  return (
    <div className="bg-gray-950/60 fixed w-screen h-screen flex justify-center align-center items-center">
        
        <div className='bg-superficie w-1/4 h-1/4 flex flex-col justify-center align-center border border-white/10 rounded'>
            
            <div className=''>
                <h1 className='font-mono text-3xl text-default text-center'>Novo Teste</h1>
            </div>

            <div className='px-8'>
                <form
                className='flex flex-col items-center'>

                    <select name="tipo" className={inputCss} required
                    value={selectedTest} onChange={handleChange}> 
                        <option value="Elétrico">Elétrico</option>
                        <option value="Hidráulico">Hidráulico</option>
                        <option value="Aerodinâmico">Aerodinâmico</option>
                    </select>

                </form>

                <div className='mt-2 flex flex-1 items-center justify-center'>
                  <button
                  className='bg-fundo-20 text-default text-xl p-2 font-mono border border-white/10 rounded cursor-pointer hover:scale-102 hover:shadow-xl w-1/3'
                  type='submit'
                  onClick={onClose}
                  >Recusado</button>

                  <button 
                  className='bg-primario ml-auto text-xl p-2 font-mono border border-white/10 rounded cursor-pointer hover:scale-102 hover:shadow-xl w-1/3'
                  type='submit'
                  onClick={onClose}
                  >Aprovado</button>
                </div>
            </div>

        </div>

    </div>
  )
}

export default NovoTesteModal