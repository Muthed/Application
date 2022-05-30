const express = require("express")
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())

app.use(express.json())

morgan.token('body', req => {
    return JSON.stringify(req.body)
})
  
app.use(morgan(':method :url :status :response-time ms :body'))

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }

//app.use(requestLogger)

let persons = [
    {
        "id": 1,
        "name": "David Muel",
        "number": "020-431234",
      },
      {
        "id": 2,
        "name": "Arto Hellas",
        "number": "040-123456",
      },
      {
        "id": 3,
        "name": "David Muel",
        "number": "020-431234",
      }
]

app.get('/', (request, response) => {
    response.send('<p>Hello world</p>')
})

app.get('/info', (request, response) => {
    response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${Date()}</p>
    `)
})

app.get('/info/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(note => note.id === id)

    if (!person) return response.status(404).end()

    response.send(`
        <h2>Information ${id}</h2>
        <p>Name: ${person.name}</p>
        <p>Number: ${person.number}</p>
    `)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = persons.find(note => note.id === id)
    response.json(note)
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {

    const body = request.body
    if ((!body.name || !body.number)) return response.status(400).json({ error: 'content missing'})

    const person = {
        id: Math.round(Math.random() * (12312331 - 1) + 1),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    response.json(person)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
//app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
