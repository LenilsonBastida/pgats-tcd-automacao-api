import http from 'k6/http';
import { check, group } from 'k6';
import { Trend } from 'k6/metrics';
import { getBaseUrl } from './helpers/config.js';
import { registerUser, loginUser } from './helpers/auth.js';
import { getRandomTaskData } from './helpers/data.js';

// Configuração do teste com Stages para ramping up/down
export const options = {
  stages: [
    { duration: '5s', target: 5 }, // Ramp up para 5 VUs em 5 segundos
    { duration: '10s', target: 10 }, // Ramp up para 10 VUs em 10 segundos
    { duration: '5s', target: 0 }, // Ramp down para 0 VUs em 5 segundos
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95º percentil menor que 2 segundos
  },
};

// Métrica customizada para monitorar tempo de resposta do POST /api/tasks
const taskCreationDuration = new Trend('task_creation_duration');

// Função padrão para o teste
export default function () {
  const baseUrl = getBaseUrl();

  // Group: Registro de usuário
  group('User Registration', () => {
    const userData = registerUser();
    __ENV.userEmail = userData.email;
    __ENV.userPassword = userData.password;
  });

  // Group: Login
  let token;
  group('User Login', () => {
    const userEmail = __ENV.userEmail;
    const userPassword = __ENV.userPassword;
    token = loginUser(userEmail, userPassword);
  });

  // Group: Cadastro de tarefas com Data-Driven Testing
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

    // Registra a duração da requisição na métrica customizada
    taskCreationDuration.add(response.timings.duration);

    check(response, {
      'Task Creation: status code é 201': (r) => r.status === 201,
      'Task Creation: possui ID na resposta': (r) => r.json('id') !== null,
    });
  });
}
