import { useEffect, useState, type ChangeEvent, type SyntheticEvent } from 'react'
import '../App.css'
import { testeApi, type Teste } from '../services/testeApi';

export interface novoTesteProps {
  isOpen: boolean;
  onClose: () => void;
  aeronaveId?: number;
  onTesteSave?: () => void;
}

function NovoTesteModal({ isOpen, onClose, aeronaveId, onTesteSave }: novoTesteProps) {
  const initialState: Teste = {
    codigo: '',
    tipo: 'Elétrico',
    resultado: 'Pendente',
    aeronaveId,
  };

  const [testeData, setTesteData] = useState<Teste>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setTesteData({ ...initialState, aeronaveId });
  }, [isOpen, aeronaveId]);

  if (!isOpen) return null;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setTesteData((prev) => ({
        ...prev,
        [name]: value,
    }));
  };

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setTesteData((prev) => ({
        ...prev,
        [name]: value,
    }));
  };

  const handleSubmit = async (resultado: 'Aprovado' | 'Reprovado') => {
    try {
      setLoading(true);
      setError('');
      await testeApi.criar({
        ...testeData,
        resultado,
      });
      onTesteSave?.();
      onClose();
    } catch (err: any) {
      setError(err?.message ?? 'Erro ao salvar teste');
    } finally {
      setLoading(false);
    }
  };

  const inputCss = 'rounded bg-gray-300 p-2 pl-3 w-full font-sans'

  return (
    <div className="bg-gray-950/60 fixed w-screen h-screen flex justify-center align-center items-center">
        
        <div className='bg-superficie w-1/4 h-auto flex flex-col justify-center align-center border border-white/10 rounded'>
            
            <div className='mx-8 mt-6 mb-4'>
                <h1 className='font-mono text-3xl text-default text-center'>Novo Teste</h1>
            </div>

            <div className='mx-8 mb-4'>
                <form className='flex flex-col items-center gap-4'>

                    <input type="text" name="codigo" placeholder="Código" value={testeData.codigo} onChange={handleChange} required
                    className={inputCss}>
                    </input>

                    <select name="tipo" className={inputCss} required
                    value={testeData.tipo} onChange={handleSelectChange}> 
                        <option value="Elétrico">Elétrico</option>
                        <option value="Hidráulico">Hidráulico</option>
                        <option value="Aerodinâmico">Aerodinâmico</option>
                    </select>

                    {error && <div className='text-red-500 text-sm'>{error}</div>}
                </form>

                <div className='mt-4 flex flex-1 items-center justify-center gap-2'>
                  <button
                  className='bg-red-500 text-default text-xl p-2 font-mono border border-white/10 rounded cursor-pointer hover:scale-102 hover:shadow-xl flex-1'
                  type='button'
                  disabled={loading}
                  onClick={() => handleSubmit('Reprovado')}
                  >Reprovado</button>

                  <button 
                  className='bg-primario text-xl p-2 font-mono border border-white/10 rounded cursor-pointer hover:scale-102 hover:shadow-xl flex-1'
                  type='button'
                  disabled={loading}
                  onClick={() => handleSubmit('Aprovado')}
                  >Aprovado</button>
                </div>
            </div>

            <div className='mb-4 mx-8'>
                <button className='bg-gray-600 font-sans rounded p-1.5 hover:scale-102 hover:shadow-xl cursor-pointer w-full'
                onClick={onClose}>
                    Cancelar
                </button>
            </div>

        </div>

    </div>
  )
}

export default NovoTesteModal