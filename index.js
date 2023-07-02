require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");
const app = express();

app.use(express.static("build"));
app.use(cors());
app.use(express.json());

// configure morgan
morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

// get the list of all people in the phonebook
app.get("/api/persons", (request, response) => {
  Person.find({})
    .then((people) => response.json(people))
    .catch((error) => console.log(error));
});

// get one person from the phonebook
app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id)
    .then((person) => response.json(person))
    .catch((error) => {
      console.log(error);
      response.status(404).end();
    });
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

const PORT = process.env.PORT;
app.listen(PORT);
