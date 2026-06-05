import { useEffect, useState } from 'react'
import '../App.css'
import { useLocation, useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';
import Footer from '../components/Footer';
import NavigationComponent from '../components/Navigation';
import Icone from '../components/Icone';
import NovoTesteModal from '../components/novoTesteModal';
import { aeronaveApi, type Aeronave } from '../services/aeronaveApi';
import { type Etapa } from '../services/etapaApi';
import { useAuth } from '../contexts/AuthContext';

function AeronaveSelecionada() {

  const location = useLocation();
  const aeronaveParam = location.state?.aeronave;
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  if (!userPermission || !aeronave) return null;
  if (loading) return <div className='text-white'>Carregando...</div>;
  if (error) return <div className='text-red-500'>Erro: {error}</div>;


  const pegarEtapaAtual = () => {

    if (aeronave.etapas && aeronave.etapas.length > 0) {
      for (let i = aeronave.etapas.length - 1; i >= 0; i--) {
        if (aeronave.etapas[i].status === "Em andamento" || aeronave.etapas[i].status === "Pendente") {
          return aeronave.etapas[i];
        }
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

  const handleGerarRelatorio = () => {
    if (!aeronave) return;

    const formatEtapas = () => {
      if (!aeronave.etapas || aeronave.etapas.length === 0) {
        return 'Nenhuma etapa cadastrada.\n';
      }
      return aeronave.etapas.map((etapa, index) => {
        const funcionarios = (etapa.funcionarios && etapa.funcionarios.length > 0)
          ? etapa.funcionarios.map(func => `        - ${func.nome} (${func.nivelPermissao})`).join('\n')
          : '        Nenhum funcionário alocado.';

        return [
          `  Etapa ${index + 1}: ${etapa.nome}`,
          `    Código: ${etapa.codigo}`,
          `    Status: ${etapa.status}`,
          `    Prazo: ${etapa.prazo}`,
          `    Funcionários:`,
          funcionarios,
          ''
        ].join('\n');
      }).join('\n');
    };

    const formatPecas = () => {
      if (!aeronave.pecas || aeronave.pecas.length === 0) {
        return 'Nenhuma peça cadastrada.\n';
      }
      return aeronave.pecas.map((peca, index) => [
        `  Peça ${index + 1}: ${peca.nome}`,
        `    Código: ${peca.codigo}`,
        `    Tipo: ${peca.tipo}`,
        `    Fornecedor: ${peca.fornecedor}`,
        `    Status: ${peca.status}`,
        `    Aeronave Código: ${peca.aeronave?.codigo ?? peca.aeronaveId ?? 'N/A'}`,
        ''
      ].join('\n')).join('\n');
    };

    const reportLines = [
      'RELATÓRIO DE AERONAVE',
      '=====================',
      `Código: ${aeronave.codigo}`,
      `Modelo: ${aeronave.modelo}`,
      `Tipo: ${aeronave.tipo}`,
      `Capacidade: ${aeronave.capacidade}`,
      `Alcance: ${aeronave.alcance}`,
      '',
      'PEÇAS',
      '-----',
      formatPecas(),
      'ETAPAS',
      '------',
      formatEtapas(),
    ];

    const reportContent = reportLines.join('\n');
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `relatorio_aeronave_${aeronave.codigo}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleDeletarAeronave = async () => {
    if (!aeronave) return;
    const confirmado = window.confirm('Tem certeza que deseja deletar esta aeronave?');
    if (!confirmado) return;

    try {
      setLoading(true);
      await aeronaveApi.deletar(aeronave.codigo);
      navigate("/dashboardAeronaves");
    } catch (err: any) {
      setError(err?.message ?? 'Erro ao deletar aeronave');
    } finally {
      setLoading(false);
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
                          onClick={handleGerarRelatorio}
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
                        <h1 className="font-mono text-default text-xl">{pegarEtapaAtual()?.nome}</h1>
                    </div>
                     : 
                    <div className={containerStyle}>
                        <h1 className="font-mono text-default text-xl text-left">Nenhuma etapa em pendente ou em andamento</h1>
                    </div>
                    }
                    
                    { aeronave.etapas && aeronave.etapas.length > 0 &&

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

        <NovoTesteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} aeronaveId={aeronave.id} onTesteSave={carregarAeronave}/>

        <Footer/>
    </div>
  )
}

export default AeronaveSelecionada