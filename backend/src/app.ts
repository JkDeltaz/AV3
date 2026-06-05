import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pecaRoutes from './routes/peca.routes.js';
import aeronaveRoutes from './routes/aeronave.routes.js';
import funcionarioRoutes from './routes/funcionario.routes.js';
import etapaRoutes from './routes/etapa.routes.js';
import testeRoutes from './routes/teste.routes.js';
import authRoutes from './routes/auth.routes.js';
import { monitorarPerformance } from './middlewares/performance.middleware.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // URL do seu frontend React/Vite
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-client-timestamp'], // <-- ADICIONE O SEU HEADER AQUI!
  exposedHeaders: ['x-server-processing-time'] // Garante que o front consiga ler a resposta
}));


app.use(express.json()); 

// rotas
app.use(monitorarPerformance);
app.use('/api/auth', authRoutes);
app.use('/api/pecas', pecaRoutes);
app.use('/api/aeronaves', aeronaveRoutes);
app.use('/api/funcionarios', funcionarioRoutes);
app.use('/api/etapas', etapaRoutes);
app.use('/api/testes', testeRoutes);

// Rota de checagem de saúde do servidor (Healthcheck)
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

export default app;