const express = require("express");

const server = express();

server.use(express.json());

const projects = [];
let numberOfRequests = 0;

// middleware utilizado em todas rotas que recebem o Id do projeto.
function checkProjectsExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id === id);

  if (!project) {
    return res.status(400).json({ error: "Não existe projeto no array" });
  }

  return next();
}

// conta o número de requesições
server.use((req, res, next) => {
  numberOfRequests++;
  console.log(`Número de requisições: ${numberOfRequests}`);

  next();
});

// Post/projects = cria um projeto com (id: "1", title: " Novo projeto, tasks []")
server.post("/projects", (req, res) => {
  const { id, title } = req.body;

    const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(project);
});

// /projects = Rota que lista todos os projetos
server.get("/projects", (req, res) => {
  return res.json(projects);
});

// /projects/:id = Rota que altera o titulo com base no Id.
server.put("/projects/:id", checkProjectsExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id === id);

  project.title = title;

  return res.json(project);
});

// /projects/:id = Rota para apagar um projeto com base no Id.
server.delete("/projects/:id", checkProjectsExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id === id);

  projects.splice(projectIndex, 1);

  return res.json();
});

// /projects/:id/tasks = Rota altera uma tarefa com base no Id.
server.post("/projects/:id/tasks", checkProjectsExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id === id);

  project.tasks.push(title);

  return res.json(project);
});

server.listen(3333);
