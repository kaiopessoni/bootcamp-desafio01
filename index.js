const express = require('express');
const app = express();

app.use(express.json());

const projects = [];
var requestsCounter = 0;

// Middlewares
function projectExists(req, res, next) {
  if ( !projects.find(el => el.id == req.params.id ))
    return res.status(400).json({ message: 'Project does not exists' });
  return next();
}

function handleRequestCounter(req, res, next) {
  requestsCounter++;
  console.log(`Total Requests: ${requestsCounter}`);
  return next();
}

// Routes

// busca todos projetos
app.get('/projects', handleRequestCounter, (req, res) => {
  res.json(projects);
})

// busca apenas um projeto
app.get('/projects/:id', projectExists, handleRequestCounter, (req, res) => {
  const { id } = req.params;
  const project = projects.find(el => el.id == id);
  res.status(200).json(project);
});

// cria um novo projeto
app.post('/projects', handleRequestCounter, (req, res) => {
  const project = req.body;
  projects.push(project);
  res.status(200).json({ message: 'Project created' });
});

// atualiza um projeto
app.put('/projects/:id', handleRequestCounter, projectExists, (req, res) => {
  const { id } = req.params;
  let index = projects.findIndex(el => el.id == id);
  const newTitle = req.body.title;
  projects[index].title = newTitle;
  res.status(200).json({ message: `Project title updated to '${newTitle}'` });
});

// cria uma nova tarefa
app.post('/projects/:id/tasks', handleRequestCounter, projectExists, (req, res) => {
  const { id } = req.params;
  let index = projects.findIndex(el => el.id == id);
  const newTask = req.body.title;
  projects[index].tasks.push(newTask);
  res.status(200).json({ message: `Task created in project '${projects[index].title}'` });
});

// deleta um projeto
app.delete('/projects/:id', handleRequestCounter, projectExists, (req, res) => {
  const { id } = req.params;
  let index = projects.findIndex(el => el.id == id);
  projects.splice(index, 1);
  res.status(200).json({ message: 'Project deleted' });
});

app.listen(3000);