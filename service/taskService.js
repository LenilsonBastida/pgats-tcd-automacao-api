const { tasks } = require('../model/data');

class TaskService {
  static createTask(userId, title, description, priority, dueDate) {
    const createdAt = new Date();
    if (priority === 'alta') {
      const maxDueDate = new Date(createdAt);
      maxDueDate.setDate(maxDueDate.getDate() + 7);
      if (new Date(dueDate) > maxDueDate) {
        throw new Error('Tarefas de prioridade alta não podem ter prazo superior a 7 dias');
      }
    }
    const task = {
      id: tasks.length + 1,
      userId,
      title,
      description,
      priority,
      dueDate,
      createdAt
    };
    tasks.push(task);
    return task;
  }

  static getTasksByUser(userId) {
    return tasks.filter(t => t.userId === userId);
  }
}

module.exports = TaskService;
