const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const app = express();

app.use(cors());
app.use(express.json());
const users = [];

function checksExistsUserAccount(request, response, next) {
  const {username} = request.headers // recebe o usuario do header
  const user = users.find(user => user.username === username) //busca pelo usuario no arrei

  if(!user){
    return response.status(404).json({ error: 'Usuario não encontrado'})
  }
  request.user = user //passa o usuario para a request 
  return next()
}

app.post('/users', (request, response) => {
  const {name, username} = request.body //recebe os dados no corpo da requisição
  const usersAlreadyExists = users.find((users) => users.username === username); // verifica se usuario já existe 
  if(usersAlreadyExists){ // se encontrar um usuario com o mesmo username
    return response.status(400).json({error: "Usuario já existe!"})
  }
 
  users.push({  // Cria um novo usuario
    id: uuidv4(),
    name,
    username,
    todos: []
  });
  return response.status(201).json(users) //retorna o status 201 e o json com os dados do usuario
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const {user} = request //recebe o usuario de dentro da request
  return response.json(user.todos) //retorna o atributo todo[] do usuario
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const {user} = request //recebe o usuario de dentro da request
  const {title, deadline} = request.body
  
  const todo = { 
    id: uuidv4(), // precisa ser um uuid
    title,
    done: false, //validador se foi executado
    deadline: new Date(deadline), //recebe a data como uma string e formata para uma data valida
    created_at: new Date()
  }
  user.todos.push(todo)
  return response.status(201).json(todo)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {user} = request //recebe o usuario de dentro da request
  const {title, deadline} = request.body
  const {id} = request.params // recebendo o id pela rota da requisição (get)

  const todo = user.todos.find(todo => todo.id === id) // find reflete uma referencia do objeto original e não o objeto

  if(!todo){
    return response.status(404).json({error: 'Todo não encontrado'})
  }
  todo.title = title
  todo.deadline = new Date(deadline)

  return response.json(todo)
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const {user} = request //recebe o usuario de dentro da request
  const {id} = request.params // recebendo o id pela rota da requisição (get)
  const todo = user.todos.find(todo => todo.id === id) // find reflete uma referencia do objeto original e não o objeto

  if(!todo){
    return response.status(404).json({error: 'Todo não encontrado'})
  }

  todo.done = true

  return response.json(todo)
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {user} = request //recebe o usuario de dentro da request
  const {id} = request.params // recebendo o id pela rota da requisição (get)
  const todoIndex = user.todos.findIndex(todo => todo.id === id) // findIndex retorna a posição do objeto dentro do arrey se não existir retorna -1

  if(todoIndex === -1){
    return response.status(404).json({error: 'Todo não encontrado'})
  }

  user.todos.splice(todoIndex, 1) // metodo splice recebe dois parametros um da posição dentro do arrei para começar a apagar e as posições depois dele
  return response.status(204).json()
});

module.exports = app;