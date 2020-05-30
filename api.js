const _ = require('lodash')
const fs = require('fs')

const directory = './data/'

async function getHealth (req, res, next) {
  res.json({ success: true })
}

const getStudents = (req, res) => {
  const fileName = `${req.params.studentId}.json`
  const files = fs.readdirSync(directory) // get all the files of the directory

  if (files.includes(fileName.toLowerCase())) { // check whether the given file is preset in the directory
    const dataPath = `./data/${fileName}`
    fs.readFile(dataPath, 'utf-8', (err, data) => { // get the data from the file
      if (err) {
        res.status(500).send({ message: 'Something went wrong' })
      }
      const params = req.params['0']
      const paramsArray = params ? params.split('/') : []
      const dataJSON = JSON.parse(data) // json of the data from the file
      const value = _.get(dataJSON, paramsArray.join('.').toString())
      if (!params) { // return the whole file
        res.send({ message: 'Property found', value: dataJSON })
      } else if (value) { // return the data which is asked through params
        res.send({ message: 'Property found', value })
      } else {
        res.status(404).send({ message: 'Property not found' })
      }
    })
  } else {
    res.status(404).send({ message: 'File does not exist' })
  }
}

const addAndUpdateStudent = (req, res) => {
  const studentName = req.params.studentId.toLowerCase()
  const fileName = `${studentName}.json`
  const paramsArray = req.params['0'] ? req.params['0'].split('/') : []
  let obj = {}
  paramsArray.reduce((o, s, index) => {
    if (index !== (paramsArray.length - 1)) {
      // eslint-disable-next-line no-return-assign
      return o[s] = {}
    }
    // eslint-disable-next-line no-return-assign
    return o[s] = req.body
  }, obj)

  fs.writeFileSync(`${directory}${fileName.toLowerCase()}`, JSON.stringify(obj), () => {
    res.status(404).send('something went wrong')
  })
  res.send({ message: 'Data is modified' })
}

const deleteStudent = (req, res) => {
  const fileName = `${req.params.studentId}.json`
  const params = req.params['0']

  if (!params) { // if no parameters, delete the whole file
    fs.unlinkSync(`${directory}${fileName.toLowerCase()}`) // delete the file
    res.send({ message: 'File is deleted' })
  }
  const paramsArray = params ? params.split('/') : []
  const files = fs.readdirSync(directory) // get the data from the file
  if (files.includes(fileName.toLowerCase())) {
    const dataPath = `./data/${fileName}`
    fs.readFile(dataPath, 'utf-8', (err, data) => {
      if (err) {
        throw err
      }
      const dataJSON = JSON.parse(data)
      _.unset(dataJSON, paramsArray.join('.').toString()) // remove the properties from the object and removing the nested properties
      fs.writeFileSync(`${directory}${fileName.toLowerCase()}`, JSON.stringify(dataJSON), () => { // update the file
        res.status(404).send('something went wrong')
      })
      res.send({ message: 'Property deleted', value: dataJSON })
    })
  } else {
    res.status(404).send({ message: 'File does not exist' })
  }
}

module.exports = {
  getHealth,
  getStudents,
  addAndUpdateStudent,
  deleteStudent
}
