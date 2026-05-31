import { useEffect, useState, type ChangeEvent, type SyntheticEvent } from 'react'
import '../App.css'
import { etapaApi, type Etapa } from '../services/etapaApi';
import { type Aeronave, aeronaveApi } from '../services/aeronaveApi';
import {useLocation} from 'react-router-dom';

export interface IniciarEtapaProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  aeronaveId: number;
  etapa?: Etapa;
}

function IniciarEtapaModal({ isOpen, onClose, onSave, aeronaveId, etapa }: IniciarEtapaProps) {
  const initialState: Etapa = {
    codigo: '',
    nome: '',
    prazo: 0,
    status: 'Pendente',
    aeronaveId,
    funcionarios: [],
  };

  const [etapaData, setEtapaData] = useState<Etapa>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const location = useLocation();
  const aeronaveParam = location.state?.aeronave;
  const [aeronave, setAeronave] = useState<Aeronave | null>(aeronaveParam ?? null);

  const carregarAeronave = async () => {
    if (!aeronaveParam?.codigo) return;
    try {
      setLoading(true);
      setError('');
      const dados = await aeronaveApi.buscarPorCodigo(aeronaveParam.codigo);
      setAeronave(dados);
    } catch (err: any) {
      setError(err?.message ?? 'Erro ao carregar aeronave cadastrada à etapa');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    if (etapa) {
      setEtapaData(etapa);
    } else {
      setEtapaData({ ...initialState, aeronaveId: aeronaveId ?? null });
    }
  }, [isOpen, etapa, aeronaveId]);

  if (!isOpen) return null;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const fieldName = event.target.name as 'codigo' | 'nome' | 'prazo';
    const fieldValue = fieldName === 'prazo' ? Number(event.target.value) : event.target.value;

    setEtapaData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const novoValor = event.target.value as 'Pendente' | 'Em andamento' | 'Concluída';

    setEtapaData((prev) => ({
      ...prev,
      status: novoValor,
    }));
  }

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    event.preventDefault();

    if (!aeronaveId || aeronaveId <= 0) {
      setError('ID da aeronave não foi definido corretamente.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      if (etapa) {
        await etapaApi.atualizar(etapa.codigo, {
          nome: etapaData.nome,
          prazo: etapaData.prazo,
          status: etapaData.status,
          funcionarios: etapaData.funcionarios,
          aeronaveId: aeronave?.id ?? aeronaveId,
        });
      } else {
        await etapaApi.criar({ ...etapaData, aeronaveId: aeronave?.id ?? aeronaveId });
      }

      onSave();
      onClose();
    } catch (err: any) {
      setError(err?.message ?? 'Erro ao salvar etapa');
    } finally {
      setLoading(false);
    }
  };

  const inputCss = 'rounded bg-gray-300 p-2 pl-3 w-full font-sans';
  const isEditMode = Boolean(etapa);

  return (
    <div className="bg-gray-950/60 fixed w-screen h-screen flex justify-center align-center items-center">
      <div className='bg-superficie m-8 w-1/4 h-2/3 flex flex-col justify-center align-center border border-white/10 rounded'>
        <div className='mx-8 mt-6 mb-4'>
          <h1 className='font-mono text-3xl text-default text-center'>{isEditMode ? 'Editar Etapa' : 'Iniciar Etapa'}</h1>
        </div>

        <div className='mx-8'>
          <form onSubmit={handleSubmit} className='gap-4 flex flex-col items-center'>
            <input
              type="text"
              name="codigo"
              placeholder="Código"
              value={etapaData.codigo}
              onChange={handleChange}
              required
              className={inputCss}
              disabled={isEditMode}
            />

            <input
              type="text"
              name="nome"
              placeholder="Nome"
              value={etapaData.nome}
              onChange={handleChange}
              required
              className={inputCss}
            />

            <input
              type="number"
              name="prazo"
              placeholder="Prazo (Dias)"
              value={etapaData.prazo}
              onChange={handleChange}
              required
              className={inputCss}
            />

            <select
              name="status"
              className={inputCss}
              required
              value={etapaData.status}
              onChange={handleSelectChange}
            >
              <option value="Pendente">Pendente</option>
              <option value="Em andamento">Em Andamento</option>
              <option value="Concluída">Concluída</option>
            </select>

            {error && <div className='text-red-500'>{error}</div>}

            <button
              className='bg-primario text-xl p-2 font-mono border border-white/10 rounded cursor-pointer hover:scale-102 hover:shadow-xl w-1/3'
              type='submit'
              disabled={loading}
            >
              {isEditMode ? 'Salvar' : 'Cadastrar'}
            </button>
          </form>
        </div>

        <div className='mt-auto mr-auto m-8'>
          <button
            className='bg-red-500 font-sans rounded p-1.5 hover:scale-102 hover:shadow-xl cursor-pointer'
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default IniciarEtapaModal;
