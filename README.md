<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<h1 align="center">Sistema de Notificações Assíncronas</h1>

<p align="center">
  Um projeto de exemplo que demonstra uma arquitetura de microserviços robusta utilizando NestJS, RabbitMQ e PostgreSQL. O sistema implementa padrões avançados como CQRS e Database per Service para garantir desacoplamento e escalabilidade.
</p>

## Sobre o Projeto

Este repositório contém uma implementação completa de um sistema de envio de notificações, dividido em dois microserviços principais:

- **`api-gateway`**: Responsável por receber requisições HTTP, validar os dados, persistir o estado inicial e publicar um evento de notificação em uma fila.
- **`notification-consumer`**: Ouve a fila de eventos, processa a notificação de forma assíncrona, e persiste o resultado final em seu próprio banco de dados.

A comunicação entre os serviços é feita de forma assíncrona através do **RabbitMQ**, e cada serviço possui seu próprio banco de dados **PostgreSQL**, seguindo o padrão _Database per Service_.

---

## Requisitos

Para rodar este projeto, você precisará ter os seguintes softwares instalados na sua máquina:

- [**Docker**](https://www.docker.com/get-started/) e **Docker Compose**
- [**Node.js**](https://nodejs.org/) (v22 ou superior)
- **NPM** (geralmente instalado com o Node.js)

---

## Como Rodar a Aplicação

Siga os passos abaixo para configurar e iniciar todo o ambiente.

### 1. Clonar o Repositório

```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd <NOME_DA_PASTA>
```

### 2. Configurar Variáveis de Ambiente

Crie os arquivos `.env` necessários para cada serviço.

- **Para a API Gateway:** Crie o arquivo `apps/api-gateway/.env` com o seguinte conteúdo:

  ```
  DATABASE_URL="postgresql://admin:admin@localhost:5432/gateway_db"
  ```

- **Para o Notification Consumer:** Crie o arquivo `apps/notification-consumer/.env` com o seguinte conteúdo:
  ```
  DATABASE_URL="postgresql://admin:admin@localhost:5433/consumer_db"
  ```

### 3. Instalar Dependências

Na raiz do projeto, execute o comando para instalar todas as dependências do monorepo:

```bash
npm install
```

### 4. Iniciar os Contêineres

Use o Docker Compose para construir as imagens e iniciar todos os serviços (ambas as aplicações, os dois bancos de dados e o RabbitMQ):

```bash
docker-compose up --build
```

Este comando pode demorar um pouco na primeira vez. Ele irá baixar as imagens, construir suas aplicações, rodar as migrações do banco de dados automaticamente e iniciar tudo.

---

## Como Testar o Fluxo

Com os contêineres rodando, você pode enviar uma notificação para a API usando o `curl`:

```bash
curl -X POST http://localhost:3000/api/notificar \
-H "Content-Type: application/json" \
-d '{
  "content": "Hello World!"
}'
```

Você receberá uma resposta imediata confirmando o recebimento. Para verificar o processamento completo, você pode inspecionar os logs dos contêineres ou verificar o banco de dados do `notification-consumer` usando o [Prisma Studio](#rodando-os-testes).

---

## Rodando os Testes

O projeto está configurado com testes unitários e End-to-End (E2E).

### Testes Unitários

Para rodar os testes unitários da `api-gateway` (que simulam as dependências):

```bash
npm run test api-gateway
```

### Testes End-to-End (E2E)

Para rodar o teste E2E (que necessita dos **contêineres rodando**), execute:

```bash
npm run test:e2e api-gateway
```

Este teste irá enviar uma requisição HTTP real para a aplicação e verificar o fluxo. Para confirmar o resultado no `notification-consumer`, use o Prisma Studio:

```bash
npx dotenv -e ./apps/notification-consumer/.env -- npx prisma studio --schema=./apps/notification-consumer/prisma/schema.prisma
```
