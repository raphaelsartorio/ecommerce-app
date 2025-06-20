# Ecommerce Mobile App

Este é um aplicativo mobile de e-commerce desenvolvido em Flutter. Ele permite aos usuários navegar por produtos, adicionar itens ao carrinho, finalizar compras e visualizar pedidos realizados.

## Funcionalidades
- Listagem de produtos
- Adição e remoção de produtos do carrinho
- Checkout com formulário de usuário
- Envio de pedidos para uma API REST
- Visualização de pedidos realizados

## Pré-requisitos
- [Flutter](https://docs.flutter.dev/get-started/install) (versão 3.x ou superior)
- [Dart](https://dart.dev/get-dart)
- Emulador Android/iOS ou dispositivo físico
- Backend rodando em `http://10.0.2.2:3000` (pode ser um servidor Node.js, Express, etc.)

## Instalação
1. **Clone o repositório:**
   ```sh
   git clone <url-do-repositorio>
   cd ecommerce_mobile_app
   ```
2. **Instale as dependências:**
   ```sh
   flutter pub get
   ```
3. **Configure o backend:**
   - Certifique-se de que o backend está rodando em `http://10.0.2.2:3000`.
   - O app consome endpoints como `/orders` para finalizar pedidos.

## Executando o App
1. **Abra um emulador ou conecte um dispositivo físico.**
2. **Execute o app:**
   ```sh
   flutter run
   ```

## Estrutura de Pastas
- `lib/`
  - `models/` — Modelos de dados (ex: Produto, Item do Carrinho)
  - `screens/` — Telas principais do app (checkout, pedidos, etc.)
  - `state/` — Gerenciamento de estado (Provider)
  - `widgets/` — Componentes reutilizáveis
- `public/` — Imagens públicas (ex: imagem padrão de produto)

## Observações
- O endereço `10.0.2.2` é utilizado para acessar o localhost da máquina hospedeira a partir do emulador Android.
- Para rodar no iOS, ajuste o endereço do backend para o IP da sua máquina na rede local.
- Certifique-se de que o backend aceite requisições CORS, se necessário.

## Dependências Principais
- [provider](https://pub.dev/packages/provider)
- [http](https://pub.dev/packages/http)
- [flutter](https://flutter.dev)

## Personalização
- Para alterar o endpoint da API, edite as URLs em `lib/screens/checkout_screen.dart` e `lib/screens/orders_screen.dart`.
- Para adicionar produtos, adapte o backend ou modifique os dados mockados.

## Licença
Este projeto é apenas para fins educacionais.
