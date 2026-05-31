import { useEffect, useState } from 'react'
import '../App.css'
import { useLocation, useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';
import Footer from '../components/Footer';
import NavigationComponent from '../components/Navigation';
import { aeronaveApi, type Aeronave } from '../services/aeronaveApi';
import { etapaApi, type Etapa } from '../services/etapaApi';
import ListaFuncionariosModal from '../components/ListaFuncionariosModal';
import AdicionarFuncionarioModal from '../components/AdicionarFuncionario';
import IniciarEtapaModal from '../components/IniciarEtapaModal';
import { useAuth } from '../contexts/AuthContext';

function EtapaSelecionada() {

  const location = useLocation();
  const aeronaveParam = location.state?.aeronave;
  const navigate = useNavigate();
  const [isListaModalOpen, setIsListaModalOpen] = useState(false);
  const [isFuncionarioModalOpen, setIsFuncionarioModalOpen] = useState(false);
  const [isEtapaModalOpen, setIsEtapaModalOpen] = useState(false);
  const [aeronave, setAeronave] = useState<Aeronave | null>(aeronaveParam ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { userPermission } = useAuth(); 
  
  const btnStyle = 'bg-primario font-sans rounded border border-white/10 p-2 px-4 cursor-pointer hover:scale-102 hover:shadow-xl'

  const carregarAeronave = async () => {
    if (!aeronaveParam?.codigo) return;
    try {
      setLoading(true);
      setError('');
      const dados = await aeronaveApi.buscarPorCodigo(aeronaveParam.codigo);
      setAeronave(dados);
    } catch (err: any) {
      setError(err?.message ?? 'Erro ao carregar aeronave');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (!userPermission) {
      navigate('/login', { replace: true });
      return;
    }
    if (aeronaveParam?.codigo) {
      carregarAeronave();
    }
  }, [userPermission, aeronaveParam, navigate]);

  useEffect(() => {
    if (!aeronave) return;
    const etapaAtualCarregada = aeronave.etapas?.slice().reverse().find((etapa) => etapa.status === 'Em andamento' || etapa.status === 'Pendente') ?? null;
    setEtapaAtual(etapaAtualCarregada);
  }, [aeronave]);

  if (!aeronave) return null;

  const pegarEtapaAtual = () => {
    if (!aeronave.etapas) return null;
    for (let i = aeronave.etapas.length - 1; i >= 0; i--) {
      if (aeronave.etapas[i].status === "Em andamento" || aeronave.etapas[i].status === "Pendente") {
        return aeronave.etapas[i];
      }
    }
    return null;
  };
  const [etapaAtual, setEtapaAtual] = useState<Etapa | null>(pegarEtapaAtual());

  const adicionarFuncionarioAEtapa = async (codigoFuncionario: string) => {
    if (!etapaAtual) return;

    try {
      setLoading(true);
      await etapaApi.adicionarFuncionario(etapaAtual.codigo, codigoFuncionario);
      await carregarAeronave();
    } catch (err: any) {
      setError(err?.message ?? 'Erro ao adicionar funcionário');
    } finally {
      setLoading(false);
    }
  }

  const avancarEtapa = async () => {
    if (!etapaAtual) return;

    try {
      setLoading(true);
      const novoStatus = etapaAtual.status === "Pendente" ? "Em andamento" : "Concluída";
      await etapaApi.atualizar(etapaAtual.codigo, {
        nome: etapaAtual.nome,
        prazo: etapaAtual.prazo,
        status: novoStatus,
      });
      await carregarAeronave();
    } catch (err: any) {
      setError(err?.message ?? 'Erro ao avançar etapa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-fundo min-h-screen flex flex-col overflow-x-hidden">
        <Topbar/>
        <NavigationComponent openModal={() => {}}/>

        <div className='flex flex-1'>
            <div className='bg-superficie mx-8 my-6 rounded border border-white/10 p-8 flex flex-col flex-1'>

                {loading && <div className='text-default mb-4'>Carregando...</div>}
                {error && <div className='text-red-500 mb-4'>{error}</div>}

                <div className='flex'>
                    {etapaAtual != null ?
                    
                    <div className=''>
                        <h1 className='font-mono text-default text-2xl'>Etapa atual: {etapaAtual.nome}</h1>
                        <h1 className='font-mono text-default text-2xl'>Código: {etapaAtual.codigo}</h1>
                        <h1 className='font-mono text-default text-2xl'>Prazo: {etapaAtual.prazo} dias</h1>
                        <h1 className='font-mono text-default text-2xl'>Status: {etapaAtual.status}</h1>
                        
                    </div>      

                    :
                    
                    <div className=''>
                        <h1 className='font-mono text-default text-2xl'>Nenhuma etapa atualmente pendente ou em andamento.</h1>
                    </div>
                    
                    }

                    <div className='ml-auto w-1/3'>
                        {aeronave.etapas && aeronave.etapas.length > 0 &&

                        <div className={`bg-superficie rounded border border-white/10 p-2 flex flex-col items-center`}>
                            <h1 className="font-mono text-default text-2xl truncate hover:no-truncate">Últimas etapas: </h1>
                            {aeronave.etapas.map((etapa: Etapa, index: number) => (
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
        <IniciarEtapaModal isOpen={isEtapaModalOpen} onClose={() => setIsEtapaModalOpen(false)} onSave={carregarAeronave} aeronaveId={aeronave.id ?? 0} />

        <Footer/>
    </div>
  )
}

export default EtapaSelecionada