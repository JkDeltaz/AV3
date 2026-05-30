import { useEffect, useState } from 'react'
import '../App.css'
import Topbar from '../components/Topbar';
import Footer from '../components/Footer';
import NavigationComponent from '../components/Navigation';
import CadastroPecaModal from '../components/CadastroPecaModal';
import { pecaApi, type Peca } from '../services/pecaApi';

function DashboardPecas() {

  const [pecas, setPecas] = useState<Peca[]>([]);
  const [editingPeca, setEditingPeca] = useState<Peca | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const carregarPecas = async () => {
    try {
      setCarregando(true);
      const dados = await pecaApi.listar();
      setPecas(dados);
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  };

  const abrirModal = (peca?: Peca) => {
    setEditingPeca(peca ?? null);
    setIsModalOpen(true);
  };

  const handleDelete = async (codigo: string) => {
    try {
      setCarregando(true);
      await pecaApi.deletar(codigo);
      carregarPecas();
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarPecas();
  }, []);

  if (carregando) return <p className="text-white">A carregar peças...</p>;
  if (erro) return <p className="text-red-500">Erro: {erro}</p>;

  const btnStyle = 'bg-primario font-sans rounded border border-white/10 p-2 px-4 cursor-pointer hover:scale-102 hover:shadow-xl'
  

  return (
    <div className="bg-fundo min-h-screen overflow-x-hidden flex flex-col">
        <Topbar/>
        <NavigationComponent openModal={() => {}}/>


        <div className='bg-superficie mx-8 my-6 rounded border border-white/10 p-8 flex-1 flex flex-col'>
            
          <div className='grid grid-cols-7 gap-4 w-full mb-6'>
            <div className='font-mono text-default text-2xl'>Nome</div>
            <div className='font-mono text-default text-2xl'>Código</div>
            <div className='font-mono text-default text-2xl'>Aeronave</div>
            <div className='font-mono text-default text-2xl'>Fornecedor</div>
            <div className='font-mono text-default text-2xl'>Tipo</div>
            <div className='font-mono text-default text-2xl'>Status</div>
            <div className='font-mono text-default text-2xl'>Ações</div>

            {pecas.map((peca: Peca) => (
              <div key={peca.codigo} className='contents'>
                <div className='font-mono text-default text-lg'>{peca.nome}</div>
                <div className='font-mono text-default text-lg'>{peca.codigo}</div>
                <div className='font-mono text-default text-lg'>{peca.aeronaveId ?? 'Nenhuma'}</div>
                <div className='font-mono text-default text-lg'>{peca.fornecedor}</div>
                <div className='font-mono text-default text-lg'>{peca.tipo}</div>
                <div className='font-mono text-default text-lg'>{peca.status}</div>
                <div className='flex gap-2'>
                  <button
                    className='bg-primario font-sans rounded border border-white/10 px-2 cursor-pointer hover:scale-102 hover:shadow-xl'
                    onClick={() => abrirModal(peca)}
                  >
                    Editar
                  </button>
                  <button
                    className='bg-red-500 font-sans rounded border border-white/10 px-2 cursor-pointer hover:scale-102 hover:shadow-xl'
                    onClick={() => handleDelete(peca.codigo)}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className='flex flex-1'>
              <div className='mt-auto flex flex-1 gap-x-4 justify-end'>
                  <button className={btnStyle}
                  onClick={() => abrirModal()}
                  >
                  Cadastrar Peça
                  </button>  
              </div>
        
          </div>

        </div>
            
        <CadastroPecaModal isOpen={isModalOpen} onSave={carregarPecas} onClose={() => { setIsModalOpen(false); setEditingPeca(null); }} peca={editingPeca ?? undefined}/>
        <Footer/>
    </div>
  )
}

export default DashboardPecas