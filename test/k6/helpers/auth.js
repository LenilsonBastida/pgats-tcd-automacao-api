import http from 'k6/http';
import { check } from 'k6';
import { getBaseUrl } from './config.js';
import { generateRandomEmail, generateRandomPassword } from './faker.js';

/**
 * Registra um novo usuário na API
 * @returns {Object} Objeto contendo email e password do usuário criado
 */
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

/**
 * Faz login de um usuário e retorna o token JWT
 * @param {string} email - Email do usuário
 * @param {string} password - Senha do usuário
 * @returns {string} Token JWT para autenticação
 */
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
