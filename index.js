const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(express.json());
app.use(morgan("tiny"));

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
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

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
