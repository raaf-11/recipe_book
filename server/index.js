const express = require('express')
const cors = require('cors')
const { initializeDatabase } = require('./database')

const app = express()
const PORT = 3000


app.use(cors())               
app.use(express.json())       


initializeDatabase()


app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' })
})


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})