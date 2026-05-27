import { useEffect, useState } from 'react'
import '../App.css'
import { useLocation, useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';
import Footer from '../components/Footer';
import NavigationComponent from '../components/Navigation';
import Icone from '../components/Icone';
import NovoTesteModal from '../components/novoTesteModal';
import { type Etapa, deletarAeronave } from '../data/mock_data';
import { useAuth } from '../contexts/AuthContext';

function AeronaveSelecionada() {

  const location = useLocation();
  const aeronave = location.state?.aeronave;
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { userPermission } = useAuth();

  const btnStyle = 'bg-primario font-sans rounded border border-white/10 p-2 px-4 cursor-pointer hover:scale-102 hover:shadow-xl'

  useEffect(() => {
    if (!userPermission || !aeronave) {
      navigate('/login', { replace: true });
    }
  }, [userPermission, aeronave, navigate]);

  if (!aeronave) return null;

  const pegarEtapaAtual = () => {
    for (let i = aeronave.etapas.length - 1; i >= 0; i--) {
      if (aeronave.etapas[i].status === "Em Andamento" || aeronave.etapas[i].status === "Pendente") {
        return aeronave.etapas[i];
      }
    }
    return null;
  };

  const handleEtapas = () => {
    navigate("/etapaSelecionada", { state: { aeronave: aeronave } });
  }

  const handleAbrirPecas = () => {
    navigate("/pecasAeronave", { state: { aeronave: aeronave } });
  }

  const handleDeletarAeronave = () => {
    deletarAeronave(aeronave.codigo);
    navigate("/dashboardAeronaves");
  }

  const textStyle = `font-mono text-default text-[1.3rem] truncate text-center hover:whitespace-normal hover:overflow-visible hover:text-clip"`
  const imgStyle = `scale-90 hover:scale-102 transition max-w-2/3 mb-auto`
  const containerStyle = `bg-superficie rounded border border-white/10 p-2 flex flex-col items-center`

  return (
    <div className="bg-fundo min-h-screen flex flex-col overflow-x-hidden">
        <Topbar/>
        <NavigationComponent openModal={() => {}}/>


        <div className='flex flex-1'>
            <div className='bg-superficie mx-8 my-6 rounded border border-white/10 p-8 w-4/5 flex flex-col'>

                <div className='grid grid-rows-1 grid-cols-5 gap-4'>
                    <div className={containerStyle}>
                        <h1 className={textStyle}>Código: {aeronave.codigo}</h1>
                        <div className={imgStyle}>
                            <Icone icone="Codigo"></Icone>
                        </div>
                    </div>

                    <div className={containerStyle}>
                        <h1 className={textStyle}>{aeronave.modelo}</h1>
                        <div className={imgStyle}>
                            <Icone icone="Modelo"></Icone>
                        </div>
                    </div>

                    <div className={containerStyle}>
                        <h1 className={textStyle}>{aeronave.tipo}</h1>
                        <div className={imgStyle}>
                            {aeronave.tipo === "Comercial" && <Icone icone={aeronave.tipo}></Icone>}
                            {aeronave.tipo === "Militar" && <Icone icone={aeronave.tipo}></Icone>}
                        </div>
                    </div>

                    <div className={containerStyle}>
                        <h1 className={textStyle}>Capacidade: {aeronave.capacidade}</h1>
                        <div className={imgStyle}>
                            <Icone icone="Capacidade"></Icone>
                        </div>
                    </div>

                    <div className={containerStyle}>
                        <h1 className={textStyle}>Alcance: {aeronave.alcance}</h1>
                        <div className={imgStyle}>
                            <Icone icone="Alcance"></Icone>
                        </div>
                    </div>
                </div>

                <div className='flex flex-1'>
                    <div className='mt-auto flex flex-1 gap-x-4 justify-end'>

                        <button className='bg-gray-600 font-sans rounded border border-white/10 p-2 px-4 cursor-pointer hover:scale-102 hover:shadow-xl'
                        onClick={() => navigate(-1)}
                        >
                        Voltar
                        </button>

                        <button className={btnStyle}
                        onClick={() => setIsModalOpen(true)}
                        >
                        Realizar Teste
                        </button>  

                        <button className={btnStyle}
                        onClick={handleAbrirPecas}
                        >
                        Visualizar Peças
                        </button>  

                        <button className={btnStyle}
                        >
                        Gerar Relatório
                        </button>  

                        {userPermission === 'Administrador' && (
                          <button className='bg-red-500 font-sans rounded border border-white/10 p-2 px-4 cursor-pointer hover:scale-102 hover:shadow-xl'
                          onClick={handleDeletarAeronave}
                          >
                          Deletar Aeronave
                          </button>
                        )}

                    </div>
              
                </div>

            </div>

            <div className='bg-superficie my-6 mr-8 rounded border border-white/10 p-8 flex flex-col w-1/5'>

                <div className='flex flex-col gap-y-4 align-center justify-center'>
                    {pegarEtapaAtual() != null ? 
                    <div className={containerStyle}>
                        <h1 className="font-mono text-default text-xl">Etapa Atual: </h1>
                        <h1 className="font-mono text-default text-xl">{pegarEtapaAtual().nome}</h1>
                    </div>
                     : 
                    <div className={containerStyle}>
                        <h1 className="font-mono text-default text-xl text-left">Nenhuma etapa em pendente ou em andamento</h1>
                    </div>
                    }
                    
                    {aeronave.etapas.length > 0 &&

                    <div className={containerStyle}>
                        <h1 className="font-mono text-default text-xl truncate hover:no-truncate">Últimas etapas: </h1>
                        {aeronave.etapas.map((etapa: Etapa, index: number) => (
                            etapa.status === "Concluída" && index < 5 &&
                                <h1 key={index} className="font-mono text-default text-xl">{etapa.nome}</h1>
                        ))}
                    </div>
                    }
                </div>

                    <div className="flex flex-1">
                        <div className='flex justify-end mt-auto w-full flex-1'>
                            <button className='bg-primario font-sans rounded border border-white/10 p-2 px-4 cursor-pointer hover:scale-102 hover:shadow-xl mt-auto'
                            onClick={handleEtapas}
                            >
                            Visualizar Etapas
                            </button> 
                        </div>

                    </div>


            </div>
            
        </div>

        <NovoTesteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}/>

        <Footer/>
    </div>
  )
}

export default AeronaveSelecionada