# E-commerce

Este repositório contém uma solução completa para um sistema de e-commerce, organizada em três principais módulos:

- **backend/**: API RESTful desenvolvida com NestJS (Node.js)
- **ecommerce-app/**: Aplicação web desenvolvida com React + Vite
- **ecommerce_mobile_app/**: Aplicativo mobile multiplataforma desenvolvido com Flutter

---

## Arquitetura Geral

O projeto segue uma arquitetura de microsserviços desacoplados, onde cada parte pode ser desenvolvida, testada e implantada de forma independente. A comunicação entre frontend/mobile e backend é feita via API REST.

### 1. Backend (NestJS)
- **Framework:** NestJS, por sua robustez, modularidade e suporte nativo a TypeScript.
- **Banco de Dados:** SQLite (pode ser facilmente trocado por outro via TypeORM).
- **Organização:**
  - Separação por módulos (ex: `orders`, `products`), cada um com seus controllers, services, entidades e DTOs.
  - Uso de TypeORM para mapeamento objeto-relacional.
  - Testes unitários e de integração com Jest.
- **Decisões:**
  - NestJS foi escolhido pela escalabilidade e facilidade de manutenção.
  - TypeORM permite flexibilidade para trocar o banco de dados futuramente.

### 2. Frontend Web (React + Vite)
- **Framework:** React, utilizando Vite para build rápido e experiência moderna de desenvolvimento.
- **Estilização:** TailwindCSS para produtividade e consistência visual.
- **Organização:**
  - Separação por componentes reutilizáveis, páginas, serviços de API e contexto global para estado.
  - Integração com backend via serviços REST.
- **Decisões:**
  - Vite foi escolhido pela performance superior ao Webpack.
  - TailwindCSS acelera o desenvolvimento e facilita a manutenção do design.

### 3. Mobile (Flutter)
- **Framework:** Flutter, para desenvolvimento multiplataforma (Android, iOS, Web, Desktop).
- **Organização:**
  - Separação por controllers, models, screens, widgets e estado.
  - Consumo da API REST do backend.
- **Decisões:**
  - Flutter permite um único código base para múltiplas plataformas.
  - Organização modular facilita a escalabilidade e manutenção.

---

## Integração entre as partes
- O backend expõe endpoints REST consumidos tanto pelo frontend web quanto pelo aplicativo mobile.
- O banco de dados é centralizado no backend, garantindo integridade e consistência dos dados.
- Cada módulo possui seu próprio README detalhado com instruções específicas.

---

## Como rodar o projeto
Consulte os READMEs de cada pasta (`backend/`, `ecommerce-app/`, `ecommerce_mobile_app/`) para instruções detalhadas de instalação, configuração e execução.

---

## Decisões Gerais
- **Monorepo:** Facilita o versionamento, integração e compartilhamento de código entre as partes.
- **Separação de responsabilidades:** Cada módulo é independente, facilitando manutenção e evolução.
- **Testes:** Cada parte possui testes automatizados para garantir qualidade e confiabilidade.
