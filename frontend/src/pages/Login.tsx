import { useState, type ChangeEvent, type FormEvent } from 'react'
import '../App.css'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    try {
      await login(usuario, senha);
      navigate('/dashboardAeronaves');
    } catch (err: any) {
      setError(err?.message ?? 'Erro ao fazer login');
    }
  };

  return (
      <div className="bg-fundo h-screen w-screen flex justify-center items-center">
        
        <div className="bg-superficie p-8 border border-white/10 rounded flex-column align-center justify-center max-w-2/7">
            <h1 className="text-default font-mono text-5xl text-center">
                AEROCODE
            </h1>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <input
                  type="text"
                  name="usuario"
                  placeholder="Usuário"
                  className="rounded bg-gray-300 p-1 pl-3 w-full font-sans"
                  value={usuario}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => setUsuario(event.target.value)}
                  required
                />

                <input
                  type="password"
                  name="senha"
                  placeholder="Senha"
                  className="rounded bg-gray-300 p-1 pl-3 w-full font-sans"
                  value={senha}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => setSenha(event.target.value)}
                  required
                />

                {error && <div className="text-red-500">{error}</div>}

                <button
                  type="submit"
                  className="bg-primario p-2 rounded border-white/10 cursor-pointer w-full font-sans"
                >
                  Entrar
                </button>
            </form>

        </div>

      </div>
  )
}

export default Login