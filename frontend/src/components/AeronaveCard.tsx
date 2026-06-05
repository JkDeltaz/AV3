import { useNavigate } from 'react-router-dom';
import '../App.css'
import Icone from './Icone';
import { type Aeronave } from '../services/aeronaveApi';
import { useAuth } from '../contexts/AuthContext';

function AeronaveCard({
  aeronave,
  onEdit,
  onDelete,
}: {
  aeronave: Aeronave;
  onEdit?: (aeronave: Aeronave) => void;
  onDelete?: (codigo: string) => void;
}) {
  const imgSource = `/${aeronave.tipo}.png`;
  const navigate = useNavigate();

  const handleAbrir = () => {
    navigate('/aeronaveSelecionada', { state: { aeronave } });
  };

  const { userPermission } = useAuth();

  return (
    <div className="bg-superficie rounded border border-white/10 p-2 hover:scale-102 hover:shadow-xl transition">
      <div className='flex flex-row'>
        <div>
          <h1 className="text-default font-mono text-xl">{aeronave.modelo}</h1>
          <h1 className="text-default font-mono">Capacidade: {aeronave.capacidade}</h1>
          <h1 className="text-default font-mono">Alcance: {aeronave.alcance}</h1>
          <h1 className="text-default font-mono">Código: {aeronave.codigo}</h1>
          <h1 className="text-default font-mono">Tipo: {aeronave.tipo}</h1>
        </div>

        <div className='max-w-1/3 max-h-1/3 ml-auto'>
          {aeronave.tipo === 'Comercial' && <Icone icone={aeronave.tipo} />}
          {aeronave.tipo === 'Militar' && <Icone icone={aeronave.tipo} />}
        </div>
      </div>

      <div className='flex flex-row gap-2 mt-4'>
        <button
          className='bg-primario rounded border border-white/10 p-1 px-4 cursor-pointer ml-auto hover:scale-102 hover:shadow-xl'
          onClick={handleAbrir}
        >
          Abrir
        </button>

        {userPermission != 'Operador' && (
          <button
            className='bg-primario rounded border border-white/10 p-1 px-4 cursor-pointer hover:scale-102 hover:shadow-xl'
            onClick={() => onEdit?.(aeronave)}
          >
            Editar
          </button>
        )}
      </div>
    </div>
  )
}

export default AeronaveCard