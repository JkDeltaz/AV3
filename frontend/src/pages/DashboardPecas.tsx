import { useEffect, useState, type ChangeEvent } from 'react'
import '../App.css'
import { useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';
import Footer from '../components/Footer';
import NavigationComponent from '../components/Navigation';
import { getPecas, type Peca } from '../data/mock_data';
import CadastroPecaModal from '../components/CadastroPecaModal';
import { useAuth } from '../contexts/AuthContext';


function DashboardPecas() {

  const { userPermission } = useAuth();
  const navigate = useNavigate();

  const [selecionado, setSelecionado] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [pecas, setPecas] = useState<Peca[]>(getPecas());

  useEffect(() => {
    if (!userPermission) {
      navigate('/login', { replace: true });
    }
  }, [userPermission, navigate]);

  const btnStyle = 'bg-primario font-sans rounded border border-white/10 p-2 px-4 cursor-pointer hover:scale-102 hover:shadow-xl'
  
  const salvarPeca = (peca: Peca) => {
    setPecas([...pecas, peca])
  }

  return (
    <div className="bg-fundo min-h-screen overflow-x-hidden flex flex-col">
        <Topbar/>
        <NavigationComponent openModal={() => {}}/>


        <div className='bg-superficie mx-8 my-6 rounded border border-white/10 p-8 flex-1 flex flex-col'>
            
          <div className='grid grid-cols-5 grid-rows-1 w-7/8'>
            <div className='flex flex-col gap-y-4'>
              <h1 className='font-mono text-default text-2xl'>Nome</h1>
              {pecas.map((peca: Peca, index: number) => 
                  <div>
                      <p className='font-mono text-default text-lg'>{peca.nome}</p>
                  </div>
              )}              
            </div>

            <div className='flex flex-col gap-y-4'>
              <h1 className='font-mono text-default text-2xl'>Código</h1>
              {pecas.map((peca: Peca, index: number) => 
                  <div>
                      <p className='font-mono text-default text-lg'>{peca.codigo}</p>
                  </div>
              )}              
            </div>

            <div className='flex flex-col gap-y-4'>
              <h1 className='font-mono text-default text-2xl'>Fornecedor</h1>
              {pecas.map((peca: Peca, index: number) => 
                  <div>
                      <p className='font-mono text-default text-lg'>{peca.fornecedor}</p>
                  </div>
              )}              
            </div>

            <div className='flex flex-col gap-y-4'>
              <h1 className='font-mono text-default text-2xl'>Tipo</h1>
              {pecas.map((peca: Peca, index: number) => 
                  <div>
                      <p className='font-mono text-default text-lg'>{peca.tipo}</p>
                  </div>
              )}              
            </div>

            <div className='flex flex-col gap-y-4'>
              <h1 className='font-mono text-default text-2xl'>Status</h1>
              {pecas.map((peca: Peca, index: number) => 
                  <div>
                      <p className='font-mono text-default text-lg'>{peca.status}</p>
                  </div>
              )}              
            </div>



          </div>

          <div className='flex flex-1'>
              <div className='mt-auto flex flex-1 gap-x-4 justify-end'>
                  <button className={btnStyle}
                  onClick={() => setIsModalOpen(true)}
                  >
                  Cadastrar Peça
                  </button>  
              </div>
        
          </div>

        </div>
            
        <CadastroPecaModal isOpen={isModalOpen} onSave={salvarPeca} onClose={() => setIsModalOpen(false)}/>
        <Footer/>
    </div>
  )
}

export default DashboardPecas