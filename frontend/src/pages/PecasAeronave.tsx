import { useEffect, useState } from 'react'
import '../App.css'
import { useLocation, useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';
import Footer from '../components/Footer';
import NavigationComponent from '../components/Navigation';
import { pecaApi, type Peca } from '../services/pecaApi';
import { aeronaveApi } from '../services/aeronaveApi';
import CadastroPecaModal from '../components/CadastroPecaModal';
import AdicionarPecaModal from '../components/AdicionarPeca';
import { useAuth } from '../contexts/AuthContext';


function PecasAeronave() {

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
  const [todasPecas, setTodasPecas] = useState<Peca[]>([]);
  const [pecas, setPecas] = useState<Peca[]>([]);

  useEffect(() => {
    // Sincronizar aeronave com o backend ao carregar
    aeronaveApi.buscarPorCodigo(aeronave.codigo)
      .then(setAeronave)
      .catch(() => console.error('Erro ao sincronizar aeronave'));
  }, []);

  useEffect(() => {
    // carregar lista completa de peças do backend
    pecaApi.listar().then(lista => setTodasPecas(lista)).catch(() => setTodasPecas([]));
  }, []);

  useEffect(() => {
    // Filtrar peças que pertencem à aeronave atual
    const pecasAeronave = aeronaveState.pecas || [];
    const pecasCodigos = Array.isArray(pecasAeronave) && pecasAeronave.length > 0 && typeof pecasAeronave[0] === 'object' 
      ? pecasAeronave.map(p => p.codigo) 
      : pecasAeronave;
    setPecas(todasPecas.filter(peca => pecasCodigos.includes(peca.codigo)));
  }, [todasPecas, aeronaveState]);

  const btnStyle = 'bg-primario font-sans rounded border border-white/10 p-2 px-4 cursor-pointer hover:scale-102 hover:shadow-xl'
  
  const salvarPeca = (pecaCriada?: Peca) => {
    if (pecaCriada) {
      // Se uma peça foi criada, adicionar à aeronave atualmente selecionada
      adicionarPeca(pecaCriada.codigo);
    } else {
      // Apenas recarregar a lista se nenhuma peça foi criada (edição)
      pecaApi.listar().then(lista => setTodasPecas(lista)).catch(() => setTodasPecas([]));
    }
  }
  
  const adicionarPeca = (pecaCodigo: string) => {
    // Adicionar peça à aeronave via API
    aeronaveApi.adicionarPeca(aeronaveState.codigo, pecaCodigo)
      .then(() => {
        // Recarregar lista completa de peças do backend para incluir novas peças criadas
        return pecaApi.listar();
      })
      .then((listaAtualizada) => {
        setTodasPecas(listaAtualizada);
        // Buscar aeronave atualizada para sincronizar state
        return aeronaveApi.buscarPorCodigo(aeronaveState.codigo);
      })
      .then((aeronaveAtualizada) => {
        setAeronave(aeronaveAtualizada);
        setIsAddOpen(false);
        setIsCadastroOpen(false);
      })
      .catch((err) => alert('Erro ao adicionar peça: ' + err.message))
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
                  <div key={`nome-${index}`}>
                      <p className='font-mono text-default text-lg'>{peca?.nome}</p>
                  </div>
              )}              
            </div>

            <div className='flex flex-col gap-y-4'>
              <h1 className='font-mono text-default text-2xl'>Código</h1>
              {pecas.map((peca: Peca, index: number) => 
                  <div key={`codigo-${index}`}>
                      <p className='font-mono text-default text-lg'>{peca?.codigo}</p>
                  </div>
              )}              
            </div>

            <div className='flex flex-col gap-y-4'>
              <h1 className='font-mono text-default text-2xl'>Fornecedor</h1>
              {pecas.map((peca: Peca, index: number) => 
                  <div key={`fornecedor-${index}`}>
                      <p className='font-mono text-default text-lg'>{peca?.fornecedor}</p>
                  </div>
              )}              
            </div>

            <div className='flex flex-col gap-y-4'>
              <h1 className='font-mono text-default text-2xl'>Tipo</h1>
              {pecas.map((peca: Peca, index: number) => 
                  <div key={`tipo-${index}`}>
                      <p className='font-mono text-default text-lg'>{peca?.tipo}</p>
                  </div>
              )}              
            </div>

            <div className='flex flex-col gap-y-4'>
              <h1 className='font-mono text-default text-2xl'>Status</h1>
              {pecas.map((peca: Peca, index: number) => 
                  <div key={`status-${index}`}>
                      <p className='font-mono text-default text-lg'>{peca?.status}</p>
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