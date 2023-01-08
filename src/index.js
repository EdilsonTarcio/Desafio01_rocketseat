const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const app = express();

app.use(cors());
app.use(express.json());
const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
}

app.post('/users', (request, response) => {
  const {nome, username} = request
  const usersAlreadyExists = users.some((users) => users.nome === nome); // 3 iguais mesmo valor e mesmo tipo 
  if(usersAlreadyExists){ // se encontrar um cusers
    return response.status(400).json({error: "Usuario já existe!"})
  }
  users.push({ 
    id: uuidv4(),
    nome,
    username,
    todos: []
  });
  return response.status(200).send()
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;