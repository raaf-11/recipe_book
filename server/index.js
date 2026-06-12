require('dotenv').config()

const express = require('express')
const cors = require('cors')
const { initializeDatabase } = require('./database')
const recipeRoutes = require('./routes/recipes')
const authRoutes = require('./routes/auth')
const generatorRoutes = require('./routes/generator') 
const cookbookRoutes = require('./routes/cookbook')  

const app = express()
const PORT = process.env.PORT || 3000
console.log('recipeRoutes:', typeof recipeRoutes)
console.log('authRoutes:', typeof authRoutes)
console.log('generatorRoutes:', typeof generatorRoutes)

app.use(cors())               
app.use(express.json())       


initializeDatabase()

app.use('/api/recipes', recipeRoutes)
app.use('/api/auth', authRoutes)     
app.use('/api/generator', generatorRoutes)    
app.use('/api/cookbook', cookbookRoutes)       

app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' })
})


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})