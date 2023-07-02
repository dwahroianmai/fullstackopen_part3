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
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({ error: "name or number is missing " });
  }

  Person.find({}).then((people) => {
    const existing = people.filter((p) => p.name === body.name);
    if (existing.length > 0) {
      response
        .status(400)
        .json({ error: "person with this name already exists" })
        .end();
    } else {
      const person = new Person({
        name: body.name,
        number: body.number,
      });

      person.save().then((savedPerson) => response.json(savedPerson));
    }
  });
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
