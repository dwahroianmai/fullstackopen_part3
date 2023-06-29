const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

app.use(express.static("build"));
app.use(cors());
app.use(express.json());

// configure morgan
morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

// get the list of all people in the phonebook
app.get("/api/persons", (request, response) => {
  response.json(persons);
});

// get one person from the phonebook
app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((p) => p.id === id);
  person ? response.json(person) : response.status(404).end();
});

// delete the person from the phonebook
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((p) => p.id !== id);

  response.status(204).end();
});

// adds a new person to the phonebook
app.post("/api/persons", (request, response) => {
  const person = request.body;
  const existingPerson = persons.filter((p) => p.name === person.name);
  if (!person.name || !person.number) {
    response.status(400).json({ error: "the name or number is missing" });
  } else if (existingPerson.length !== 0) {
    response
      .status(400)
      .json({ error: "the name already exists in the phonebook" });
  } else {
    const newPerson = {
      id: Math.round(Math.random() * 10000000000),
      name: person.name,
      number: person.number,
    };
    persons = persons.concat(newPerson);
    response.json(newPerson);
  }
});

// get info about the phonebook
app.get("/info", (request, response) => {
  let people_number = persons.length;
  response.send(
    `
    <p>Phonebook has info for ${people_number} people.</p>
    <p>${new Date(Date.now())}</p>
    `
  );
});

const PORT = process.env.PORT || 3001;
app.listen(PORT);
