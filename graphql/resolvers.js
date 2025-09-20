const taskService = require('../service/taskService');
const userService = require('../service/userService');

const resolvers = {
  Query: {
    tasks: () => taskService.getAllTasks(),
    task: (_, { id }) => taskService.getTaskById(id),
    users: () => userService.getAllUsers(),
    user: (_, { id }) => userService.getUserById(id),
  },
  Mutation: {
    createTask: (_, { title }) => taskService.createTask(
      null, // userId
      title,
      '', // description
      'baixa', // priority
      new Date().toISOString() // dueDate
    ),
    updateTask: (_, { id, completed }) => taskService.updateTask(id, completed),
    deleteTask: (_, { id }) => taskService.deleteTask(id),
    createUser: (_, { name, email }) => userService.createUser(name, email),
    updateUser: (_, { id, name, email }) => userService.updateUser(id, name, email),
    deleteUser: (_, { id }) => userService.deleteUser(id),
  },
};

module.exports = resolvers;