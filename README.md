# API de Tarefas e Usuários

Esta API permite registrar usuários, realizar login, cadastrar tarefas e consultar tarefas vinculadas ao usuário autenticado. O banco de dados é em memória, ideal para aprendizado de testes e automação de APIs.

## Instalação

1. Clone o repositório ou baixe os arquivos.
2. Instale as dependências:

```bash
npm install express bcryptjs jsonwebtoken swagger-ui-express
```

## Como executar

```bash
node server.js
```

A API estará disponível em `http://localhost:3000`.

## Documentação Swagger

Acesse a documentação interativa em:

```
http://localhost:3000/api-docs
```

## Endpoints principais

### Registro de usuário
- `POST /api/users/register`
  - Body: `{ "username": "string", "password": "string" }`

### Login
- `POST /api/users/login`
  - Body: `{ "username": "string", "password": "string" }`
  - Retorna: `{ "token": "..." }`


### Cadastro de tarefa
- `POST /api/tasks` (requer token Bearer)
  - Body: `{ "title": "string", "description": "string", "priority": "baixa|media|alta", "dueDate": "YYYY-MM-DDTHH:mm:ssZ" }`

### Consulta de tarefas
- `GET /api/tasks` (requer token Bearer)

### Alteração de tarefa
- `PUT /api/tasks/:id` (requer token Bearer)
  - Body: `{ "title": "string", "description": "string", "priority": "baixa|media|alta", "dueDate": "YYYY-MM-DDTHH:mm:ssZ" }`
  - Exemplo: `PUT /api/tasks/1`

### Remoção de tarefa
- `DELETE /api/tasks/:id` (requer token Bearer)
  - Exemplo: `DELETE /api/tasks/1`

## Regras de negócio
- Não é permitido registrar usuários duplicados.
- Login exige usuário e senha.
- Cada tarefa é vinculada ao usuário autenticado.
- Tarefas de prioridade "alta" não podem ter prazo superior a 7 dias da data de criação.

## Testes
Para testar com Supertest, importe o `app.js` diretamente em seus testes.

---

API desenvolvida para fins educacionais e automação de testes.
