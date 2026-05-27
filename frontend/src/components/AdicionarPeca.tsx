import { useState, type ChangeEvent, type FormEvent, type FormEventHandler, type SyntheticEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import '../App.css'
import {getPecas, type Peca } from '../data/mock_data';

export interface AdicionarPecaProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (codigo: string) => void;
}

function AdicionarPecaModal({ isOpen, onClose, onSave }: AdicionarPecaProps) {
  if (!isOpen) return null;

  const location = useLocation();
  const aeronave = location.state?.aeronave;

  const pecasSemFiltro = getPecas()
  const pecas: Peca[] = pecasSemFiltro.filter(peca => !aeronave.pecas.includes(peca.codigo))
  
  if (pecas.length === 0) {
    onClose();
    return null;
  }

  const [pecaSelecionado, setPecaSelecionado] = useState<Peca>(pecas[0]);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const novoValor = event.target.value;
    setPecaSelecionado(pecas.find(peca => peca.codigo === novoValor) || pecaSelecionado);
  }

  const handleAdd = () => {
    onSave(pecaSelecionado.codigo);
    onClose();
  }

  const inputCss = 'rounded bg-gray-300 p-2 pl-3 w-full font-sans'

  return (
    <div className="bg-gray-950/60 fixed w-screen h-screen flex justify-center align-center items-center">
        
        <div className='bg-superficie w-1/4 h-1/4 flex flex-col justify-center align-center border border-white/10 rounded'>
            
            <div className=''>
                <h1 className='font-mono text-3xl text-default text-center'>Nova Peça</h1>
            </div>

            <div className='px-8'>
                <div className='flex flex-col items-center'>

                    <select name="peca" className={inputCss} required
                    value={pecaSelecionado.codigo} onChange={handleChange}> 
                        {pecas.map((peca: Peca, index: number) => 
                            <option key={index} value={peca.codigo}>{peca.nome} - {peca.fornecedor}</option>
                        )}
                    </select>

                </div>

                <div className='mt-2 flex flex-1 items-center justify-center'>
                  <button
                  className='bg-fundo-20 text-default text-xl p-2 font-mono border border-white/10 rounded cursor-pointer hover:scale-102 hover:shadow-xl w-1/3'
                  type='button'
                  onClick={onClose}
                  >Cancelar</button>

                  <button 
                  className='bg-primario ml-auto text-xl p-2 font-mono border border-white/10 rounded cursor-pointer hover:scale-102 hover:shadow-xl w-1/3'
                  type='button'
                  onClick={handleAdd}
                  >Adicionar</button>
                </div>

            </div>

        </div>

    </div>
  )
}

export default AdicionarPecaModal