const tape = require('tape')
const jsonist = require('jsonist')

const port = (process.env.PORT = process.env.PORT || require('get-port-sync')())
const endpoint = `http://localhost:${port}`

const server = require('./server')

tape('health', async function (t) {
  const url = `${endpoint}/health`
  jsonist.get(url, (err, body) => {
    if (err) t.error(err)
    t.ok(body.success, 'should have successful healthcheck')
    t.end()
  })
})

/* Test cases to ADD and UPDATE the data */

tape('add data without params', function (t) {
  const url = `${endpoint}/student1`
  const data = {
    a: {
      b: 64
    }
  }
  jsonist.put(url, data, (err, body) => {
    if (err) t.error(err)
    t.ok(body.message, 'Data is modified')
    t.end()
  })
})

tape('add data with params', function (t) {
  const url = `${endpoint}/student2/a`
  const data = {
    b: {
      c: 64
    }
  }
  jsonist.put(url, data, (err, body) => {
    if (err) t.error(err)
    t.ok(body.message, 'Data is modified')
    t.end()
  })
})

/* Test cases to GET the data */

tape('get data without params', function (t) {
  const url = `${endpoint}/a`
  jsonist.get(url, (err, body) => {
    if (err) t.error(err)
    const expectedOutput = {
      'message': 'Property found',
      'value': {
        'b': {
          'c': {
            'h': {
              'i': 64
            }
          }
        }
      }
    }
    t.deepEqual(body, expectedOutput)
    t.end()
  })
})

tape('get data with params', function (t) {
  const url = `${endpoint}/a/b/c`
  jsonist.get(url, (err, body) => {
    if (err) t.error(err)
    const expectedOutput = {
      'message': 'Property found',
      'value': {
        'h': {
          'i': 64
        }
      }
    }
    t.deepEqual(body, expectedOutput)
    t.end()
  })
})

tape('file does not exist', function (t) {
  const url = `${endpoint}/d`
  jsonist.get(url, (err, body) => {
    if (err) t.error(err)
    const expectedOutput = {
      'message': 'File does not exist'
    }
    t.deepEqual(body, expectedOutput)
    t.end()
  })
})

tape('property does not exist', function (t) {
  const url = `${endpoint}/a/g/h`
  jsonist.get(url, (err, body) => {
    if (err) t.error(err)
    const expectedOutput = {
      'message': 'Property not found'
    }
    t.deepEqual(body, expectedOutput)
    t.end()
  })
})

/* Test cases to DELETE the data */

tape('data should be deleted', function (t) {
  const url = `${endpoint}/a/b/c`
  jsonist.delete(url, (err, body) => {
    if (err) t.error(err)
    const expectedOutput = {
      message: 'Property deleted',
      value: {
        b: {}
      }
    }
    t.deepEqual(body, expectedOutput)
    t.end()
  })
})

tape('file should be deleted', function (t) {
  const url = `${endpoint}/student2`
  jsonist.delete(url, (err, body) => {
    if (err) t.error(err)
    const expectedOutput = {
      message: 'File is deleted'
    }
    t.deepEqual(body, expectedOutput)
    t.end()
  })
})

tape('file does not exist', function (t) {
  const url = `${endpoint}/student1`
  jsonist.delete(url, (err, body) => {
    if (err) t.error(err)
    const expectedOutput = {
      message: 'File is deleted'
    }
    t.deepEqual(body, expectedOutput)
    t.end()
  })
})

tape('cleanup', function (t) {
  server.close()
  t.end()
})
