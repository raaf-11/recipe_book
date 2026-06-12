const express = require('express')
const router = express.Router()
const { db } = require('../database')
const authMiddleware = require('../middleware/auth')  // ← moved to top

// GET /api/recipes — fetch all recipes
router.get('/', (req, res) => {
  const { category, search } = req.query

  let query = 'SELECT * FROM recipes'
  const params = []
  const conditions = []

  if (category && category !== 'All') {
    conditions.push('category = ?')
    params.push(category)
  }

  if (search) {
    conditions.push('title LIKE ?')
    params.push(`%${search}%`)
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ')
  }

  query += ' ORDER BY created_at DESC'

  const recipes = db.prepare(query).all(...params)

  const parsed = recipes.map(recipe => ({
    ...recipe,
    ingredients: JSON.parse(recipe.ingredients),
    steps: JSON.parse(recipe.steps)
  }))

  res.json(parsed)
})

// GET /api/recipes/mine — get recipes submitted by logged in user
// ← must be BEFORE /:id
router.get('/mine', authMiddleware, (req, res) => {
  const recipes = db.prepare(
    'SELECT * FROM recipes WHERE user_id = ? ORDER BY created_at DESC'
  ).all(req.user.id)

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

// POST /api/recipes — submit a new recipe (requires auth)
router.post('/', authMiddleware, (req, res) => {
  const { title, category, time, servings, description, ingredients, steps, image } = req.body

  if (!title || !category || !time || !servings || !ingredients || !steps) {
    return res.status(400).json({ error: 'Please fill in all required fields' })
  }

  const result = db.prepare(`
    INSERT INTO recipes (title, category, time, servings, description, image, ingredients, steps, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    title,
    category,
    time,
    Number(servings),
    description,
    image || null,
    JSON.stringify(ingredients),
    JSON.stringify(steps),
    req.user.id
  )

  res.status(201).json({
    message: 'Recipe submitted successfully ✅',
    id: result.lastInsertRowid
  })
})

module.exports = router