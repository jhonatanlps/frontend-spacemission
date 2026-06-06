SpaceMission — Frontend

Integrantes:
- Bruno Takaya — RM: 554986
- Iury Cardoso — RM: 558050
- Jhonatan Lopes — RM: 559174 

Aplicativo frontend em React Native / Expo para visualizar e gerir sistemas, sensores e alertas da missão SpaceMission.

## Visão geral

Este repositório contém a interface móvel/web criada com Expo e React Native que consome uma API para listar sistemas, sensores e alertas, além de permitir a criação de sistemas.

## Principais features

- Listagem de sistemas e detalhes
- Criação de novos sistemas
- Visualização de alertas e status dos sensores

## Tecnologias

- React Native + Expo
- TypeScript
- Axios para consumo de API
- React Navigation (stack)

## Requisitos

- Node.js (recomendado v18+)
- npm ou yarn
- Expo CLI (opcional para fluxo local)

## Instalação

Clone o repositório e instale dependências:

```bash
git clone <repo-url>
cd frontend-spacemission
npm install
```

## Executando o projeto

Comandos disponíveis (definidos em `package.json`):

```bash
npm run start    # expo start
npm run android  # abrir no Android (dispositivo/emulador)
npm run ios      # abrir no iOS (macOS + simulador)
npm run web      # rodar como web
```

## Estrutura do projeto (principais arquivos)

- [App.tsx](App.tsx) — ponto de entrada da aplicação
- [index.ts](index.ts)
- [src/screens](src/screens) — telas da aplicação
  - [CriarSistemasScreen.tsx](src/screens/CriarSistemasScreen.tsx)
  - [HomeScreen.tsx](src/screens/HomeScreen.tsx)
  - [MostrarAlertasScreen.tsx](src/screens/MostrarAlertasScreen.tsx)
  - [MostrarSistemasScreen.tsx](src/screens/MostrarSistemasScreen.tsx)
- [src/services](src/services) — chamadas à API e lógica de integração
  - [api.ts](src/services/api.ts)
  - [alertaService.ts](src/services/alertaService.ts)
  - [sensorService.ts](src/services/sensorService.ts)
  - [sistemasService.ts](src/services/sistemasService.ts)
- [src/interfaces](src/interfaces) — tipos/intefaces TypeScript

## Serviços / API

As integrações com backend ficam em `src/services` e usam `axios` via o cliente em [src/services/api.ts](src/services/api.ts). Verifique os arquivos de serviço para ver os endpoints consumidos.

## Desenvolvimento

- Adicione novas telas em `src/screens` e componentes em `src/components` (crie se necessário).
- Use TypeScript para tipagem das props e respostas da API (veja `src/interfaces`).



