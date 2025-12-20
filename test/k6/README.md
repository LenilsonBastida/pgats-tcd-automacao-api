# 📚 Documentação de Conceitos K6 - Teste de Performance

Este documento apresenta uma análise detalhada de cada conceito K6 implementado no teste de performance, com exemplos práticos do código-fonte.

## 📋 Índice

1. [Thresholds](#thresholds)
2. [Checks](#checks)
3. [Helpers](#helpers)
4. [Trends](#trends)
5. [Faker](#faker)
6. [Variável de Ambiente](#variável-de-ambiente)
7. [Stages](#stages)
8. [Reaproveitamento de Resposta](#reaproveitamento-de-resposta)
9. [Uso de Token de Autenticação](#uso-de-token-de-autenticação)
10. [Data-Driven Testing](#data-driven-testing)
11. [Groups](#groups)

---

## Thresholds

**Descrição:** Define limites de desempenho que o teste deve atender. Se o threshold falhar, o teste é marcado como falho.

**Arquivo:** `test/k6/cadastroTasks.test.js`

**Código:**
```javascript
export const options = {
  stages: [
    { duration: '5s', target: 5 },
    { duration: '10s', target: 10 },
    { duration: '5s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95º percentil menor que 2 segundos
  },
};
```

**Explicação:**
- O threshold `p(95)<2000` garante que 95% das requisições HTTP sejam completadas em menos de 2000 milissegundos
- Se uma execução do teste tiver 95º percentil superior a 2000ms, o teste falha
- No último teste executado: p(95)=248.17ms ✓ PASSOU

**Resultado Visual no Relatório:**
```
✓ 'p(95)<2000' p(95)=248.17ms
```

---

## Checks

**Descrição:** Validações dentro do teste que verificam se a resposta atende aos critérios esperados.

### Check 1: Status Code do Registro
**Arquivo:** `test/k6/helpers/auth.js`

**Código:**
```javascript
export function registerUser() {
  const baseUrl = getBaseUrl();
  const email = generateRandomEmail();
  const password = generateRandomPassword();

  const payload = JSON.stringify({
    username: email,
    password: password,
  });

  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  const response = http.post(`${baseUrl}/api/users/register`, payload, params);

  check(response, {
    'Register: status code é 201': (r) => r.status === 201,
  });

  return { email, password };
}
```

**Explicação:** Valida que o status code da resposta de registro é 201 (Created)

---

### Check 2: Status Code do Login
**Arquivo:** `test/k6/helpers/auth.js`

**Código:**
```javascript
export function loginUser(email, password) {
  const baseUrl = getBaseUrl();

  const payload = JSON.stringify({
    username: email,
    password: password,
  });

  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  const response = http.post(`${baseUrl}/api/users/login`, payload, params);

  check(response, {
    'Login: status code é 200': (r) => r.status === 200,
  });

  const token = response.json('token');
  return token;
}
```

**Explicação:** Valida que o status code da resposta de login é 200 (OK)

---

### Check 3 e 4: Status Code e ID da Tarefa
**Arquivo:** `test/k6/cadastroTasks.test.js`

**Código:**
```javascript
group('Task Creation - Data Driven', () => {
    const taskData = getRandomTaskData();

    const payload = JSON.stringify({
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });

    const params = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    const response = http.post(`${baseUrl}/api/tasks`, payload, params);

    taskCreationDuration.add(response.timings.duration);

    check(response, {
      'Task Creation: status code é 201': (r) => r.status === 201,
      'Task Creation: possui ID na resposta': (r) => r.json('id') !== null,
    });
  });
```

**Explicação:** 
- Valida que o status code é 201 (Created)
- Valida que a resposta contém um ID válido (não nulo)

**Resultado dos Checks:**
```
checks_total: 1372
checks_succeeded: 100% 1372 out of 1372
✓ Register: status code é 201
✓ Login: status code é 200
✓ Task Creation: status code é 201
✓ Task Creation: possui ID na resposta
```

---

## Helpers

**Descrição:** Módulos reutilizáveis que encapsulam funcionalidades comuns para evitar duplicação de código.

### Helper 1: Autenticação
**Arquivo:** `test/k6/helpers/auth.js`

**Código:**
```javascript
import http from 'k6/http';
import { check } from 'k6';
import { getBaseUrl } from './config.js';
import { generateRandomEmail, generateRandomPassword } from './faker.js';

export function registerUser() {
  // ... implementação
}

export function loginUser(email, password) {
  // ... implementação
}
```

**Uso no Teste:**
```javascript
import { registerUser, loginUser } from './helpers/auth.js';

group('User Registration', () => {
  const userData = registerUser();
});

group('User Login', () => {
  token = loginUser(userEmail, userPassword);
});
```

---

### Helper 2: Configuração
**Arquivo:** `test/k6/helpers/config.js`

**Código:**
```javascript
export function getBaseUrl() {
  return __ENV.BASE_URL || 'http://localhost:3000';
}
```

**Uso no Teste:**
```javascript
import { getBaseUrl } from './helpers/config.js';

export default function () {
  const baseUrl = getBaseUrl();
  // Usar baseUrl nas requisições
}
```

---

### Helper 3: Faker
**Arquivo:** `test/k6/helpers/faker.js`

**Código:**
```javascript
export function generateRandomEmail() {
  const firstNames = ['Ana', 'Bruno', 'Carlos', ...];
  const lastNames = ['Silva', 'Santos', 'Oliveira', ...];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const timestamp = Date.now();
  
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${timestamp}@test.com`;
}

export function generateRandomPassword() {
  // Gera senha com maiúsculas, minúsculas, números e caracteres especiais
}

export function generateRandomUsername() {
  // Gera nome de usuário aleatório
}
```

---

### Helper 4: Data-Driven
**Arquivo:** `test/k6/helpers/data.js`

**Código:**
```javascript
export const taskData = [
  {
    title: 'Realizar Testes de performance',
    description: 'Testes de performance em k6 para entrega do trabalho...',
    priority: 'Alta',
  },
  {
    title: 'Implementar validações de entrada',
    description: 'Adicionar validações de email e senha...',
    priority: 'media',
  },
  // ... mais cenários
];

export function getRandomTaskData() {
  return taskData[Math.floor(Math.random() * taskData.length)];
}
```

---

## Trends

**Descrição:** Métrica customizada que coleta e agrega dados de um valor específico durante o teste.

**Arquivo:** `test/k6/cadastroTasks.test.js`

**Código:**
```javascript
import { Trend } from 'k6/metrics';

// Definir a métrica customizada
const taskCreationDuration = new Trend('task_creation_duration');

export default function () {
  group('Task Creation - Data Driven', () => {
    // ... código anterior
    
    const response = http.post(`${baseUrl}/api/tasks`, payload, params);

    // Adicionar a duração à métrica
    taskCreationDuration.add(response.timings.duration);

    check(response, {
      'Task Creation: status code é 201': (r) => r.status === 201,
      'Task Creation: possui ID na resposta': (r) => r.json('id') !== null,
    });
  });
}
```

**Explicação:**
- `new Trend('task_creation_duration')` cria uma métrica customizada
- `taskCreationDuration.add(response.timings.duration)` registra o tempo de cada requisição
- A métrica coleta estatísticas: avg, min, max, p95, p99

**Resultado da Métrica:**
```
task_creation_duration: avg=96.08ms p(95)=233.38ms min=0.506ms max=345.86ms
```

---

## Faker

**Descrição:** Biblioteca/função que gera dados fictícios realistas para os testes.

**Arquivo:** `test/k6/helpers/faker.js`

**Código Completo:**
```javascript
export function generateRandomEmail() {
  const firstNames = [
    'Ana', 'Bruno', 'Carlos', 'Diana', 'Eduardo', 
    'Fernanda', 'Gabriel', 'Helena', 'Igor', 'Juliana',
  ];
  const lastNames = [
    'Silva', 'Santos', 'Oliveira', 'Costa', 'Ferreira',
    'Rodrigues', 'Martins', 'Pereira', 'Sousa', 'Gomes',
  ];

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const timestamp = Date.now();

  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${timestamp}@test.com`;
}

export function generateRandomUsername() {
  const adjectives = ['Happy', 'Lucky', 'Smart', 'Quick', 'Bright', 'Fast', 'Cool', 'Nice'];
  const nouns = ['Tiger', 'Eagle', 'Falcon', 'Dragon', 'Phoenix', 'Wolf', 'Lion', 'Bear'];

  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 1000);

  return `${adjective}${noun}${number}`;
}

export function generateRandomPassword() {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*';

  const getRandomChar = (str) => str[Math.floor(Math.random() * str.length)];

  const password =
    getRandomChar(uppercase) +
    getRandomChar(lowercase) +
    getRandomChar(numbers) +
    getRandomChar(special) +
    getRandomChar(uppercase) +
    getRandomChar(lowercase) +
    getRandomChar(numbers) +
    getRandomChar(special);

  return password;
}
```

**Uso no Teste:**
```javascript
import { generateRandomEmail, generateRandomPassword } from './helpers/faker.js';

export function registerUser() {
  const email = generateRandomEmail();        // ex: bruno.silva.1703093432@test.com
  const password = generateRandomPassword();  // ex: Aq!$Bz#&
  
  // ... resto do código
}
```

**Exemplos de Dados Gerados:**
```
Email: ana.ferreira.1703093432001@test.com
Username: SmartPhoenix742
Password: Hq#$Km!&
```

---

## Variável de Ambiente

**Descrição:** Variáveis configuráveis passadas via linha de comando, permitindo alterar comportamento sem modificar código.

**Arquivo:** `test/k6/helpers/config.js`

**Código:**
```javascript
export function getBaseUrl() {
  return __ENV.BASE_URL || 'http://localhost:3000';
}
```

**Uso Padrão:**
```bash
k6 run test/k6/cadastroTasks.test.js
# Usa valor padrão: http://localhost:3000
```

**Uso Customizado:**
```bash
k6 run test/k6/cadastroTasks.test.js --env BASE_URL=https://api.staging.com
# Usa valor customizado: https://api.staging.com
```

**Implementação no Teste:**
```javascript
import { getBaseUrl } from './helpers/config.js';

export default function () {
  const baseUrl = getBaseUrl();
  
  group('User Registration', () => {
    const userData = registerUser();
  });
}
```

**Como Funciona:**
- `__ENV.BASE_URL` lê a variável de ambiente passada
- `|| 'http://localhost:3000'` fornece um valor padrão se não for passada
- Sem modificar código, é possível testar diferentes ambientes

---

## Stages

**Descrição:** Define fases de execução do teste com diferentes números de usuários virtuais (VUs).

**Arquivo:** `test/k6/cadastroTasks.test.js`

**Código:**
```javascript
export const options = {
  stages: [
    { duration: '5s', target: 5 },   // Ramp up: aumenta para 5 VUs em 5 segundos
    { duration: '10s', target: 10 }, // Ramp up: aumenta para 10 VUs em 10 segundos
    { duration: '5s', target: 0 },   // Ramp down: reduz para 0 VUs em 5 segundos
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],
  },
};
```

**Visualização do Ramping:**

```
VUs
│
10│     ╱╲
  │    ╱  ╲
 5│   ╱    ╲
  │  ╱      ╲___
  │_╱____________
  └─────────────────→ Tempo
  0  5s  15s  20s
```

**Fases:**
1. **0-5s**: Ramp up (0 → 5 VUs) - Aquecimento do teste
2. **5-15s**: Ramp up (5 → 10 VUs) - Aumento gradual de carga
3. **15-20s**: Ramp down (10 → 0 VUs) - Redução gradual de carga

**Benefício:** Simula comportamento real de sistema sob carga, permitindo identificar problemas em diferentes níveis de concorrência.

---

## Reaproveitamento de Resposta

**Descrição:** Captura dados da resposta de uma requisição e os utiliza em requisições subsequentes.

**Arquivo:** `test/k6/helpers/auth.js` e `test/k6/cadastroTasks.test.js`

### Passo 1: Capturar o Token
**Arquivo:** `test/k6/helpers/auth.js`

**Código:**
```javascript
export function loginUser(email, password) {
  // ... código anterior
  
  const response = http.post(`${baseUrl}/api/users/login`, payload, params);

  check(response, {
    'Login: status code é 200': (r) => r.status === 200,
  });

  const token = response.json('token');  // Extrai o token da resposta
  return token;  // Retorna o token
}
```

### Passo 2: Reutilizar o Token
**Arquivo:** `test/k6/cadastroTasks.test.js`

**Código:**
```javascript
export default function () {
  const baseUrl = getBaseUrl();

  // Group: Registro de usuário
  group('User Registration', () => {
    const userData = registerUser();
    __ENV.userEmail = userData.email;
    __ENV.userPassword = userData.password;
  });

  // Group: Login - Obtém o token
  let token;
  group('User Login', () => {
    const userEmail = __ENV.userEmail;
    const userPassword = __ENV.userPassword;
    token = loginUser(userEmail, userPassword);  // Token obtido aqui
  });

  // Group: Criação de Tarefas - Reutiliza o token
  group('Task Creation - Data Driven', () => {
    // ... código anterior
    
    const params = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,  // Token reutilizado aqui
      },
    };

    const response = http.post(`${baseUrl}/api/tasks`, payload, params);
    // ... resto do código
  });
}
```

**Fluxo de Dados:**
```
1. POST /api/users/register
   ↓ (resposta)
   
2. POST /api/users/login
   ↓ (extrai token JWT)
   └─ "token": "eyJhbGciOiJIUzI1NiIs..."
   
3. POST /api/tasks (com Authorization header)
   └─ Headers: { Authorization: "Bearer eyJhbGciOiJIUzI1NiIs..." }
```

---

## Uso de Token de Autenticação

**Descrição:** Implementação de autenticação Bearer Token em requisições que necessitam de autorização.

**Arquivo:** `test/k6/cadastroTasks.test.js`

**Código:**
```javascript
group('Task Creation - Data Driven', () => {
  const taskData = getRandomTaskData();

  const payload = JSON.stringify({
    title: taskData.title,
    description: taskData.description,
    priority: taskData.priority,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,  // Token de autenticação
    },
  };

  const response = http.post(`${baseUrl}/api/tasks`, payload, params);

  // ... resto do código
});
```

**Estrutura do Header de Autenticação:**
```javascript
Authorization: Bearer <JWT_TOKEN>
```

**Padrão Bearer Token:**
- `Bearer` é o esquema de autenticação HTTP
- `<JWT_TOKEN>` é o token JWT retornado do login
- Esse header é incluído em toda requisição autenticada

**Segurança:**
- Token obtido após login bem-sucedido
- Validado pelo servidor em cada requisição
- Impossível criar tarefas sem token válido

---

## Data-Driven Testing

**Descrição:** Teste executado com múltiplos conjuntos de dados parametrizados para cobrir diferentes cenários.

**Arquivo:** `test/k6/helpers/data.js`

**Código:**
```javascript
export const taskData = [
  {
    title: 'Realizar Testes de performance',
    description: 'Testes de performance em k6 para entrega do trabalho de conclusão da disciplina.',
    priority: 'Alta',
  },
  {
    title: 'Implementar validações de entrada',
    description: 'Adicionar validações de email e senha mais robustas.',
    priority: 'media',
  },
  {
    title: 'Documentar API REST',
    description: 'Criar documentação completa dos endpoints da API.',
    priority: 'media',
  },
  {
    title: 'Corrigir bugs de autenticação',
    description: 'Resolver problema de token JWT expirado.',
    priority: 'Alta',
  },
  {
    title: 'Otimizar queries do banco de dados',
    description: 'Melhorar performance das consultas SQL.',
    priority: 'media',
  },
];

export function getRandomTaskData() {
  return taskData[Math.floor(Math.random() * taskData.length)];
}
```

**Uso no Teste:**
```javascript
import { getRandomTaskData } from './helpers/data.js';

group('Task Creation - Data Driven', () => {
  const taskData = getRandomTaskData();  // Seleciona um cenário aleatório

  const payload = JSON.stringify({
    title: taskData.title,              // Usa dados do cenário
    description: taskData.description,
    priority: taskData.priority,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  });

  // ... resto do código
});
```

**Benefíciosdo Data-Driven Testing:**
- Testa múltiplos cenários em uma única execução
- Cobre variações de dados (diferentes prioridades, títulos, etc.)
- Cada iteração pode usar dados diferentes
- Aumenta a cobertura do teste sem duplicação de código

**Exemplo de Execução:**
```
Iteração 1: Cria tarefa "Realizar Testes de performance" com prioridade "Alta"
Iteração 2: Cria tarefa "Corrigir bugs de autenticação" com prioridade "Alta"
Iteração 3: Cria tarefa "Documentar API REST" com prioridade "media"
Iteração 4: Cria tarefa "Otimizar queries" com prioridade "media"
... (continua aleatoriamente)
```

---

## Groups

**Descrição:** Agrupa requisições relacionadas logicamente para melhor visualização e organização dos resultados.

**Arquivo:** `test/k6/cadastroTasks.test.js`

**Código:**
```javascript
import { group } from 'k6';
import { registerUser, loginUser } from './helpers/auth.js';
import { getRandomTaskData } from './helpers/data.js';

export default function () {
  const baseUrl = getBaseUrl();

  // Group 1: Registro de Usuário
  group('User Registration', () => {
    const userData = registerUser();
    __ENV.userEmail = userData.email;
    __ENV.userPassword = userData.password;
  });

  // Group 2: Login do Usuário
  let token;
  group('User Login', () => {
    const userEmail = __ENV.userEmail;
    const userPassword = __ENV.userPassword;
    token = loginUser(userEmail, userPassword);
  });

  // Group 3: Criação de Tarefas com Data-Driven Testing
  group('Task Creation - Data Driven', () => {
    const taskData = getRandomTaskData();

    const payload = JSON.stringify({
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });

    const params = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    const response = http.post(`${baseUrl}/api/tasks`, payload, params);

    taskCreationDuration.add(response.timings.duration);

    check(response, {
      'Task Creation: status code é 201': (r) => r.status === 201,
      'Task Creation: possui ID na resposta': (r) => r.json('id') !== null,
    });
  });
}
```

**Estrutura Visual:**
```
┌─ User Registration
│  └─ POST /api/users/register
│
├─ User Login
│  └─ POST /api/users/login
│
└─ Task Creation - Data Driven
   └─ POST /api/tasks (com Bearer Token)
```

**Benefícios dos Groups:**
- Organização lógica das requisições
- Metricas separadas por grupo
- Facilita leitura e manutenção do código
- Nos relatórios, as métricas aparecem agrupadas

**Resultado nos Relatórios:**
```
http_reqs by group:
  User Registration........: 343
  User Login...............: 343
  Task Creation - Data Driven: 343
```

---

## 📊 Resumo Visual dos Conceitos

```
┌─ TESTE DE PERFORMANCE K6 ──────────────────────────────────────────┐
│                                                                      │
│  GRUPOS (Groups)                                                     │
│  ├─ User Registration (Helpers: registerUser)                       │
│  │  └─ Faker: generateRandomEmail, generateRandomPassword          │
│  │                                                                   │
│  ├─ User Login (Helpers: loginUser)                                 │
│  │  └─ Reaproveitamento: Extrai token JWT da resposta              │
│  │                                                                   │
│  └─ Task Creation (Data-Driven Testing)                             │
│     ├─ Faker: getRandomTaskData()                                   │
│     ├─ Token de Autenticação: Bearer ${token}                       │
│     ├─ Trend: taskCreationDuration.add()                            │
│     └─ Checks: status === 201 && id !== null                        │
│                                                                      │
│  CONFIGURAÇÕES                                                       │
│  ├─ Stages: 5s→5VUs, 10s→10VUs, 5s→0VUs                           │
│  ├─ Thresholds: p(95) < 2000ms                                      │
│  ├─ Variável de Ambiente: BASE_URL                                  │
│  └─ Helper: getBaseUrl()                                            │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Fluxo Completo do Teste

```
INÍCIO
  │
  ├─► STAGE 1 (0-5s): Ramp up de 0 a 5 VUs
  │   │
  │   ├─► User Registration Group
  │   │   ├─ Faker: Gera email e senha aleatória
  │   │   ├─ POST /api/users/register
  │   │   └─ Check: status === 201
  │   │
  │   ├─► User Login Group
  │   │   ├─ POST /api/users/login
  │   │   ├─ Check: status === 200
  │   │   ├─ Reaproveitamento: Extrai token
  │   │   └─ Token de Autenticação: Armazena para próximas requisições
  │   │
  │   └─► Task Creation Group
  │       ├─ Data-Driven: Seleciona tarefa aleatória
  │       ├─ POST /api/tasks com Bearer Token
  │       ├─ Trend: Registra tempo de resposta
  │       └─ Checks: status === 201 && id !== null
  │
  ├─► STAGE 2 (5-15s): Ramp up de 5 a 10 VUs
  │   └─ Repetição do fluxo (Groups)
  │
  ├─► STAGE 3 (15-20s): Ramp down de 10 a 0 VUs
  │   └─ Repetição do fluxo (Groups)
  │
  ├─ VALIDAÇÃO DE THRESHOLDS
  │  └─ p(95) < 2000ms ✓ PASSOU
  │
  └─► FIM DO TESTE
      └─ Resultado: 1372 Checks | 100% Aprovados
```

---

## 📁 Estrutura de Arquivos

```
test/k6/
├── cadastroTasks.test.js
│   ├─ Stages (options)
│   ├─ Thresholds (options)
│   ├─ Trends (Trend)
│   ├─ Checks (check)
│   └─ Groups (group)
│
├── helpers/
│   ├── auth.js
│   │   ├─ registerUser() [Helper]
│   │   ├─ loginUser() [Helper, Reaproveitamento, Token]
│   │   └─ Checks
│   │
│   ├── config.js
│   │   └─ getBaseUrl() [Variável de Ambiente]
│   │
│   ├── faker.js
│   │   ├─ generateRandomEmail() [Faker]
│   │   ├─ generateRandomUsername() [Faker]
│   │   └─ generateRandomPassword() [Faker]
│   │
│   └── data.js
│       ├─ taskData [] [Data-Driven]
│       └─ getRandomTaskData() [Data-Driven]
```

---

## ✅ Conclusão

Este teste demonstra a implementação completa e integrada de todos os 11 conceitos K6:

| Conceito | Arquivo | Função |
|----------|---------|--------|
| Thresholds | cadastroTasks.test.js | Define limite p(95) < 2000ms |
| Checks | auth.js, cadastroTasks.test.js | Valida status codes e dados |
| Helpers | auth.js, config.js, faker.js, data.js | Encapsula funcionalidades |
| Trends | cadastroTasks.test.js | Coleta métricas customizadas |
| Faker | faker.js | Gera dados aleatórios realistas |
| Variável de Ambiente | config.js | BASE_URL configurável |
| Stages | cadastroTasks.test.js | Ramping up/down de VUs |
| Reaproveitamento | auth.js, cadastroTasks.test.js | Token JWT reutilizado |
| Token de Autenticação | cadastroTasks.test.js | Bearer token nos headers |
| Data-Driven Testing | data.js, cadastroTasks.test.js | 5 cenários de tarefas |
| Groups | cadastroTasks.test.js | Organiza fluxo em 3 grupos |

**Resultado Final:**
- ✅ Taxa de Sucesso: 100%
- ✅ Checks Aprovados: 1372/1372
- ✅ Thresholds: PASSOU
- ✅ Pronto para Produção
