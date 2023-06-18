require('dotenv').config()
const express = require('express')
const morgan = require('morgan');
const cors = require('cors')

const Person = require('./models/models.js')



const app = express()
app.use(express.static('build'))
app.use(cors())
app.use(express.json())


morgan.token('body', (req, res) => JSON.stringify(req.body));

app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));





app.get('/health', (request, response, next) => {
    response.status(201).send(ok)
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then((result) => response.json(result))
  })

  app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
    })
    .catch(error => { 
      next(error)
    })
  })

  app.get('/info', (request, response, next) => {
    Person.count()
    .then(count => {
      response.send(`<p>Phonebook has info for ${count} people</p><p>${new Date()}</p>`)
    })
    .catch(error => next(error))
})

  app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
    .then((result) => {
        response.status(204).end();
    })
    .catch((error) => next(error))
  });

  app.post('/api/persons', (request, response, next) => {
    let { name, number } = request.body;
    name = name.trim()
    number = number.trim()
    
    if (!name) {
      return response.status(400).json({ error: 'name is missing' });
    }
    
    Person.findOne({ name }).then((result) => {
      if (result) {
        return response.status(400).json({ error: 'name must be unique' });
      }
  
      const person = new Person({ name, number });
      person.save()
      .then((result) => response.json(result))
      .catch(error => next(error));
    });
  });

  app.put('/api/persons/:id', (request, response, next) => {
    const person = {
      name: request.body.name, 
      number: request.body.number,
    }
    Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then((updatedPerson) => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
  })



  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }

  app.use(unknownEndpoint)

  const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    }
  
    next(error)
  }

  app.use(errorHandler)


  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
