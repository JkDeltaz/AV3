import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pecaRoutes from './routes/peca.routes.js';
import aeronaveRoutes from './routes/aeronave.routes.js';
import funcionarioRoutes from './routes/funcionario.routes.js';
import etapaRoutes from './routes/etapa.routes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json()); 

app.use((req, res, next) => {
  const inicio = performance.now();
  res.on('finish', () => {
    const fim = performance.now();
    const tempo = (fim - inicio).toFixed(2);
    console.log(`[MÉTRICA AV3] ${req.method} ${req.url} - Processado em ${tempo}ms`);
  });
  next();
});

// rotas
app.use('/api/pecas', pecaRoutes);
app.use('/api/aeronaves', aeronaveRoutes);
app.use('/api/funcionarios', funcionarioRoutes);
app.use('/api/etapas', etapaRoutes);
// app.use('/api/testes', testeRoutes);

// Rota de checagem de saúde do servidor (Healthcheck)
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

export default app;