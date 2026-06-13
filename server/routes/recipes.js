const express = require('express')
const router = express.Router()
const { db } = require('../database')
const authMiddleware = require('../middleware/auth')  // ← moved to top

// GET /api/recipes — fetch all recipes
router.get('/', (req, res) => {
  const { category, search } = req.query

  let query = `
    SELECT recipes.*, users.name as author_name
    FROM recipes
    LEFT JOIN users ON recipes.user_id = users.id
    WHERE recipes.is_public = 1
  `
  const params = []
  const conditions = []

  if (category && category !== 'All') {
    conditions.push('recipes.category = ?')
    params.push(category)
  }

  if (search) {
    conditions.push('recipes.title LIKE ?')
    params.push(`%${search}%`)
  }

  if (conditions.length > 0) {
    query += ' AND ' + conditions.join(' AND ')
  }

  query += ' ORDER BY recipes.created_at DESC'

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
  const { title, category, time, servings, description, ingredients, steps, image, is_public, source } = req.body

  if (!title || !category || !time || !servings || !ingredients || !steps) {
    return res.status(400).json({ error: 'Please fill in all required fields' })
  }

  const result = db.prepare(`
    INSERT INTO recipes (title, category, time, servings, description, image, ingredients, steps, user_id, is_public, source)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    title,
    category,
    time,
    Number(servings),
    description,
    image || null,
    JSON.stringify(ingredients),
    JSON.stringify(steps),
    req.user.id,
    is_public !== undefined ? is_public : 1,
    source || 'user'
  )

  res.status(201).json({
    message: 'Recipe submitted successfully ✅',
    id: result.lastInsertRowid
  })
})


  // DELETE /api/recipes/:id — delete a recipe (only the owner can delete)
router.delete('/:id', authMiddleware, (req, res) => {
  const recipe = db.prepare('SELECT * FROM recipes WHERE id = ?').get(req.params.id)

  if (!recipe) {
    return res.status(404).json({ error: 'Recipe not found' })
  }

  // Make sure the logged in user owns this recipe
  if (recipe.user_id !== req.user.id) {
    return res.status(403).json({ error: 'You can only delete your own recipes' })
  }

  // Delete from saved_recipes first (foreign key constraint)
  db.prepare('DELETE FROM saved_recipes WHERE recipe_id = ?').run(req.params.id)

  // Then delete the recipe
  db.prepare('DELETE FROM recipes WHERE id = ?').run(req.params.id)

  res.json({ message: 'Recipe deleted ✅' })
})
// PATCH /api/recipes/:id/visibility — toggle public/private
router.patch('/:id/visibility', authMiddleware, (req, res) => {
  const { is_public } = req.body
  const recipe = db.prepare('SELECT * FROM recipes WHERE id = ?').get(req.params.id)

  if (!recipe) {
    return res.status(404).json({ error: 'Recipe not found' })
  }

  if (recipe.user_id !== req.user.id) {
    return res.status(403).json({ error: 'You can only edit your own recipes' })
  }

  db.prepare('UPDATE recipes SET is_public = ? WHERE id = ?')
    .run(is_public ? 1 : 0, req.params.id)

  res.json({ message: 'Visibility updated ✅', is_public })
})

module.exports = router