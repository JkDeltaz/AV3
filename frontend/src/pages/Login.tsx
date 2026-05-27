import { useState, type ChangeEvent } from 'react'
import '../App.css'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';


function Login() {

  const [selectedLevel, setSelectedLevel] = useState<string>("Administrador");
  const [count, setCount] = useState(0);
  const { login } = useAuth();

  const navigate = useNavigate();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const novoValor = event.target.value;
    setSelectedLevel(novoValor);
  }

  const handleLogin = () => {
    
    switch (selectedLevel) {
      case "Administrador":
        login("Administrador");
        break;
      case "Engenheiro":
        login("Engenheiro");
        break;
      case "Operador":
        login("Operador")
        break;
      }
    navigate("/dashboardAeronaves")
  }

  return (
      <div className="bg-fundo h-screen w-screen flex justify-center items-center">
        
        <div className="bg-superficie p-8 border border-white/10 rounded flex-column align-center justify-center max-w-2/7">
            <h1 className="text-default font-mono text-5xl text-center">
                AEROCODE
            </h1>

            <div className="mt-5 space-y-2">
                <input type="text" name="user" placeholder="Usuário"
                className="rounded bg-gray-300 p-1 pl-3 w-full font-sans">
                </input>

                <input type="password" name="password" placeholder="Senha"
                className="rounded bg-gray-300 p-1 pl-3 w-full font-sans">
                </input>
                
                <select name="level" className="rounded bg-gray-300 p-1 pl-3 w-full font-sans"
                value={selectedLevel} onChange={handleChange}>
                
                <option value="Administrador">Administrador</option>
                <option value="Engenheiro">Engenheiro</option>
                <option value="Operador">Operador</option>

                </select>

                <button 
                className="bg-primario p-2 rounded border-white/10 cursor-pointer w-full font-sans"
                onClick={handleLogin}
                >  
                  Entrar como {selectedLevel}
                </button>


            </div>

        </div>

      </div>
  )
}

export default Login