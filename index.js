const express = require("express");
const app = express();
const logger = require("./loggerMiddleware.js");
const cors = require("cors");

app.use(cors());

app.use(express.json());

app.use(logger);

// const http = require("http");

let notes = [
  {
    id: 1,
    content: "Me tengo que suscribir a @midudev en Youtube",
    date: "2023-02-06",
    important: true,
  },
  {
    id: 2,
    content: "Tengo que estudiar las clases de fullstack bootcamp",
    date: "2023-02-06",
    important: false,
  },
  {
    id: 3,
    content: "Repasar los retos",
    date: "2023-02-06",
    important: true,
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World</h1>");
});

app.get("/api/notes", (request, response) => {
  response.json(notes);
});

app.get("/api/notes/:id", (request, response) => {
  // Cuando ponemos params tenemos todos los objetos de la ruta dinámica
  const id = Number(request.params.id);
  //Con el .find buscamos en un array de elementos la función que le pasamos como parametro
  const note = notes.find((note) => note.id === id);

  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }

  response.json(note);
});

app.delete("/api/notes/:id", (response, request) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id === id);
  response.status(204).end();
});

app.post("/api/notes", (request, response) => {
  const note = request.body;

  if (!note || !note.content) {
    return response.status(400).json({
      error: "note.content is missing",
    });
  }

  const ids = notes.map((note) => note.id);
  const maxId = Math.max(...ids);

  const newNote = {
    id: maxId + 1,
    content: note.content,
    important: typeof note.important !== "undefined" ? note.important : false,
    date: new Date().toISOString(),
  };

  notes = notes.concat(newNote);

  response.json(newNote);
});

// MANERA ANTIGUA DE LEVANTAR UN SERVIDOR

// const app = http.createServer((request, response) => {
//   response.writeHead(200, { "Content-Type": "aplication/json" });
//   response.end(JSON.stringify(notes));
// });

app.use((request, response) => {
  response.status(404).json({
    error: "Not found",
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
