import express from 'express';
import mongoose from 'mongoose';

import {
  loginValidation,
  registerValidation,
} from './src/validations/auth-validation.js';
import checkAuth from './src/middlewares/checkAuth.js';
import { getProfile, register, login } from './src/services/UserService.js';
import {
  createTodo,
  getAllTodo,
  getTodoById,
  removeTodoById,
  updateTodoById,
} from './src/services/TodoListService.js';
import { todoItemValidation } from './src/validations/todo-validation.js';
import { config } from './src/utils/config.js';
import checkAccessTodo from './src/middlewares/checkAccessTodo.js';
mongoose
  .connect(
    `mongodb+srv://${config.mongoUrl}@cluster0.5z0vtiz.mongodb.net/todo?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  )
  .then(() => {
    console.log('DB connected');
  })
  .catch((err) => console.log('DB Error', err));

const app = express();

app.use(express.json());

//AUTH
app.post('/auth/register', registerValidation, register);

app.post('/auth/login', loginValidation, login);

app.get('/auth/profile', checkAuth, getProfile);

//TODO list

app.post('/todo', checkAuth, todoItemValidation, createTodo);
app.get('/todo', checkAuth, getAllTodo);
app.get('/todo/:id', checkAuth, getTodoById);
app.delete('/todo/:id', checkAuth, checkAccessTodo, removeTodoById);
app.patch(
  '/todo/:id',
  checkAuth,
  todoItemValidation,
  checkAccessTodo,
  updateTodoById,
);

app.listen(4444, (err) => {
  if (err) {
    return console.error();
  }

  console.log('OK ');
});
