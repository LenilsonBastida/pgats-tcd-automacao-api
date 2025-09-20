# API de Tarefas e Usuários

Esta API permite registrar usuários, realizar login, cadastrar tarefas e consultar tarefas vinculadas ao usuário autenticado. O banco de dados é em memória, ideal para aprendizado de testes e automação de APIs.


## API GraphQL

Esta aplicação também expõe uma interface GraphQL utilizando Apollo Server.

### Como executar a API GraphQL

1. Instale as dependências necessárias:
   ```bash
   npm install apollo-server-express express graphql
   ```
2. Execute o servidor GraphQL:
   ```bash
   node graphql/server.js
   ```
3. Acesse o playground em: [http://localhost:4000/graphql](http://localhost:4000/graphql)

### Estrutura da pasta `graphql`
- `app.js`: Configuração do ApolloServer e Express
- `server.js`: Inicialização do servidor
- `schema.js`: Definição do schema GraphQL
- `resolvers.js`: Implementação dos resolvers

Para testes automatizados locais, importe o `app` de `graphql/app.js`.
Para testes externos, certifique-se de que o servidor GraphQL está rodando em `http://localhost:4000`.


## Instalação

1. Clone o repositório ou baixe os arquivos.
2. Instale as dependências:
  ```bash
  npm install express bcryptjs jsonwebtoken swagger-ui-express apollo-server-express graphql
  ```


## Como executar

Para rodar a API REST:
```bash
node server.js
```
A API estará disponível em `http://localhost:3000`.

Para rodar a API GraphQL:
```bash
node graphql/server.js
```
A API GraphQL estará disponível em `http://localhost:4000/graphql`.

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


## Testes Automatizados

O projeto possui testes automatizados para os principais endpoints REST e GraphQL, incluindo cenários negativos (autenticação, erros do service, id inexistente), utilizando Mocha, Chai, Supertest e Sinon.

Para rodar todos os testes locais:
```bash
npm test
```

Para rodar testes externos (API REST e GraphQL via HTTP), certifique-se de que os servidores estejam rodando:
```bash
npm run test-external
npm run test-graphql-external
```


## Integração Contínua (CI)

Ao realizar push ou pull request para o branch `main`, uma pipeline do GitHub Actions executa automaticamente todos os testes do projeto (REST, GraphQL, locais e externos). O arquivo de configuração está em `.github/workflows/nodejs-ci.yml`.

## Exemplos de respostas

### Sucesso
- Cadastro de tarefa: status 201, retorna objeto da tarefa criada
- Atualização de tarefa: status 200, retorna objeto atualizado
- Remoção de tarefa: status 200, retorna objeto removido

### Erros comuns
- 400: Dados inválidos ou erro do service
- 401: Token não informado ou inválido
- 404: Tarefa não encontrada

## Observações
- O banco de dados é em memória, reiniciado a cada execução.
- O Swagger foi atualizado para incluir todos os métodos (POST, GET, PUT, DELETE) de tarefas.
- Cada tarefa é vinculada ao usuário autenticado.
- Tarefas de prioridade "alta" não podem ter prazo superior a 7 dias da data de criação.


## Testes
Para testar APIs REST e GraphQL localmente, importe o `app.js` diretamente em seus testes.
Para testes externos, garanta que os servidores estejam rodando nas portas padrão (`3000` para REST, `4000` para GraphQL).

---

API desenvolvida para fins educacionais e automação de testes.

# API GraphQL

Esta API GraphQL expõe os serviços de Task e User utilizando Apollo Server e Express.

## Como executar

1. Instale as dependências:
  ```bash
  npm install apollo-server-express express graphql
  ```
2. Execute o servidor GraphQL:
  ```bash
  node graphql/server.js
  ```
3. Acesse o playground em: [http://localhost:4000/graphql](http://localhost:4000/graphql)

## Estrutura
- `graphql/app.js`: Configuração do ApolloServer e Express
- `graphql/server.js`: Inicialização do servidor
- `graphql/schema.js`: Definição do schema GraphQL
- `graphql/resolvers.js`: Implementação dos resolvers

## Testes
Para testar a API GraphQL com Supertest, importe o `app` de `graphql/app.js`.
