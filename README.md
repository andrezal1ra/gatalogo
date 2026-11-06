# 🐱 Gatálogo

Aplicativo mobile desenvolvido com **React Native, Expo e TypeScript**, que consome dados reais da [TheCatAPI](https://thecatapi.com/) e exibe um catálogo interativo de raças de gatos.

## Funcionalidades

- Listagem de raças obtidas da API REST (`GET https://api.thecatapi.com/v1/breeds`)
- Fotos, nome e país de origem
- Busca por raça, país ou temperamento
- Filtro por país de origem
- Tela de detalhes: descrição, temperamento, expectativa de vida e características
- Indicadores de carregamento, mensagens de erro, opção de tentar novamente e atualização por gesto
- Layout adaptável com duas colunas e interface em português

## Tecnologias

React Native · Expo SDK 54 · TypeScript · TheCatAPI

## Como executar

Requisitos: Node.js LTS instalado e aplicativo Expo Go no celular (ou emulador configurado).

1. Abra um terminal nesta pasta e instale as dependências:

   `npm install`

2. Inicie o Expo:

   `npx expo start --tunnel`

3. Abra o Expo Go e escaneie o QR Code exibido no terminal.

> O túnel pode solicitar a instalação do pacote `@expo/ngrok`. Se acontecer, confirme. Também é possível executar `npx expo start` para usar a rede local.

## API

Endpoint: `https://api.thecatapi.com/v1/breeds` (requisição GET). Não é necessário cadastrar uma chave para este exemplo de uso público. As imagens são carregadas a partir dos endereços retornados pela API.

## Estrutura

- `App.tsx` — interface, pesquisa, filtros, listagem e detalhes
- `src/api.ts` — tipagem e integração com a API
- `app.json` — configuração do Expo
- `package.json` — dependências e scripts

## Autor

Andrezo Finin

## Observações

O projeto requer conexão à internet. A disponibilidade de imagens depende do catálogo da API. As descrições da API são exibidas no idioma original fornecido pelo serviço.
