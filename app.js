const express = require('express')
const path = require('path')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const dbpath = path.join(__dirname, 'todoApplication.db')

const app = express()
app.use(express.json())

let db = null

const serverAndDatabase = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server is running')
    })
  } catch (err) {
    console.log(err.message)
  }
}

serverAndDatabase()
// API1
app.get('/todos/', async (req, res) => {
  const {status} = req.query
  const getQuery = `SELECT * FROM todo WHERE status LIKE "%${status}%"`
  const querysql = await db.all(getQuery)
  res.send(querysql)
})

// API1.1

app.get('/todos/', async (req, res) => {
  const {priority} = req.query
  const getp = `SELECT * FROM todo WHERE priority like "%${priority}%"`
  const queryp = await db.all(getp)
  res.send(queryp)
})

//api1.2
app.get('/todos/', async (req, res) => {
  const {status, priority} = req.query
  const getpas = `SELECT * FROM todo WHERE status LIKE "%${status}%" AND priority like "%${priority}%"`
  const pasres = await db.all(getpas)
  res.send(pasres)
})
//api1.3
app.get('/todos/', async (req, res) => {
  const {search_q} = req.query
  const getpas = `SELECT * FROM todo WHERE todo = "%${search_q}%"`
  const pasres = await db.all(getpas)
  res.send(pasres)
})

//API2
app.get('/todos/:todoId/', async (req, res) => {
  const {todoId} = req.params
  const query = `select * from todo where id like "%${todoId}%"`
  const resquery = await db.all(query)
  res.send(resquery)
})

// API3
app.post(`/todos/`, async (request, response) => {
  const body = request.body
  const {id, todo, priority, status} = body
  const addquery = `insert into todo (id, todo, priority, status) 
  values (${id}, "${todo}", "${priority}", "${status}")`
  const res = await db.run(addquery)
  // const todoId = res.lastID
  response.send(`Todo Successfully Added`)
})

// API4

app.put('/todos/:todoId', async (request, response) => {
  const {todoId} = request.params
  const body = request.body
  const {status} = body
  const query = `UPDATE todo SET status = "${status}" where id = ${todoId}`
  const res = await db.run(query)
  // const las = res.lastID
  response.send(`Status Updated`)
})

// API 4.1
app.put('/todos/:todoId', async (request, response) => {
  const {todoId} = request.params
  const body = request.body
  const {priority} = body
  const query = `UPDATE todo SET status = "${priority}" where id = ${todoId}`
  const res = await db.run(query)
  // const las = res.lastID
  response.send(`Priority Updated`)
})

// API 4.2
app.put('/todos/:todoId', async (request, response) => {
  const {todoId} = request.params
  const body = request.body
  const {todo} = body
  const query = `UPDATE todo SET status = "${todo}" where id = ${todoId}`
  const res = await db.run(query)
  // const las = res.lastID
  response.send(`Todo Updated`)
})

// API 5
app.delete('/todos/:todoId/', async (request, response) => {
  const {todoId} = request.params
  const query = `DELETE FROM todo WHERE id = ${todoId}`
  await db.run(query)
  response.send(`Todo Deleted`)
})

module.exports = app
