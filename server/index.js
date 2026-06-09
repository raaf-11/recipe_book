const express = require('express')
const cors = require('cors')
const { initializeDatabase } = require('./database')
const recipeRoutes = require('./routes/recipes')
const authRoutes = require('./routes/auth')

const app = express()
const PORT = 3000


app.use(cors())               
app.use(express.json())       


initializeDatabase()

app.use('/api/recipes', recipeRoutes)
app.use('/api/auth', authRoutes)     


app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' })
})


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})