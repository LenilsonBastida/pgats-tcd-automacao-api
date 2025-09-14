const express = require('express');
const TaskService = require('../service/taskService');
const jwt = require('jsonwebtoken');
const router = express.Router();

const SECRET = 'supersecret';

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token não informado' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
}

// Cadastro de tarefa
router.post('/', authMiddleware, (req, res) => {
  const { title, description, priority, dueDate } = req.body;
  if (!title || !priority || !dueDate) {
    return res.status(400).json({ error: 'Título, prioridade e prazo são obrigatórios' });
  }
  try {
    const task = TaskService.createTask(req.userId, title, description, priority, dueDate);
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Consulta de tarefas do usuário
router.get('/', authMiddleware, (req, res) => {
  const tasks = TaskService.getTasksByUser(req.userId);
  res.json(tasks);
});

module.exports = router;
