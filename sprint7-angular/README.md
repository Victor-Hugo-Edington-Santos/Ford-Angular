# Desafio Sprint 07 - Angular (Ford Dashboard)

## Como rodar

### 1. Back-end (API)
Na pasta `Api-Sprint7-main`:
```
npm install
npm start
```
A API sobe em **http://localhost:3001**.

### 2. Front-end (Angular)
Na pasta `sprint7-angular` (este projeto):
```
npm install
npm start
```
Acesse **http://localhost:4200**.

## Login
- Usuário: `admin`
- Senha: `123456`

## Estrutura
- `login` — tela de login (Ação 1), autentica via `POST /login`
- `home` — tela de boas-vindas com link para o dashboard e logout (Ação 2)
- `dashboard` — busca de veículo por modelo (`GET /vehicles`), cartões de total de vendas/conectados/update de software, imagem do veículo e tabela de dados por VIN (`POST /vehicleData`) (Ação 3)
- `AuthGuard` protege as rotas `home` e `dashboard`
- RxJS: `pluck` (service), `map`, `debounceTime`, `distinctUntilChanged`, `filter`, `switchMap` e `catchError` na busca reativa por código VIN
- Home: sidebar retrátil pelo ícone ☰ (Figura 2); Dashboard: seleção de modelo em dropdown (Figura 3)

## Observação sobre a porta da API
O PDF do desafio cita `localhost:3000`, mas o `api.js` fornecido está configurado para rodar em `localhost:3001` (`app.listen(3001, ...)`). O front-end já aponta para a 3001 em `src/environments/environment.ts`.
