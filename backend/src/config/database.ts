import { PrismaClient } from '@prisma/client';

// Cria a instância global do Prisma
const prisma = new PrismaClient({
  // Dá pra habilitar logs aqui para ver as queries no terminal do Docker
  log: ['error', 'warn'],
});

export default prisma;