require("dotenv").config();
const express = require("express");
const Person = require("./models/person");
const morgan = require("morgan");
const person = require("./models/person");

const app = express();

app.use(express.static("dist"));
app.use(express.json());
morgan.token("body", (req) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] :response-time ms - :body")
);

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/api/info", (request, response) => {
  Person.find().then(results => {
    response.send(`
    <p>Phonebook has info for ${results.length} people</p>
    <p>${new Date()}</p>
    `);
  })
});

app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;

  Person.findById(id).then((person) => {
    if (!person) {
      return response.status(404).json({ error: "person not found" }).end;
    }

    response.json(person);
  });
});

app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Person.findByIdAndDelete(id)
    .then((note) => {
      if (!note) {
        return response.status(404).end();
      }

      response.status(204).end();
    })
    .catch((error) => {
      next(error);
    });
});

app.post("/api/persons/", (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((result) => {
    response.json(result);
  }).catch(error => next(error))
});

app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body;
  const id = request.params.id;

  Person.findById(id)
    .then((person) => {
      if (!person) {
        return response.status(404).json({ error: "person not found" }).end;
      }

      person.name = name;
      person.number = number;

      person.save().then((results) => {
        response.json(results);
      });
    })
    .catch((error) => next(error));
});

const unknownEndPoint = (request, response) => {
  return response.status(404).json({ error: "unknown endpoint" });
};

app.use(unknownEndPoint);

const errorHandling = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).json({ error: "malformatted id" }).end();
  } else if (error.name === "ValidationError") {
    return response.status(400).json({error: error.message}).end()
  }

  next(error);
};

app.use(errorHandling);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
