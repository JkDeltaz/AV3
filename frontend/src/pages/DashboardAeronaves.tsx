import { useEffect, useState } from 'react'
import '../App.css'
import { useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';
import Footer from '../components/Footer';
import NavigationComponent from '../components/Navigation';
import AeronaveCard from '../components/AeronaveCard';
import CadastroAeronaveModal from '../components/cadastroAeronaveModal';
import { aeronaveApi, type Aeronave } from '../services/aeronaveApi';
import { useAuth } from '../contexts/AuthContext';

function DashboardAeronaves() {
  const { userPermission } = useAuth();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aeronaves, setAeronaves] = useState<Aeronave[]>([]);
  const [editingAeronave, setEditingAeronave] = useState<Aeronave | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const carregarAeronaves = async () => {
    try {
      setLoading(true);
      setError('');
      const dados = await aeronaveApi.listar();
      setAeronaves(dados);
    } catch (err: any) {
      setError(err?.message ?? 'Erro ao carregar aeronaves');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userPermission) {
      navigate('/login', { replace: true });
      return;
    }
    carregarAeronaves();
  }, [userPermission, navigate]);

  const abrirModal = (aeronave?: Aeronave) => {
    setEditingAeronave(aeronave ?? null);
    setIsModalOpen(true);
  };

  const fecharModal = () => {
    setEditingAeronave(null);
    setIsModalOpen(false);
  };

  const salvarAeronave = async (aeronave: Aeronave) => {
    try {
      setLoading(true);
      setError('');

      if (editingAeronave) {
        const aeronaveAtualizada = await aeronaveApi.atualizar(editingAeronave.codigo, {
          modelo: aeronave.modelo,
          tipo: aeronave.tipo,
          capacidade: aeronave.capacidade,
          alcance: aeronave.alcance,
          pecas: aeronave.pecas ?? [],
          etapas: aeronave.etapas ?? [],
          testes: aeronave.testes ?? [],
        });
        setAeronaves((prev) => prev.map((item) => item.codigo === aeronaveAtualizada.codigo ? aeronaveAtualizada : item));
      } else {
        const novaAeronave = await aeronaveApi.criar(aeronave);
        setAeronaves((prev) => [...prev, novaAeronave]);
      }

      fecharModal();
    } catch (err: any) {
      setError(err?.message ?? 'Erro ao salvar aeronave');
    } finally {
      setLoading(false);
    }
  };

  const excluirAeronave = async (codigo: string) => {
    try {
      setLoading(true);
      setError('');
      await aeronaveApi.deletar(codigo);
      setAeronaves((prev) => prev.filter((item) => item.codigo !== codigo));
    } catch (err: any) {
      setError(err?.message ?? 'Erro ao excluir aeronave');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-fundo min-h-screen flex flex-col overflow-x-hidden">
      <Topbar />
      <NavigationComponent openModal={() => abrirModal()} />

      <CadastroAeronaveModal
        isOpen={isModalOpen}
        onClose={fecharModal}
        onSave={salvarAeronave}
        aeronave={editingAeronave ?? undefined}
      />

      <div className='m-8 grid grid-cols-4 grid-rows-2 gap-4'>
        {loading && <div className='text-default font-mono'>Carregando aeronaves...</div>}
        {error && <div className='text-red-500 font-mono'>Erro: {error}</div>}
        {!loading && !error && aeronaves.map((objetoAeronave) => (
          <AeronaveCard
            aeronave={objetoAeronave}
            key={objetoAeronave.codigo}
            onEdit={abrirModal}
            onDelete={excluirAeronave}
          />
        ))}
      </div>

      <Footer />
    </div>
  )
}

export default DashboardAeronaves