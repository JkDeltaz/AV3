import { useEffect, useState, type ChangeEvent } from 'react'
import '../App.css'
import { useLocation, useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';
import Footer from '../components/Footer';
import NavigationComponent from '../components/Navigation';
import { adicionarPecaAAeronave, getPecas, type Peca } from '../data/mock_data';
import CadastroPecaModal from '../components/CadastroPecaModal';
import AdicionarPecaModal from '../components/AdicionarPeca';
import { useAuth } from '../contexts/AuthContext';


function PecasAeronave() {

  const [selecionado, setSelecionado] = useState(0);
  const [isCadastroOpen, setIsCadastroOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  
  const { userPermission } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const aeronave = location.state?.aeronave;

  useEffect(() => {
    if (!userPermission || !aeronave) {
      navigate('/login', { replace: true });
    }
  }, [userPermission, aeronave, navigate]);

  if (!aeronave) return null;

  const [aeronaveState, setAeronave] = useState(aeronave);

  let pecasFiltradas = getPecas().filter(peca => aeronave.pecas.includes(peca.codigo))

  const [pecas, setPecas] = useState<Peca[]>(pecasFiltradas);

  const btnStyle = 'bg-primario font-sans rounded border border-white/10 p-2 px-4 cursor-pointer hover:scale-102 hover:shadow-xl'
  
  const salvarPeca = (peca: Peca) => {
    setPecas([...pecas, peca])
    setAeronave({...aeronaveState, pecas: [...aeronaveState.pecas, peca.codigo]})
    }

const adicionarPeca = (codigo: string) => {
  const peca = getPecas().find(p => p.codigo === codigo);

  if (peca) {
    const novasPecasIds = [...aeronaveState.pecas, peca.codigo];

    const aeronaveAtualizada = {
      ...aeronaveState,
      pecas: novasPecasIds
    };

    setPecas([...pecas, peca]);
    setAeronave(aeronaveAtualizada);

    navigate("/pecasAeronave", { state: { aeronave: aeronaveAtualizada } });
  }
};

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

          <div className='ml-auto flex flex-1 w-1/8'>
              <div className='mt-auto ml-auto flex flex-col flex-1 gap-4'>
                  <button className='bg-gray-600 font-sans rounded border border-white/10 p-2 px-4 cursor-pointer hover:scale-102 hover:shadow-xl'
                  onClick={() => navigate(-1)}
                  >
                  Voltar
                  </button>

                  <button className={btnStyle}
                  onClick={() => setIsCadastroOpen(true)}
                  >
                  Cadastrar Peça
                  </button>  

                  <button className={btnStyle}
                  onClick={() => setIsAddOpen(true)}
                  >
                  Adicionar Peça
                  </button>  
              </div>
        
          </div>

        </div>
            
        <CadastroPecaModal isOpen={isCadastroOpen} onSave={salvarPeca} onClose={() => setIsCadastroOpen(false)}/>
        <AdicionarPecaModal isOpen={isAddOpen} onSave={adicionarPeca} onClose={() => setIsAddOpen(false)}/>
        <Footer/>
    </div>
  )
}

export default PecasAeronave