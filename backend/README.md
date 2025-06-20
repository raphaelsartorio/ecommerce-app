# Backend E-commerce

Este projeto é um backend para um sistema de e-commerce, desenvolvido com [NestJS](https://nestjs.com/) e TypeORM, utilizando SQLite como banco de dados. Ele expõe endpoints para produtos e pedidos (orders).

## Requisitos

- Node.js (v18 ou superior recomendado)
- npm (v9 ou superior)

## Instalação

Clone o repositório e instale as dependências:

```bash
npm install
```

## Como rodar o projeto

### Ambiente de desenvolvimento

```bash
npm run start:dev
```
O servidor será iniciado em `http://localhost:3000`.

### Ambiente de produção

1. Compile o projeto:
   ```bash
   npm run build
   ```
2. Inicie o servidor:
   ```bash
   npm run start:prod
   ```

### Outros comandos úteis

- Rodar o projeto normalmente:
  ```bash
  npm run start
  ```
- Formatar o código:
  ```bash
  npm run format
  ```
- Lint:
  ```bash
  npm run lint
  ```

## Testes

- Testes unitários:
  ```bash
  npm run test
  ```
- Testes e2e:
  ```bash
  npm run test:e2e
  ```
- Cobertura de testes:
  ```bash
  npm run test:cov
  ```

## Banco de Dados

- O projeto utiliza SQLite (arquivo `orders.sqlite` na raiz).
- O TypeORM está configurado para sincronizar automaticamente as entidades.
- Não é necessário criar o banco manualmente, ele será criado ao rodar o projeto.

## Endpoints principais

### Produtos
- `GET /products` — Lista todos os produtos (dados de APIs externas simuladas)

### Pedidos (Orders)
- `POST /orders` — Cria um novo pedido
- `GET /orders` — Lista todos os pedidos

## Estrutura do Projeto

- `src/products` — Módulo de produtos
- `src/orders` — Módulo de pedidos
- `src/app.module.ts` — Módulo principal
- `src/typeorm.config.ts` — Configuração do banco de dados

## Observações

- O projeto já está pronto para deploy em qualquer ambiente Node.js.
- Para customizar a porta, defina a variável de ambiente `PORT`.
- O CORS está habilitado para todas as origens por padrão.

---

> Projeto desenvolvido com NestJS, TypeORM e SQLite.
