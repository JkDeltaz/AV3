# Usa a mesma imagem estável do Node
FROM node:22-alpine

# Define o diretório de trabalho do backend
WORKDIR /app

# Copia os arquivos de configuração de pacotes e do TypeScript
COPY package*.json tsconfig.json ./

# Instala as dependências de produção e desenvolvimento
RUN npm install

# Copia a pasta do prisma primeiro (essencial para gerar o client no container)
COPY prisma ./prisma/

# Gera o Prisma Client com os binários corretos para o ambiente Linux do container
RUN npx prisma generate

# Copia o restante do código fonte do backend
COPY . .

# Expõe a porta que a sua API Express escuta
EXPOSE 3000

# Comando para iniciar o backend usando o tsx que configuramos no package.json
CMD ["npm", "run", "dev"]