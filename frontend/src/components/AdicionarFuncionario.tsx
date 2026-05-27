import { useState, type ChangeEvent, type FormEvent, type FormEventHandler, type SyntheticEvent } from 'react'
import { useNavigate } from 'react-router-dom';
import '../App.css'
import type { ListaFuncionariosProps } from './ListaFuncionariosModal';
import { adicionarFuncionarioAEtapa, getFuncionarios, type Etapa, type Funcionario } from '../data/mock_data';

export interface AdicionarFuncionariosProps {
  isOpen: boolean;
  onClose: () => void;
  etapa: Etapa | null;
  onSave: (idFuncionario: string) => void;
}

function AdicionarFuncionarioModal({ isOpen, onClose, etapa, onSave }: AdicionarFuncionariosProps) {
  if (!isOpen) return null;

  const funcionariosSemFiltro = getFuncionarios()
  const funcionarios: Funcionario[] = funcionariosSemFiltro.filter(funcionario => !etapa?.funcionarios.includes(funcionario.id))
  
  if (funcionarios.length === 0) {
    onClose();
    return null;
  }

  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState<Funcionario>(funcionarios[0]);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const novoValor = event.target.value;
    setFuncionarioSelecionado(funcionarios.find(f => f.id === novoValor) || funcionarioSelecionado);
  }

  const handleAdd = () => {
    onSave(funcionarioSelecionado.id);
    onClose();
  }

  const inputCss = 'rounded bg-gray-300 p-2 pl-3 w-full font-sans'

  return (
    <div className="bg-gray-950/60 fixed w-screen h-screen flex justify-center align-center items-center">
        
        <div className='bg-superficie w-1/4 h-1/4 flex flex-col justify-center align-center border border-white/10 rounded'>
            
            <div className=''>
                <h1 className='font-mono text-3xl text-default text-center'>Novo Funcionário</h1>
            </div>

            <div className='px-8'>
                <div className='flex flex-col items-center'>

                    <select name="funcionario" className={inputCss} required
                    value={funcionarioSelecionado.id} onChange={handleChange}> 
                        {funcionarios.map((funcionario: Funcionario, index: number) => 
                            <option key={index} value={funcionario.id}>{funcionario.nome} - {funcionario.nivelPermissao}</option>
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

export default AdicionarFuncionarioModal