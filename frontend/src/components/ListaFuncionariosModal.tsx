import { useState, type ChangeEvent, type FormEvent, type FormEventHandler, type SyntheticEvent } from 'react'
import { useNavigate } from 'react-router-dom';
import '../App.css'
import { getFuncionarios, type Aeronave, type Etapa, type Funcionario } from '../data/mock_data';

export interface ListaFuncionariosProps {
  isOpen: boolean;
  onClose: () => void;
  etapa: Etapa | null;
}

function ListaFuncionariosModal({ isOpen, onClose, etapa }: ListaFuncionariosProps) {
  if (!isOpen) return null;

  const funcionariosSemFiltro = getFuncionarios();
  const funcionarios = etapa ? funcionariosSemFiltro.filter(funcionario => etapa.funcionarios.includes(funcionario.id)) : [];

  const inputCss = 'rounded bg-gray-300 p-2 pl-3 w-full font-sans'

  return (
    <div className="bg-gray-950/60 fixed w-screen h-screen flex justify-center align-center items-center">
        
        <div className='bg-superficie m-8 w-2/5 h-2/3 flex flex-col justify-center align-center border border-white/10 rounded'>
            
            <div className='mx-8 mt-6 mb-4'>
                <h1 className='font-mono text-3xl text-default text-center'>Lista de Funcionários</h1>
            </div>

            <div className='grid grid-rows-1 grid-cols-3 p-8 gap-x-4'>
                <div className='bg-fundo/20 border rounded p-2'>
                    <h1 className='font-mono text-2xl text-default'>
                        Nome
                    </h1>

                    {funcionarios.map((funcionario: Funcionario, index: number) => 
                        <div>
                            <p className='font-mono text-default text-lg'>{funcionario.nome}</p>
                        </div>
                    )}
                </div>
                <div className='bg-fundo/20 border rounded p-2'>
                    <h1 className='font-mono text-2xl text-default'>
                        ID
                    </h1>

                    {funcionarios.map((funcionario: Funcionario, index: number) => 
                        <div>
                            <p className='font-mono text-default text-lg'>{funcionario.id}</p>
                        </div>
                    )}
                </div>
                {/* A Dream, I Saw a Dream */}
                <div className='bg-fundo/20 border rounded p-2'>
                    <h1 className='font-mono text-2xl text-default'>
                        Cargo
                    </h1>

                    {funcionarios.map((funcionario: Funcionario, index: number) => 
                        <div>
                            <p className='font-mono text-default text-lg'>{funcionario.nivelPermissao}</p>
                        </div>
                    )}
                </div>


            </div>


            <div className='mt-auto mr-auto m-8'>
                <button className='bg-red-500 font-sans rounded p-1.5 hover:scale-102 hover:shadow-xl cursor-pointer'
                onClick={onClose}>
                    Voltar
                </button>
            </div>

        </div>

    </div>
  )
}

export default ListaFuncionariosModal