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

### 1. Clonar o repositório
```bash
git clone https://github.com/JkDeltaz/AV3
cd AV3
```

### 2. Configurar as Variáveis de Ambiente

Crie o arquivo `backend/.env` com a senha do banco de dados:

```env
DATABASE_URL="mysql://root:senha@aerocode-database:3306/aerocode?connection_limit=10&pool_timeout=0"
PORT=3000
```

E no `docker-compose.yml`, certifique-se de que a senha dos campos `MYSQL_ROOT_PASSWORD` e `DATABASE_URL` seja **idêntica** à usada na `DATABASE_URL` do .env acima:

```yaml
services:
  # Serviço 1: Banco de Dados MySQL
  aerocode-database:
    image: mysql:8.0
    restart: always
    environment:
      MYSQL_DATABASE: 'aerocode'
      MYSQL_ROOT_PASSWORD: 'suasenha'
    ports:
      - '3307:3306'
    volumes:
      - mysql_data:/var/lib/mysql

  backend:
    build:
      context: ./backend
    ports:
      - '3000:3000'
    volumes:
      - ./backend:/app         
      - /app/node_modules
    environment:
      - DATABASE_URL=mysql://root:suasenha@aerocode-database:3306/aerocode
      - PORT=3000
    depends_on:
      - aerocode-database

  prisma-studio:
      image: node:20-alpine
      container_name: aerocode-prisma-studio
      working_dir: /app
      volumes:
        - ./backend:/app
        - /app/node_modules 
      ports:
        - "5555:5555"
      environment:
        - DATABASE_URL=mysql://root:suasenha@aerocode-database:3306/aerocode
      command: sh -c "npm install && npx prisma generate && npx prisma studio --port 5555"
      depends_on:
        - aerocode-database
```

### 3. Inicializar os Containers

Na raiz do projeto (onde está o arquivo `docker-compose.yml`), execute:

```bash
docker compose up --build
```

*Este comando irá baixar as imagens necessárias, instalar as dependências dentro dos containers, gerar os artefatos do Prisma para Linux Alpine e iniciar as aplicações com **Hot Reload** ativo.*

### 4. Portas de Acesso Local

| Serviço | URL |
|---|---|
| Frontend (Interface Web) | http://localhost:5173 |
| Backend (API REST) | http://localhost:3000 |
| Prisma Studio (Banco de Dados) | http://localhost:5555 |

---

## 🔄 Trocar Portas (Conflito de Porta)

Se alguma porta já estiver em uso na sua máquina, siga as instruções abaixo para cada serviço.

### Identificar qual porta está ocupada (Windows)
```bash
netstat -ano | findstr :<PORTA>
```

### Identificar qual porta está ocupada (Linux/macOS)
```bash
lsof -i :<PORTA>
```

---

### Trocar a porta do Frontend (padrão: 5173)

No `docker-compose.yml`, altere o mapeamento de portas do serviço de frontend:
```yaml
ports:
  - '5174:5173'  # troque 5174 pelo número de porta que preferir
```
Acesse então pelo novo endereço: `http://localhost:5174`

---

### Trocar a porta do Backend (padrão: 3000)

**1.** No `backend/.env`, altere a variável `PORT`:
```env
PORT=3001
```

**2.** No `docker-compose.yml`, atualize o mapeamento do serviço de backend:
```yaml
ports:
  - '3001:3001'
```

Acesse então pelo novo endereço: `http://localhost:3001`

---

### Trocar a porta do Banco de Dados (padrão: 3307)

No `docker-compose.yml`, altere apenas o lado esquerdo do mapeamento (porta do host). O lado direito (3306) é interno ao container e não deve ser alterado:
```yaml
ports:
  - '3308:3306'  # troque 3308 pelo número de porta que preferir
```

> **Atenção:** a `DATABASE_URL` no `backend/.env` usa o nome do container (`aerocode-database`) como host, por isso **não** precisa ser alterada ao mudar a porta do host.

---

### Trocar a porta do Prisma Studio (padrão: 5555)

No `docker-compose.yml`, localize o comando de inicialização do Prisma Studio e altere a flag `--port`:
```yaml
command: npx prisma studio --port 5556
```
E atualize o mapeamento de portas:
```yaml
ports:
  - '5556:5556'
```

---

## 📊 Relatório de Qualidade — Métricas de Desempenho

A aplicação possui um middleware de APM (*Application Performance Monitoring*) integrado ao backend. Ele mede o tempo de processamento real do servidor via cabeçalho HTTP `x-server-processing-time` e permite isolar os três componentes de desempenho definidos no relatório de qualidade.

### Definição das Métricas

| Métrica | Descrição | Como é obtida |
|---|---|---|
| **Tempo de Resposta Total** | Tempo total percebido pelo usuário, do clique até a resposta | Medido no cliente via `performance.now()` |
| **Tempo de Processamento** | Tempo que o servidor levou para processar a requisição | Cabeçalho `x-server-processing-time` na resposta |
| **Latência** | Overhead de transporte de rede (ida + volta) | `Tempo de Resposta Total − Tempo de Processamento` |

### Como Coletar as Métricas

1. Abra o Frontend no navegador (`http://localhost:5173`)
2. Abra o **Console do Desenvolvedor** (`F12` → aba *Console*)
3. Cole e execute o script abaixo, substituindo a URL pela rota do backend que deseja testar:

```js
async function testarCargaPorPagina(urlDaRota, timeout = 10000) {
  const fmt = v => v < 1000 ? v.toFixed(1) + ' ms' : (v / 1000).toFixed(2) + ' s';
  const avg = arr => arr.reduce((s, v) => s + v, 0) / arr.length;

  for (const quantidadeUsuarios of [1, 5, 10]) {
    console.log(`\n=== TESTE: ${urlDaRota} | ${quantidadeUsuarios} usuário(s) ===`);
    const inicioAbsoluto = performance.now();

    const disparos = Array.from({ length: quantidadeUsuarios }, (_, i) => {
      const inicioIndividual = performance.now();
      const ctrl = new AbortController();
      const tid = setTimeout(() => ctrl.abort(), timeout);

      return fetch(urlDaRota, {
        headers: { 'x-client-timestamp': String(inicioIndividual) },
        signal: ctrl.signal
      }).then(async res => {
        clearTimeout(tid);
        const fim = performance.now();
        const proc = Number(res.headers.get('x-server-processing-time') || 0);
        const totalInd = fim - inicioIndividual;
        const transp = Math.max(0, totalInd - proc);
        console.log(`  req #${i + 1} [${res.status}] | Tempo de resposta total: ${fmt(totalInd)} | Tempo de processamento: ${fmt(proc)} | Latência: ${fmt(transp)}`);
        return { ok: true, totalInd, proc, transp };
      }).catch(err => {
        clearTimeout(tid);
        const totalInd = performance.now() - inicioIndividual;
        console.warn(`  req #${i + 1} ERRO: ${err.name === 'AbortError' ? 'timeout' : err.message} (${fmt(totalInd)})`);
        return { ok: false, totalInd, proc: 0, transp: 0 };
      });
    });

    const results = await Promise.all(disparos);
    const ok = results.filter(r => r.ok);
    if (!ok.length) { console.error('  Todos os requests falharam.'); continue; }

    console.log(`\n  MÉDIAS (${ok.length}/${quantidadeUsuarios} ok):`);
    console.log(`    Tempo de resposta total : ${fmt(avg(ok.map(r => r.totalInd)))}`);
    console.log(`    Tempo de processamento  : ${fmt(avg(ok.map(r => r.proc)))}${ok.every(r => r.proc === 0) ? '  ⚠️  header x-server-processing-time ausente' : ''}`);
    console.log(`    Latência                : ${fmt(avg(ok.map(r => r.transp)))}`);
  }
}

testarCargaPorPagina('http://localhost:3000/api/funcionarios');
```

### Resultados Obtidos

Os testes foram conduzidos com o ambiente rodando localmente via Docker, medindo as cinco rotas principais da API para 1, 5 e 10 usuários simultâneos. Todos os valores estão em milissegundos (ms).

#### API Funcionários

| Usuários | Tempo de Resposta Total | Tempo de Processamento | Latência |
|:---:|:---:|:---:|:---:|
| 1 | 33,0 ms | 8,7 ms | 24,3 ms |
| 5 | 41,1 ms | 5,7 ms | 35,7 ms |
| 10 | 62,4 ms | 5,4 ms | 57,0 ms |

#### API Aeronaves

| Usuários | Tempo de Resposta Total | Tempo de Processamento | Latência |
|:---:|:---:|:---:|:---:|
| 1 | 25,4 ms | 10,6 ms | 14,8 ms |
| 5 | 56,1 ms | 12,6 ms | 43,5 ms |
| 10 | 101,0 ms | 13,6 ms | 87,4 ms |

#### API Peças

| Usuários | Tempo de Resposta Total | Tempo de Processamento | Latência |
|:---:|:---:|:---:|:---:|
| 1 | 11,6 ms | 3,7 ms | 7,9 ms |
| 5 | 58,5 ms | 5,8 ms | 52,7 ms |
| 10 | 60,1 ms | 6,1 ms | 54,0 ms |

#### API Etapas

| Usuários | Tempo de Resposta Total | Tempo de Processamento | Latência |
|:---:|:---:|:---:|:---:|
| 1 | 14,8 ms | 6,6 ms | 8,2 ms |
| 5 | 40,3 ms | 6,8 ms | 33,5 ms |
| 10 | 81,8 ms | 9,0 ms | 72,8 ms |

#### API Testes

| Usuários | Tempo de Resposta Total | Tempo de Processamento | Latência |
|:---:|:---:|:---:|:---:|
| 1 | 13,1 ms | 2,3 ms | 10,8 ms |
| 5 | 33,8 ms | 5,4 ms | 28,4 ms |
| 10 | 59,5 ms | 6,2 ms | 53,3 ms |

---

## 🗄️ Visualizando o Banco de Dados (Prisma Studio)

Acesse `http://localhost:5555` para visualizar as tabelas do MySQL em formato de planilha, criar registros manualmente ou auditar o banco de dados enquanto o sistema roda.

---

## 🛑 Resolução de Problemas Comuns

### Erro: `@prisma/client did not initialize yet`

Ocorre se a pasta `node_modules` local sobrescrever a do container. Resolva forçando a regeneração do cliente de dentro do Docker:

```bash
docker compose exec backend npx prisma generate
```

### Erro: `Port is already in use`

Veja a seção [🔄 Trocar Portas](#-trocar-portas-conflito-de-porta) acima para instruções detalhadas por serviço.

### Containers sobem mas o banco não conecta

Verifique se a senha em `MYSQL_ROOT_PASSWORD` no `docker-compose.yml` é idêntica à senha na `DATABASE_URL` do `backend/.env`. Qualquer divergência entre os dois arquivos impede a conexão.

---

## 👨‍💻 Autor

- **Caio Santos** — [JkDeltaz](https://github.com/JkDeltaz)
- **Instituição:** Fatec São José dos Campos (Fatec SJC)
