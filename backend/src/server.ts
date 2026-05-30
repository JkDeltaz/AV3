import app from './app';

const port = process.env.PORT || 3000;

// Liga o servidor de fato
app.listen(port, () => {
  console.log(`🚀 Servidor Aerocode rodando com sucesso em http://localhost:${port}`);
});