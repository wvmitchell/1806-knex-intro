const express = require('express')
const bodyParser = require('body-parser')
const environment = process.env.NODE_ENV || 'development'
const config = require('./knexfile')[environment]
const database = require('knex')(config)
const app = express()

app.use(bodyParser.json())

app.get('/api/v1/papers', (request, response) => {
  database('papers').select()
    .then(papers => {
      response.status(200).json(papers)
    })
    .catch(error => {
      response.status(500).json({ error: error.message })
    })
})

app.post('/api/v1/papers', (request, response) => {
  const paper = request.body

  for(let requiredParam of ['title', 'author']) {
    if(!paper[requiredParam]) {
      response.status(422).json({ error: 'Missing required param' })
    }
  }

  database('papers').insert(paper, 'id')
    .then(paperIds => {
      response.status(201).json({ id: paperIds[0] })
    })
    .catch(error => {
      response.status(500).json({ error: error.message })
    })
})

app.get('/api/v1/papers/:id', (request, response) => {
  const { id } = request.params

  database('papers').where('id', id).select()
    .then(paper => response.status(200).json(paper))
    .catch(error => console.log(`Error fetching paper: ${error.message}`))
})

app.get('/api/v1/papers/footnotes', (request, response) => {
  database('footnotes').select()
    .then(footnotes => {
      response.status(200).json(footnotes)
    })
    .catch(error => {
      response.status(500).json({ error: error.message })
    })
})

app.listen(3000, () => console.log('Listing to you on port 3000'))
