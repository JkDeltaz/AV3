import { useEffect, useState } from 'react'
import '../App.css'
import Topbar from '../components/Topbar';
import Footer from '../components/Footer';
import NavigationComponent from '../components/Navigation';
import { funcionarioApi, type Funcionario } from '../services/funcionarioApi';
import CadastroFuncionarioModal from '../components/CadastroFuncionarioModal';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';


function DashboardFuncionarios() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
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

  useEffect(() => {
    funcionarioApi.listar().then(setFuncionarios).catch(() => setFuncionarios([]));
  }, []);


  const salvarFuncionario = async (funcionario: Funcionario, isEdit: boolean) => {
    if (isEdit) {
      try {
        const atualizado = await funcionarioApi.atualizar(funcionario.codigo, funcionario as any);
        setFuncionarios(funcionarios.map(f => f.codigo === atualizado.codigo ? atualizado : f));
      } catch (err) {
        console.error('Erro ao atualizar funcionário', err);
      }
    } else {
      try {
        const criado = await funcionarioApi.criar(funcionario as any);
        setFuncionarios([...funcionarios, criado]);
      } catch (err) {
        console.error('Erro ao criar funcionário', err);
      }
    }
  }

  const deletarFuncionario = async (codigo: string) => {
    try {
      await funcionarioApi.deletar(codigo);
      setFuncionarios(funcionarios.filter(f => f.codigo !== codigo));
    } catch (err) {
      console.error('Erro ao deletar funcionário', err);
    }
  }

  const funcionarioKeys = ['codigo', 'nome', 'telefone', 'endereco', 'usuario', 'senha', 'nivelPermissao', 'editar'];
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