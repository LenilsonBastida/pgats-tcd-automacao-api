const { users } = require('../model/data');
const bcrypt = require('bcryptjs');

class UserService {
  static getAllUsers() {
    return Array.isArray(users) ? users : [];
  }
  static register(username, password) {
    if (users.find(u => u.username === username)) {
      throw new Error('Usuário já existe');
    }
    const hashedPassword = bcrypt.hashSync(password, 8);
    const user = { id: users.length + 1, username, password: hashedPassword };
    users.push(user);
    return { id: user.id, username: user.username };
  }

  static login(username, password) {
    const user = users.find(u => u.username === username);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new Error('Credenciais inválidas');
    }
    return { id: user.id, username: user.username };
  }
}

module.exports = UserService;
