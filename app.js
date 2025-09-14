const express = require('express');
const userRoutes = require('./controller/userController');
const taskRoutes = require('./controller/taskController');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

module.exports = app;
