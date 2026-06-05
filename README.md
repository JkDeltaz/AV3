Aqui está um modelo completo e profissional de arquivo `README.md` estruturado em Markdown para o seu projeto **Aerocode**.

Ele já contempla toda a arquitetura que desenvolvemos (React, Vite, Tailwind, Node.js, Express, Docker Compose, Prisma e MySQL) e inclui as instruções claras de como rodar o ambiente com Hot Reload e como visualizar as métricas de performance para o relatório da faculdade.

Você pode criar um arquivo chamado `README.md` na raiz do seu projeto e colar o conteúdo abaixo:

```markdown
# Aerocode ✈️

O **Aerocode** é um sistema moderno de gerenciamento de aeronaves e componentes (peças), desenvolvido como projeto acadêmico para a **Fatec São José dos Campos (Fatec SJC)**. A aplicação foi projetada com foco em uma interface de usuário fluida e de alta performance, permitindo o controle de inventário, acompanhamento de etapas de manutenção e monitoramento de métricas de infraestrutura em tempo real.

---

## 🚀 Tecnologias Utilizadas

### Frontend
- **React** (com TypeScript)
- **Vite** (configurado com Polling para Hot Reload em ambientes virtualizados)
- **Tailwind CSS** (estilização moderna e responsiva)

### Backend & Banco de Dados
- **Node.js** com **Express** (TypeScript)
- **Prisma ORM** (mapeamento e gerenciamento de banco de dados)
- **MySQL 8.0** (banco de dados relacional)

### Infraestrutura & DevTools
- **Docker** & **Docker Compose** (containerização completa do ambiente)
- **Prisma Studio** (interface gráfica para gerenciamento de dados na porta `5555`)
- **APM Interno (Middleware)** (instrumentação de código para captura de latência, tempo de processamento e resposta)

---

## 🛠️ Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina:
1. [Docker](https://www.docker.com/products/docker-desktop/)
2. [Docker Compose](https://docs.docker.com/compose/install/)
3. [Git](https://git-scm.com/)

---

## 📦 Como Rodar o Projeto

Siga os passos abaixo para subir todo o ecossistema (Frontend, Backend e Banco de Dados) com apenas um comando.

### 1. Clonar o repositório
```bash
git clone [https://github.com/JkDeltaz/aerocode.git](https://github.com/JkDeltaz/AV3)
cd AV3

```

### 2. Configurar as Variáveis de Ambiente

Verifique se o arquivo `.env` dentro da pasta `backend/` está apontando corretamente para o container do banco de dados no Docker (utilizando o host `aerocode-database` em vez de `localhost` para evitar falhas de loopback):

```env
DATABASE_URL="mysql://root:suasenha@aerocode-database:3306/aerocode?connection_limit=10&pool_timeout=0"
PORT=3000

```

### 3. Inicializar os Containers

Na raiz do projeto (onde está o arquivo `docker-compose.yml`), execute o comando para buildar e subir os serviços:

```bash
docker compose up --build

```

*Este comando irá baixar as imagens necessárias, instalar as dependências dentro dos containers, gerar os artefatos do Prisma para Linux Alpine e iniciar as aplicações com **Hot Reload** ativo.*

### 4. Portas de Acesso Local

Uma vez que os containers estejam de pé (`running`), você poderá acessar a aplicação através das URLs:

* **Frontend (Interface Web):** [http://localhost:5173](http://localhost:5173)
* **Backend (API Rest):** [http://localhost:3000](http://localhost:3000)

---

## 📊 Monitoramento de Performance (Relatório AV)

A aplicação possui um middleware de APM (*Application Performance Monitoring*) integrado. Ele calcula de forma real o tempo gasto pelo servidor para processar as queries no banco de dados e isola a latência de rede fim-a-fim.

### Como visualizar as métricas:

1. Abra o painel do Frontend no seu navegador (`http://localhost:5173`).
2. Abra o **Console do Desenvolvedor** (Aperte `F12` ou clique com o botão direito -> *Inspecionar* -> aba *Console*).
3. Ao navegar entre o Dashboard de Peças e o de Aeronaves, os relatórios de tempo serão printados no seguinte formato:
```text
[PERF - GET /pecas] Tempo de Resposta Total: 15.40 ms
[PERF - GET /pecas] Tempo de Processamento Servidor: 12.10 ms
[PERF - GET /pecas] Latência Real de Rede (Ida+Volta): 3.30 ms

```

---

## 🗄️ Visualizando o Banco de Dados (Prisma Studio)

Se você quiser visualizar as tabelas do MySQL em formato de planilha, criar registros manualmente ou auditar o banco de dados enquanto o sistema roda:

Abra o navegador em: [http://localhost:5555](http://localhost:5555)

---

## 🛑 Resolução de Problemas Comuns

### Erro: `@prisma/client did not initialize yet`

Isso ocorre se a pasta `node_modules` local sobrescrever a do container. Resolva forçando a regeneração do cliente para Linux de dentro do Docker:

```bash
docker compose exec backend npx prisma generate

```

---

## 👨‍💻 Autor

* **Caio Santos** - [JkDeltaz](https://github.com/JkDeltaz)
* **Instituição:** Fatec São José dos Campos (Fatec SJC)


```