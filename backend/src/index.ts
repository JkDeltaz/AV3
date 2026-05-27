import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    res.send("TESTE TESTE")
});

// Rota para Buscar todas as Peças usando o Prisma
app.get('/api/pecas', async (req, res) => {
  try {
    const pecas = await prisma.peca.findMany(); // Busca tudo no MySQL
    res.json(pecas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar peças via Prisma' });
  }
});

// Rota para Cadastrar uma nova Peça usando o Prisma
app.post('/api/pecas', async (req, res) => {
  const { codigo, nome, fornecedor, tipo, status } = req.body;
  try {
    const novaPeca = await prisma.peca.create({
      data: { codigo, nome, fornecedor, tipo, status }
    });
    res.status(201).json(novaPeca);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao cadastrar peça via Prisma' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});