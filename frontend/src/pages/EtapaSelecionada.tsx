import { useEffect, useState, type ChangeEvent } from 'react'
import '../App.css'
import { useLocation, useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';
import Footer from '../components/Footer';
import NavigationComponent from '../components/Navigation';
import Icone from '../components/Icone';
import NovoTesteModal from '../components/novoTesteModal';
import { type Aeronave, type Etapa } from '../data/mock_data';
import ListaFuncionariosModal from '../components/ListaFuncionariosModal';
import AdicionarFuncionarioModal from '../components/AdicionarFuncionario';
import IniciarEtapaModal from '../components/IniciarEtapaModal';
import { useAuth } from '../contexts/AuthContext';

function EtapaSelecionada() {

  const location = useLocation();
  const aeronave = location.state?.aeronave;
  const navigate = useNavigate();
  const [isListaModalOpen, setIsListaModalOpen] = useState(false);
  const [isFuncionarioModalOpen, setIsFuncionarioModalOpen] = useState(false);
  const [isEtapaModalOpen, setIsEtapaModalOpen] = useState(false);

  const { userPermission } = useAuth(); 
  
  const btnStyle = 'bg-primario font-sans rounded border border-white/10 p-2 px-4 cursor-pointer hover:scale-102 hover:shadow-xl'

  useEffect(() => {
    if (!userPermission || !aeronave) {
      navigate('/login', { replace: true });
    }
  }, [userPermission, aeronave, navigate]);

  if (!aeronave) return null;

  const [aeronaveState, setAeronave] = useState<Aeronave>(aeronave);
  const pegarEtapaAtual = () => {
    for (let i = aeronaveState.etapas.length - 1; i >= 0; i--) {
      if (aeronaveState.etapas[i].status === "Em Andamento" || aeronaveState.etapas[i].status === "Pendente") {
        return aeronaveState.etapas[i];
      }
    }
    return null;
  };
  const [etapaAtual, setEtapaAtual] = useState<Etapa | null>(pegarEtapaAtual());


  const adicionarEtapa = (novaEtapa: Etapa) => {
    aeronaveState.etapas.push(novaEtapa);
    setEtapaAtual(novaEtapa);
  }

  const adicionarFuncionarioAEtapa = (idFuncionario: string) => {
    const etapa = etapaAtual;
    if (etapa != null) {
      etapa.funcionarios.push(idFuncionario);
      setEtapaAtual({...etapa});
    }
  }

const avancarEtapa = () => {
  if (!etapaAtual) return;

  const novasEtapas = aeronaveState.etapas.map((e: Etapa) => {
    if (e.id === etapaAtual.id) {
      const novoStatus = e.status === "Pendente" ? "Em Andamento" : "Concluída";
      return { ...e, status: novoStatus };
    }
    return e;
  });

  const aeronaveAtualizada = {
    ...aeronaveState,
    etapas: novasEtapas
  };

  setAeronave(aeronaveAtualizada);

  const etapaEditada = novasEtapas.find((e: Etapa) => e.id === etapaAtual.id);
  if (etapaEditada) {
    setEtapaAtual(etapaEditada);
  }
};

  const textStyle = `font-mono text-default text-[1.3rem] truncate text-center hover:whitespace-normal hover:overflow-visible hover:text-clip"`
  const imgStyle = `scale-90 hover:scale-102 transition max-w-2/3 mb-auto`
  const containerStyle = `bg-superficie rounded border border-white/10 p-2 flex flex-col items-center`

  return (
    <div className="bg-fundo min-h-screen flex flex-col overflow-x-hidden">
        <Topbar/>
        <NavigationComponent openModal={() => {}}/>


        <div className='flex flex-1'>
            <div className='bg-superficie mx-8 my-6 rounded border border-white/10 p-8 flex flex-col flex-1'>

                <div className='flex'>
                    {etapaAtual != null ?
                    
                    <div className=''>
                        <h1 className='font-mono text-default text-2xl'>Etapa atual: {etapaAtual.nome}</h1>
                        <h1 className='font-mono text-default text-2xl'>ID: {etapaAtual.id}</h1>
                        <h1 className='font-mono text-default text-2xl'>Prazo: {etapaAtual.prazo} dias</h1>
                        <h1 className='font-mono text-default text-2xl'>Status: {etapaAtual.status}</h1>
                        
                    </div>      

                    :
                    
                    <div className=''>
                        <h1 className='font-mono text-default text-2xl'>Nenhuma etapa atualmente pendente ou em andamento.</h1>
                    </div>
                    
                    }

                    <div className='ml-auto w-1/3'>
                        {aeronaveState.etapas.length > 0 &&

                        <div className={containerStyle}>
                            <h1 className="font-mono text-default text-2xl truncate hover:no-truncate">Últimas etapas: </h1>
                            {aeronaveState.etapas.map((etapa: Etapa, index: number) => (
                                etapa.status === "Concluída" && index < 5 &&
                                    <h1 key={index} className="font-mono text-default text-xl">{etapa.nome} - {etapa.status}</h1>
                            ))}
                        </div>
                        }
                    </div>

                </div>


                <div className='flex mt-auto gap-x-4 justify-end'>

                    <button className='bg-gray-600 font-sans rounded border border-white/10 p-2 px-4 cursor-pointer hover:scale-102 hover:shadow-xl'
                    onClick={() => navigate(-1)}
                    >
                    Voltar
                    </button>

                    {etapaAtual != null && etapaAtual.status != "Concluída" ?
                        <div className='gap-x-4 flex'>
                          {userPermission != "Operador" && 
                            <button className={btnStyle}
                            onClick={() => setIsFuncionarioModalOpen(true)}
                            >
                            Adicionar Funcionário
                            </button>                              
                          }
                            <button className={btnStyle}
                            onClick={() => setIsListaModalOpen(true)}
                            >
                            Visualizar Funcionários
                            </button>  

     
                            <button className={btnStyle}
                            onClick={avancarEtapa}
                            >
                            Avançar Etapa
                            </button>                 
                        </div>
                    :
                        <button className={btnStyle}
                        onClick={() => setIsEtapaModalOpen(true)}
                        >
                            Iniciar Etapa
                        </button>                        
                    
                    }




                </div>

              
            </div>

        </div>

        <ListaFuncionariosModal isOpen={isListaModalOpen} onClose={()  => setIsListaModalOpen(false)} etapa={etapaAtual}/>
        <AdicionarFuncionarioModal isOpen={isFuncionarioModalOpen} onClose={() => setIsFuncionarioModalOpen(false)} etapa={etapaAtual} onSave={(idFuncionario) => adicionarFuncionarioAEtapa(idFuncionario)}/>
        <IniciarEtapaModal isOpen={isEtapaModalOpen} onClose={() => setIsEtapaModalOpen(false)} onSave={adicionarEtapa}/>

        <Footer/>
    </div>
  )
}

export default EtapaSelecionada