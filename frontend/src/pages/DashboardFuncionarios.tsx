import { useEffect, useState } from 'react'
import '../App.css'
import Topbar from '../components/Topbar';
import Footer from '../components/Footer';
import NavigationComponent from '../components/Navigation';
import { getFuncionarios, type Funcionario } from '../data/mock_data';
import CadastroFuncionarioModal from '../components/CadastroFuncionarioModal';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';


function DashboardFuncionarios() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>(getFuncionarios());
  const [selecionado, setSelecionado] = useState<Funcionario | null>(null);
  const [editingFuncionario, setEditingFuncionario] = useState<Funcionario | null>(null);

  const btnStyle = 'bg-primario font-sans rounded border border-white/10 p-2 px-4 cursor-pointer hover:scale-102 hover:shadow-xl'

  const { userPermission } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
      if (!userPermission || userPermission !== 'Administrador') {
        navigate('/login', { replace: true });
      }
    }, [userPermission, navigate, location.pathname]);


  const salvarFuncionario = (funcionario: Funcionario, isEdit: boolean) => {
    if (isEdit) {
      setFuncionarios(funcionarios.map(f => f.id === funcionario.id ? funcionario : f));
    } else {
      setFuncionarios([...funcionarios, funcionario]);
    }
  }

  const deletarFuncionario = (id: string) => {
    setFuncionarios(funcionarios.filter(f => f.id !== id));
  }

  const funcionarioKeys = ['id', 'nome', 'telefone', 'endereco', 'usuario', 'senha', 'nivelPermissao', 'editar'];
  const fieldLabels: Record<string, string> = {
    nivelPermissao: 'Cargo'
  };

  return (
    <div className="bg-fundo min-h-screen overflow-x-hidden flex flex-col">
        <Topbar/>
        <NavigationComponent openModal={() => {}}/>


        <div className='bg-superficie mx-8 my-6 rounded border border-white/10 p-8 flex-1 flex flex-col'>
            
          <div className='grid grid-cols-8 grid-rows-1 w-7/8 gap-x-8'>

            {funcionarioKeys.map((property: string, index: number) => 
            <div className='flex flex-col gap-y-4' key={index}>
              <h1 className='font-mono text-default text-2xl'>{fieldLabels[property] ?? (property.charAt(0).toUpperCase() + property.slice(1))}</h1>
              {funcionarios.map((funcionario: Funcionario, idx: number) => 
                  <div key={idx}>
                    {property === 'editar' ? (
                      <button className='mt-0.5 font-default bg-primario px-4 font-mono border border-white/10 rounded cursor-pointer' onClick={() => { setEditingFuncionario(funcionario); setIsModalOpen(true); }}>Editar</button>
                    ) : property != 'senha' ? (
                      <p className='font-mono text-default text-lg truncate hover:whitespace-normal hover:overflow-visible hover:text-clip'>

                        {funcionario[property as keyof Funcionario]}
                        </p>
                      ) : (
                      <p className='font-mono text-default text-lg truncate hover:whitespace-normal hover:overflow-visible hover:text-clip cursor-pointer'
                      onClick={() => selecionado != funcionario ? setSelecionado(funcionario) : setSelecionado(null)}
                      >

                        {selecionado == funcionario ? funcionario[property as keyof Funcionario] : "*********"}
                        </p>
                      
                    )}

                  </div>
              )}              
            </div>
            )}              

          </div>

          <div className='flex flex-1'>
              <div className='mt-auto flex flex-1 gap-x-4 justify-end'>
                  <button className={btnStyle}
                  onClick={() => setIsModalOpen(true)}
                  >
                  Cadastrar Funcionário
                  </button>  
              </div>
        
          </div>

        </div>
            
        <CadastroFuncionarioModal isOpen={isModalOpen} onSave={salvarFuncionario} onDelete={deletarFuncionario} onClose={() => { setIsModalOpen(false); setEditingFuncionario(null); }} funcionario={editingFuncionario ?? undefined}/>
        <Footer/>
    </div>
  )
}

export default DashboardFuncionarios