'use strict'

const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const dotenv = require('dotenv')

const path = require('path')

dotenv.config()

const app = express()
app.use(express.json())

const PORT = process.env.PORT || 8000
const databasePath = path.join(__dirname, 'database.db')

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500
}

// Create the database connection
const db = new sqlite3.Database(databasePath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message)
  } else {
    console.log('Connected to the database')
  }
})

// CREATE -- new home --
app.post('/api/v1/home', (req, res) => {
  const { address, city, region, zipcode } = req.body

  if (!address || !city || !region || !zipcode) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing required fields' })
  }
  const sql = `
  INSERT INTO home (address, city, region, zipcode, created, updated)
  VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `
  db.run(sql, [address, city, region, zipcode], function (err) {
    if (err) {
      console.error(err.message)
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Failed to create home' })
    }
    res.status(HTTP_STATUS.CREATED).json({ id: this.lastID, address, city, region, zipcode })
  })
})

// CREATE -- new person --
app.post('/api/v1/person', (req, res) => {
  const { fname, lname, phone, email, salary, job, birth, homeaddress, homezip } = req.body

  if (!fname || !lname || !phone || !email || !birth || !homeaddress || !homezip) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing required fields' })
  }
  const sql = `
  INSERT INTO person (fname, lname, phone, email, salary, job, birth, homeaddress, homezip, created, updated)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `
  db.run(sql, [fname, lname, phone, email, salary, job, birth, homeaddress, homezip], function (err) {
    if (err) {
      console.error(err.message)
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Failed to create person' })
    }

    res.status(HTTP_STATUS.CREATED).json({
      id: this.lastID, fname, lname, phone, email, salary, job, birth, homeaddress, homezip
    })
  })
})

// CREATE -- new pet --
app.post('/api/v1/pet', (req, res) => {
  const { name, breed, age, birthday, weight, specialneeds, owneremail } = req.body

  if (!name || !breed || !age || !birthday || !owneremail) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing required fields' })
  }
  const sql = `
  INSERT INTO pet (name, breed, age, birthday, weight, specialneeds, owneremail, created, updated)
  VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `
  db.run(sql, [name, breed, age, birthday, weight, specialneeds, owneremail], function (err) {
    if (err) {
      console.error(err.message)
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Failed to create pet' })
    }
    res.status(HTTP_STATUS.CREATED).json({
      id: this.lastID, name, breed, age, birthday, weight, specialneeds, owneremail
    })
  })
})

// GET -- overall info --
app.get('/api/v1/person', (req, res) => {
  const sql = `
  SELECT      p.id AS personid
              , p.fname AS firstname
              , p.lname AS lastname
              , p.email
              , pet.name AS petname
              , pet.type AS species
              , h.city AS homecity
  FROM        person AS p
  LEFT JOIN   pet
    ON        p.email = owneremail
  LEFT JOIN   home AS h
    ON        p.homeaddress = h.address
              AND
              p.homezip = h.zipcode
  ORDER BY    p.id
  `
  db.all(sql, (err, rows) => {
    if (err) {
      console.error('Error fetching data: ', err)
      res.status(HTTP_STATUS.NOT_FOUND).json({
        error: 'Failed to fetch data',
        details: err.message
      })
    } else {
      console.log('--- PERSONS ---\n')
      console.log(JSON.stringify(rows, null, 2))

      res.setHeader('Content-Type', 'application/json')
      res.status(HTTP_STATUS.OK).json(rows)
    }
  })
})

// GET -- with parameters --
app.get('/api/v1/person/search', (req, res) => {
  const queryParams = req.query
  let sql = `
  SELECT      p.id
              , p.fname
              , p.lname
              , p.phone
              , pet.name AS pet_name
              , h.address AS home_address
              , h.city AS home_city
  FROM        person AS p
  LEFT JOIN   pet
         ON   p.email = owneremail
  LEFT JOIN   home AS h
         ON   p.homeaddress = h.address
              AND
              p.homezip = h.zipcode
  WHERE       1=1
  `
  const params = []
  const conditions = []

  for (const key in queryParams) {
    if (queryParams[key]) {
      conditions.push(`${key.includes('pet') ? 'pet.name' : key.includes('home') ? 'h.city' : 'p.' + key} = ?`)
      params.push(queryParams[key])
    }
  }

  if (conditions.length > 0) {
    sql += ' AND ' + conditions.join(' AND ')
  }

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error('Error fetching data: ', err)
      res.status(HTTP_STATUS.NOT_FOUND).json({
        error: 'Failed to fetch data',
        details: err.message
      })
    } else {
      console.log('--- PERSON ---\n')
      console.log(JSON.stringify(rows, null, 2))
      if (rows.length === 0) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Person not found with these parameters' })
      }

      res.setHeader('Content-Type', 'application/json')
      res.status(HTTP_STATUS.OK).json(rows)
    }
  })
})

// GET -- person, their pet and home city by id --
app.get('/api/v1/person/:id', (req, res) => {
  const id = req.params.id
  if (!id || isNaN(parseInt(id))) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'Invalid person ID' })
  }
  const sql = `
  SELECT      p.*
              , pet.name AS petname
              , h.city AS homecity
  FROM        person AS p
  LEFT JOIN   pet
         ON   p.email = owneremail
  LEFT JOIN   home AS h
         ON   p.homeaddress = h.address
              AND
              p.homezip = h.zipcode
  WHERE       p.id = ?
  `
  db.all(sql, [id], (err, row) => {
    if (err) {
      console.error('Error fetching data: ', err)
      res.status(HTTP_STATUS.NOT_FOUND).json({
        error: 'Failed to fetch data',
        details: err.message
      })
    } else {
      console.log('--- PERSON ---\n')
      console.log(JSON.stringify(row, null, 2))

      if (row.length === 0) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Person not found' })
      }
      res.setHeader('Content-Type', 'application/json')
      res.status(HTTP_STATUS.OK).json(row)
    }
  })
})

// GET -- pet info --
app.get('/api/v1/pet', (req, res) => {
  const sql = `
  SELECT  *
  FROM    pet
  `
  db.all(sql, (err, rows) => {
    if (err) {
      console.error('Error fetching data: ', err)
      res.status(HTTP_STATUS.NOT_FOUND).json({
        error: 'Failed to fetch data',
        details: err.message
      })
    } else {
      console.log('--- PETS ---\n')
      console.log(JSON.stringify(rows, null, 2))

      res.setHeader('Content-Type', 'application/json')
      res.status(HTTP_STATUS.OK).json(rows)
    }
  })
})

// GET -- home info --
app.get('/api/v1/home', (req, res) => {
  const sql = `
  SELECT  *
  FROM    home
  `
  db.all(sql, (err, rows) => {
    if (err) {
      console.error('Error fetching data: ', err)
      res.status(HTTP_STATUS.NOT_FOUND).json({
        error: 'Failed to fetch data',
        details: err.message
      })
    } else {
      console.log('--- HOME ---\n')
      console.log(JSON.stringify(rows, null, 2))

      res.setHeader('Content-Type', 'application/json')
      res.status(HTTP_STATUS.OK).json(rows)
    }
  })
})

// UPDATE -- home with id --
app.put('/api/v1/home/:id', (req, res) => {
  const { id } = req.params
  const { address, city, region, zipcode } = req.body

  if (!id || isNaN(parseInt(id))) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'Invalid home ID' })
  }

  const sql = `
  UPDATE    home
  SET       address = ?
            , city = ?
            , region = ?
            , zipcode = ?
            , updated = CURRENT_TIMESTAMP
  WHERE     id = ?
  `

  db.run(sql, [address, city, region, zipcode, id], function (err) {
    if (err) {
      console.error('Error updating home:', err)
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        error: 'Failed to update home',
        details: err.message
      })
    }

    if (this.changes === 0) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Home not found' })
    }

    res.status(HTTP_STATUS.OK).json({ message: 'Home updated successfully' })
  })
})

// UPDATE -- person with id --
app.put('/api/v1/person/:id', (req, res) => {
  const { id } = req.params
  const { fname, lname, phone, email, salary, job, birth, homeaddress, homezip } = req.body

  if (!id || isNaN(parseInt(id))) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'Invalid person ID' })
  }

  const sql = `
  UPDATE    person
  SET       fname = ?
            , lname = ?
            , phone = ?
            , email = ?
            , salary = ?
            , job = ?
            , birth = ?
            , homeaddress = ?
            , homezip = ?
            , updated = CURRENT_TIMESTAMP
  WHERE     id = ?
  `

  db.run(sql, [fname, lname, phone, email, salary, job, birth, homeaddress, homezip, id], function (err) {
    if (err) {
      console.error('Error updating person:', err)
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        error: 'Failed to update person',
        details: err.message
      })
    }

    if (this.changes === 0) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Person not found' })
    }

    res.status(HTTP_STATUS.OK).json({ message: 'Person updated successfully' })
  })
})

// UPDATE -- pet with id --
app.put('/api/v1/pet/:id', (req, res) => {
  const { id } = req.params
  const { name, type, breed, age, birthday, weight, specialneeds, owneremail } = req.body

  if (!id || isNaN(parseInt(id))) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'Invalid pet ID' })
  }

  const sql = `
  UPDATE  pet
  SET     name = ?
          , type = ?
          , breed = ?
          , age = ?
          , birthday = ?
          , weight = ?
          , specialneeds = ?
          , owneremail = ?
          , updated = CURRENT_TIMESTAMP
  WHERE   id = ?
  `

  db.run(sql, [name, type, breed, age, birthday, weight, specialneeds, owneremail, id], function (err) {
    if (err) {
      console.error('Error updating pet:', err)
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        error: 'Failed to update pet',
        details: err.message
      })
    }

    if (this.changes === 0) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Pet not found' })
    }

    res.status(HTTP_STATUS.OK).json({ message: 'Pet updated successfully' })
  })
})

// DELETE -- home with id --
app.delete('/api/v1/home/:id', (req, res) => {
  const id = req.params.id
  if (!id || isNaN(parseInt(id))) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'Invalid home ID' })
  }
  const sql = `
  DELETE FROM   home
  WHERE         id = ?
  `
  db.run(sql, [id], function (err) {
    if (err) {
      console.error('Error deleting home: ', err)
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        error: 'Failed to delete home',
        details: err.message
      })
    }

    if (this.changes === 0) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Home not found' })
    }

    console.log(`Home with ID ${id} deleted`)
    res.status(HTTP_STATUS.OK).json({ message: `Home with ID ${id} deleted successfully` })
  })
})

// DELETE -- person with id --
app.delete('/api/v1/person/:id', (req, res) => {
  const id = req.params.id
  if (!id || isNaN(parseInt(id))) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'Invalid person ID' })
  }
  const sql = `
  DELETE FROM   person
  WHERE         id = ?
  `
  db.run(sql, [id], function (err) {
    if (err) {
      console.error('Error deleting person: ', err)
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        error: 'Failed to delete person',
        details: err.message
      })
    }

    if (this.changes === 0) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Person not found' })
    }

    console.log(`Person with ID ${id} deleted`)
    res.status(HTTP_STATUS.OK).json({ message: `Person with ID ${id} deleted successfully` })
  })
})

// DELETE -- pet with id --
app.delete('/api/v1/pet/:id', (req, res) => {
  const id = req.params.id
  if (!id || isNaN(parseInt(id))) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'Invalid pet ID' })
  }
  const sql = `
  DELETE FROM   pet
  WHERE         id = ?
  `
  db.run(sql, [id], function (err) {
    if (err) {
      console.error('Error deleting pet: ', err)
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        error: 'Failed to delete pet',
        details: err.message
      })
    }

    if (this.changes === 0) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Pet not found' })
    }

    console.log(`Pet with ID ${id} deleted`)
    res.status(HTTP_STATUS.OK).json({ message: `Pet with ID ${id} deleted successfully` })
  })
})

// Error handling for incorrect requests
app.use((req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.status(HTTP_STATUS.NOT_FOUND).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist',
    path: req.path,
    method: req.method,
    availableEndpoints: [
      'POST /api/v1/home',
      'GET /api/v1/home',
      'PUT /api/v1/home/:id',
      'DELETE /api/v1/home/:id',
      'POST /api/v1/person',
      'GET /api/v1/person',
      'GET /api/v1/person/:id',
      'GET /api/v1/person/search',
      'PUT /api/v1/person/:id',
      'DELETE /api/v1/person/:id',
      'POST /api/v1/pet',
      'GET /api/v1/pet',
      'PUT /api/v1/pet/:id',
      'DELETE /api/v1/pet/:id'
    ]
  })
})

// Listening for requests
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})

process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message)
    } else {
      console.log('Database connection closed')
    }
    process.exit(1)
  })
})
