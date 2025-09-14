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

  static updateTask(taskId, updates) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) {
      throw new Error('Tarefa não encontrada');
    }
    // Atualiza apenas os campos fornecidos em updates
    Object.keys(updates).forEach(key => {
      if (key !== 'id' && key in task) {
        task[key] = updates[key];
      }
    });
    return task;
  }

  static deleteTask(taskId) {
    const index = tasks.findIndex(t => t.id === taskId);
    if (index === -1) {
      throw new Error('Tarefa não encontrada');
    }
    const deleted = tasks.splice(index, 1);
    return deleted[0];
  }
}

module.exports = TaskService;
