# Ecommerce App

Este é um projeto de uma aplicação de e-commerce desenvolvida em React + TypeScript, utilizando Vite como bundler e React Bootstrap para o layout. O objetivo é fornecer uma base para lojas virtuais simples, com funcionalidades de listagem de produtos, carrinho de compras e pedidos.

## Funcionalidades
- Listagem de produtos
- Adição e remoção de produtos no carrinho
- Checkout do carrinho
- Visualização de pedidos

## Tecnologias Utilizadas
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [React Router](https://reactrouter.com/)
- [React Bootstrap](https://react-bootstrap.github.io/)
- [Bootstrap](https://getbootstrap.com/)

## Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 16 ou superior recomendada)
- [npm](https://www.npmjs.com/)

## Instalação

1. **Clone o repositório:**
   ```sh
   git clone <url-do-repositorio>
   cd ecommerce-app
   ```

2. **Instale as dependências:**
   ```sh
   npm install

   ```

## Rodando o Projeto em Ambiente de Desenvolvimento

Execute o comando abaixo para iniciar o servidor de desenvolvimento:

```sh
npm run dev
```

O Vite irá iniciar o projeto e exibir a URL local (geralmente http://localhost:5173). Acesse no navegador para visualizar a aplicação.

## Scripts Disponíveis
- `npm run dev` — Inicia o servidor de desenvolvimento
- `npm run build` — Gera a versão de produção na pasta `dist`
- `npm run preview` — Visualiza a build de produção localmente

## Estrutura de Pastas
```
src/
  api/           # Serviços de API simulados
  assets/        # Imagens e ícones
  components/    # Componentes reutilizáveis (Sidebar, Header, etc)
  config/        # Configurações globais
  context/       # Contextos React (carrinho, alertas)
  layout/        # Layouts principais
  pages/         # Páginas principais (Home, Checkout, Orders)
  services/      # Serviços auxiliares
  types/         # Tipagens TypeScript
```

## Observações
- O projeto utiliza dados simulados (mock) para produtos e pedidos.
- O layout é responsivo e pode ser customizado facilmente.

## Personalização
Você pode adicionar novos produtos, alterar estilos ou integrar com uma API real conforme sua necessidade.

