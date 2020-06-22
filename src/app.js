const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid Repository ID" });
  }

  return next();
}

app.get("/repositories", (request, response) => {
  // List all projects-repos
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  // Save a new project-repo - Receives on request: title, url, techs
  const { title, url, techs } = request.body;
  let likes = 0;
  const repository = { id: uuid(), title, url, techs, likes };
  repositories.push(repository);
  return response.status(200).json(repository);
});

app.put("/repositories/:id", validateRepositoryId, (request, response) => {
  // Update a project-repo
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository Not Found" });
  }

  likes = repositories[repositoryIndex].likes;
  const repository = { id, title, url, techs, likes };
  repositories[repositoryIndex] = repository;
  return response.status(200).json(repository);
});

app.delete("/repositories/:id", validateRepositoryId, (request, response) => {
  // Destroy a project-repo
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository Not Found" });
  }

  repositories.splice(repositoryIndex, 1);
  return response.status(204).send();
});

app.post(
  "/repositories/:id/like",
  validateRepositoryId,
  (request, response) => {
    // Crate a Like on a repo
    const { id } = request.params;
    const repositoryIndex = repositories.findIndex(
      (repository) => repository.id === id
    );

    if (repositoryIndex < 0) {
      return response.status(400).json({ error: "Repository Not Found" });
    }

    repositories[repositoryIndex].likes += 1;

    return response.status(200).json(repositories[repositoryIndex]);
  }
);

module.exports = app;
