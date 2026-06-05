import { useEffect, useState } from 'react'
import '../App.css'
import Topbar from '../components/Topbar'
import Footer from '../components/Footer'
import NavigationComponent from '../components/Navigation'
import { useAuth } from '../contexts/AuthContext'
import { etapaApi, type Etapa } from '../services/etapaApi'
import { useNavigate } from 'react-router-dom'

function MinhasEtapas() {
  const [etapas, setEtapas] = useState<Etapa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const { userPermission, loggedInUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!userPermission) {
      navigate('/login', { replace: true })
      return
    }

    const carregarEtapas = async () => {
      setLoading(true)
      setError('')

      try {
        const todasEtapas = await etapaApi.listar()
        const funcionarioCodigo = loggedInUser?.codigo
        if (!funcionarioCodigo) {
          setEtapas([])
          return
        }

        const minhasEtapas = todasEtapas.filter((etapa) =>
          etapa.funcionarios.some((funcionario) => funcionario.codigo === funcionarioCodigo)
        )

        setEtapas(minhasEtapas)
      } catch (err: any) {
        setError(err?.message ?? 'Erro ao carregar etapas')
      } finally {
        setLoading(false)
      }
    }

    carregarEtapas()
  }, [userPermission, loggedInUser, navigate])

  if (!userPermission) return null

  return (
    <div className="bg-fundo min-h-screen flex flex-col overflow-x-hidden">
      <Topbar />
      <NavigationComponent openModal={() => {}} />

      <div className="bg-superficie mx-8 my-6 rounded border border-white/10 p-8 flex-1 flex flex-col">
        <div className="mb-6">
          <h1 className="font-mono text-4xl text-default">Minhas Etapas</h1>
          <p className="font-sans text-default/80 mt-2">
            Visualize as etapas nas quais você está participando.
          </p>
        </div>

        {loading ? (
          <div className="text-white">Carregando...</div>
        ) : error ? (
          <div className="text-red-500">Erro: {error}</div>
        ) : etapas.length === 0 ? (
          <div className="text-default text-xl">Você não está participando de nenhuma etapa no momento.</div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {etapas.map((etapa) => (
              <div key={etapa.codigo} className="bg-fundo/70 border border-white/10 rounded p-6 shadow-xl">
                <h2 className="font-mono text-2xl text-default mb-3">{etapa.nome}</h2>
                <p className="font-sans text-default mb-1">Código: {etapa.codigo}</p>
                <p className="font-sans text-default mb-1">Status: {etapa.status}</p>
                <p className="font-sans text-default mb-1">Prazo: {etapa.prazo} dias</p>
                <p className="font-sans text-default mb-3">Aeronave ID: {etapa.aeronaveId}</p>

                <div className="bg-superficie rounded border border-white/10 p-3">
                  <h3 className="font-mono text-xl text-default mb-2">Equipe</h3>
                  {etapa.funcionarios.length === 0 ? (
                    <p className="font-sans text-default">Nenhum funcionário alocado.</p>
                  ) : (
                    etapa.funcionarios.map((funcionario) => (
                      <div key={funcionario.codigo} className="mb-2">
                        <p className="font-mono text-default">{funcionario.nome}</p>
                        <p className="font-sans text-default/80">{funcionario.codigo} • {funcionario.nivelPermissao}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default MinhasEtapas
