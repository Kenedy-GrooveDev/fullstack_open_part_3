require('dotenv').config()
const express = require("express");
const Person = require('./models/person')
const morgan = require("morgan");

const app = express();

app.use(express.static("dist"))
app.use(express.json());
morgan.token('body', req => JSON.stringify(req.body))
app.use(
  morgan(":method :url :status :res[content-length] :response-time ms - :body")
);

app.get("/api/persons", (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
});

app.get("/api/info", (request, response) => {
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
    `);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);
  person ? response.json(person) : response.status(404).end();
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

const generateIDs = () => {
  const id = Math.floor(Math.random() * 100000000);
  return id;
};

app.post("/api/persons/", (request, response) => {
  const body = request.body;

  const person = {
    id: generateIDs(),
    name: body.name,
    number: body.number,
  };

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing",
    });
  }

  const name = persons.find((person) => person.name === body.name);

  if (name) {
    return response.status(409).json({
      error: "name must be unique",
    });
  }

  persons = persons.concat(person);

  response.json(person);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
