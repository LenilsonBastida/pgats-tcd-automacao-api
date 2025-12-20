/**
 * Dados parametrizados para Data-Driven Testing
 * Diferentes cenários de tarefas para testar
 */
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

/**
 * Obtém um dado aleatório do array de tarefas
 * @returns {Object} Objeto contendo title, description e priority
 */
export function getRandomTaskData() {
  return taskData[Math.floor(Math.random() * taskData.length)];
}
