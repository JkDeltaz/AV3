import { useState, useEffect, type ChangeEvent, type FormEvent, type FormEventHandler, type SyntheticEvent } from 'react'
import { useNavigate } from 'react-router-dom';
import '../App.css'
import { type Funcionario } from '../data/mock_data';

export interface CadastroFuncionarioProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (novaFuncionario: Funcionario, isEdit: boolean) => void;
  onDelete?: (id: string) => void;
  funcionario?: Funcionario;
}

function CadastroFuncionarioModal({ isOpen, onClose, onSave, onDelete, funcionario }: CadastroFuncionarioProps) {
  if (!isOpen) return null;

  const [funcionarioData, setFuncionarioData] = useState<Funcionario>({
    id: "",
    nome: "",
    telefone: "",
    usuario: "",
    senha: "",
    endereco: "",
    nivelPermissao: "Administrador"
  });

  useEffect(() => {
    if (funcionario) {
      setFuncionarioData(funcionario);
    } else {
      setFuncionarioData({
        id: "",
        nome: "",
        telefone: "",
        usuario: "",
        senha: "",
        endereco: "",
        nivelPermissao: "Administrador"
      });
    }
  }, [funcionario]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFuncionarioData((prev) => ({
        ...prev,
        [name]: value,
    }));
  };

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const {name, value} = event.target;

    setFuncionarioData((prev) => ({
        ...prev,
        [name]: value,
    }));
  }

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    event.preventDefault();
  
    const isEdit = !!funcionario;
    const updatedFuncionario: Funcionario = {
      id: isEdit ? (funcionarioData.id || funcionario.id) : funcionarioData.id,
      nome: isEdit ? (funcionarioData.nome || funcionario.nome) : funcionarioData.nome,
      telefone: isEdit ? (funcionarioData.telefone || funcionario.telefone) : funcionarioData.telefone,
      endereco: isEdit ? (funcionarioData.endereco || funcionario.endereco) : funcionarioData.endereco,
      usuario: isEdit ? (funcionarioData.usuario || funcionario.usuario) : funcionarioData.usuario,
      senha: isEdit ? (funcionarioData.senha || funcionario.senha) : funcionarioData.senha,
      nivelPermissao: isEdit ? (funcionarioData.nivelPermissao || funcionario.nivelPermissao) : funcionarioData.nivelPermissao
    };
  
    onSave(updatedFuncionario, isEdit);
  
    onClose();
  };

  const inputCss = 'rounded bg-gray-300 p-2 pl-3 w-full font-sans'

  return (
    <div className="bg-gray-950/60 fixed w-screen h-screen flex justify-center align-center items-center">
        
        <div className='bg-superficie m-8 w-1/2 h-3/5 flex flex-col justify-center align-center border border-white/10 rounded'>
            
            <div className='mx-8 mt-6 mb-4'>
                <h1 className='font-mono text-3xl text-default text-center'>{funcionario ? 'Editar' : 'Cadastrar'} Funcionario</h1>
            </div>

            <div className='mx-8'>
                <form onSubmit={handleSubmit}
                className='flex flex-col gap-5'>
                    
                    <div className='gap-4 grid grid-cols-2 grid-rows-4'>
                        <input type="text" name="nome" placeholder="Nome" onChange={handleChange} {...(!funcionario && { required: true })}
                        className={inputCss}>
                        </input>

                        <input type="text" name="id" placeholder="ID" onChange={handleChange} {...(!funcionario && { required: true })}
                        className={inputCss}>
                        </input>


                        <input type="text" name="telefone" placeholder="Telefone" onChange={handleChange} {...(!funcionario && { required: true })}
                        className={inputCss}>
                        </input>

                        <input type="text" name="endereco" placeholder="Endereço" onChange={handleChange} {...(!funcionario && { required: true })}
                        className={inputCss}>
                        </input>
                        
                        <input type="text" name="usuario" placeholder="Usuário" onChange={handleChange} {...(!funcionario && { required: true })}
                        className={inputCss}>
                        </input>

                        <input type="text" name="senha" placeholder="Senha" onChange={handleChange} {...(!funcionario && { required: true })}
                        className={inputCss}>
                        </input>

                        <select name="nivelPermissao" className={inputCss + " col-span-full"} {...(!funcionario && { required: true })}
                        value={funcionarioData.nivelPermissao} onChange={handleSelectChange}> 
                            <option value="Administrador">Administrador</option>
                            <option value="Engenheiro">Engenheiro</option>
                            <option value="Operador">Operador</option>
                        </select>
                    </div>


                    <button 
                    className='bg-primario text-xl mx-auto p-2 font-mono border border-white/10 rounded cursor-pointer hover:scale-102 hover:shadow-xl w-1/3'
                    type='submit'>{funcionario ? 'Salvar' : 'Cadastrar'}</button>

                </form>
            </div>


            <div className='mt-auto mr-auto m-8 flex gap-4'>
                {funcionario && onDelete && (
                    <button className='bg-red-500 font-sans rounded p-1.5 hover:scale-102 hover:shadow-xl cursor-pointer'
                    onClick={() => { onDelete(funcionario.id); onClose(); }}>
                        Deletar
                    </button>
                )}
                <button className='bg-red-500 font-sans rounded p-1.5 hover:scale-102 hover:shadow-xl cursor-pointer'
                onClick={onClose}>
                    Cancelar
                </button>
            </div>

        </div>

    </div>
  )
}

export default CadastroFuncionarioModal