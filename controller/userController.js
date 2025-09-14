const express = require('express');
const UserService = require('../service/userService');
const jwt = require('jsonwebtoken');
const router = express.Router();

const SECRET = 'supersecret'; // Para fins de aprendizado

// Registro de usuário
router.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Usuário e senha são obrigatórios' });
  }
  try {
    const user = UserService.register(username, password);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Usuário e senha são obrigatórios' });
  }
  try {
    const user = UserService.login(username, password);
    const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

module.exports = router;
