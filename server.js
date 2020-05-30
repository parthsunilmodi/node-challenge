const express = require('express')
const bodyParser = require('body-parser')

const api = require('./api')
const middleware = require('./middleware')

const PORT = process.env.PORT || 1337

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => res.send('Welcome to Node challenge'))

app.get('/health', api.getHealth)

app.get('/:studentId/*', api.getStudents)
app.get('/:studentId', api.getStudents)

app.put('/:studentId/*', api.addAndUpdateStudent)
app.put('/:studentId', api.addAndUpdateStudent)

app.delete('/:studentId/*', api.deleteStudent)
app.delete('/:studentId', api.deleteStudent)

app.use(middleware.handleError)
app.use(middleware.notFound)

const server = app.listen(PORT, () =>
  console.log(`Server listening on port ${PORT}`)
)

if (require.main !== module) {
  module.exports = server
}
