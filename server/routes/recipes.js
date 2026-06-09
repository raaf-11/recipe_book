const express = require('express')
const router = express.Router()
const { db } = require('../database')

// GET /api/recipes — fetch all recipes
// Supports optional ?category= and ?search= query params
router.get('/', (req, res) => {
  const { category, search } = req.query

  // Start with base query
  let query = 'SELECT * FROM recipes'
  const params = []
  const conditions = []

  // Add filters if provided
  if (category && category !== 'All') {
    conditions.push('category = ?')
    params.push(category)
  }

  if (search) {
    conditions.push('title LIKE ?')
    params.push(`%${search}%`)
  }

  // Attach conditions to query if any exist
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ')
  }

  query += ' ORDER BY created_at DESC'

  const recipes = db.prepare(query).all(...params)

  // Parse ingredients and steps from JSON strings back to arrays
  const parsed = recipes.map(recipe => ({
    ...recipe,
    ingredients: JSON.parse(recipe.ingredients),
    steps: JSON.parse(recipe.steps)
  }))

  res.json(parsed)
})

// GET /api/recipes/:id — fetch a single recipe by id
router.get('/:id', (req, res) => {
  const recipe = db.prepare('SELECT * FROM recipes WHERE id = ?').get(req.params.id)

  if (!recipe) {
    return res.status(404).json({ error: 'Recipe not found' })
  }

  res.json({
    ...recipe,
    ingredients: JSON.parse(recipe.ingredients),
    steps: JSON.parse(recipe.steps)
  })
})

module.exports = router