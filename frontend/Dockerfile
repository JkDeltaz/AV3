# Usa uma imagem oficial estável do Node
FROM node:22-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências do React
RUN npm install

# Copia o restante dos arquivos do frontend
COPY . .

# Expõe a porta padrão do Vite
EXPOSE 5173

# Comando para rodar o frontend em modo dev aceitando conexões externas
CMD ["npm", "run", "dev", "--", "--host"]