/**
 * Obtém a URL base da API a partir das variáveis de ambiente
 * @returns {string} URL base da API
 */
export function getBaseUrl() {
  return __ENV.BASE_URL || 'http://localhost:3000';
}
