import app from './app.js';
import { seedDatabase } from './config/seed.js';

const port = process.env.PORT || 3000;

// Seed e inicia o servidor
(async () => {
  await seedDatabase();
  app.listen(port, () => {
    console.log(`🚀 Servidor Aerocode rodando com sucesso em http://localhost:${port}`);
  });
})();