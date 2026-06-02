import { useEffect, useState, type ChangeEvent } from 'react'
import { useLocation } from 'react-router-dom';
import '../App.css'
import { pecaApi, type Peca } from '../services/pecaApi';

export interface AdicionarPecaProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (codigo: string) => void;
}

function AdicionarPecaModal({ isOpen, onClose, onSave }: AdicionarPecaProps) {
  
  const location = useLocation();
  const aeronave = location.state?.aeronave;
  const [todasPecas, setTodasPecas] = useState<Peca[]>([]);
  const [loadingPecas, setLoadingPecas] = useState(true);
  const [pecaSelecionado, setPecaSelecionado] = useState<Peca | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoadingPecas(true);
    pecaApi.listar()
      .then(lista => setTodasPecas(lista))
      .catch(() => setTodasPecas([]))
      .finally(() => setLoadingPecas(false));
  }, [isOpen]);

  // Filtrar apenas peças que NÃO estão na aeronave
  const pecasAeronave = aeronave?.pecas || [];
  const pecasCodigos = Array.isArray(pecasAeronave) && pecasAeronave.length > 0 && typeof pecasAeronave[0] === 'object'
    ? pecasAeronave.map(p => p.codigo)
    : pecasAeronave;
  const pecas: Peca[] = todasPecas.filter(peca => !pecasCodigos.includes(peca.codigo));

  useEffect(() => {
    if (!isOpen || loadingPecas || pecas.length === 0) return;
    if (!pecaSelecionado && pecas.length > 0) {
      setPecaSelecionado(pecas[0]);
    }
  }, [isOpen, loadingPecas, pecas, pecaSelecionado]);

  useEffect(() => {
    if (pecas.length === 0 && isOpen && !loadingPecas) {
      onClose();
    }
  }, [pecas.length, isOpen, loadingPecas, onClose]);

  if (!isOpen || loadingPecas || pecas.length === 0 || !pecaSelecionado) return null;

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const novoValor = event.target.value;
    setPecaSelecionado(pecas.find(peca => peca.codigo === novoValor) || pecaSelecionado);
  }

  const handleAdd = () => {
    onSave(pecaSelecionado.codigo);
    onClose();
  }

  const inputCss = 'rounded bg-gray-300 p-2 pl-3 w-full font-sans'

  return (
    <div className="bg-gray-950/60 fixed w-screen h-screen flex justify-center align-center items-center">
        
        <div className='bg-superficie w-1/4 h-1/4 flex flex-col justify-center align-center border border-white/10 rounded'>
            
            <div className=''>
                <h1 className='font-mono text-3xl text-default text-center'>Nova Peça</h1>
            </div>

            <div className='px-8'>
                <div className='flex flex-col items-center'>

                    <select name="peca" className={inputCss} required
                    value={pecaSelecionado.codigo} onChange={handleChange}> 
                        {pecas.map((peca: Peca, index: number) => 
                            <option key={index} value={peca.codigo}>{peca.nome} - {peca.fornecedor}</option>
                        )}
                    </select>

                </div>

                <div className='mt-2 flex flex-1 items-center justify-center'>
                  <button
                  className='bg-fundo-20 text-default text-xl p-2 font-mono border border-white/10 rounded cursor-pointer hover:scale-102 hover:shadow-xl w-1/3'
                  type='button'
                  onClick={onClose}
                  >Cancelar</button>

                  <button 
                  className='bg-primario ml-auto text-xl p-2 font-mono border border-white/10 rounded cursor-pointer hover:scale-102 hover:shadow-xl w-1/3'
                  type='button'
                  onClick={handleAdd}
                  >Adicionar</button>
                </div>

            </div>

        </div>

    </div>
  )
}

export default AdicionarPecaModal