const express = require('express')
const router = express.Router()
const { db } = require('../database')
const authMiddleware = require('../middleware/auth')

router.use(authMiddleware)

router.get('/', (req, res) => {
  const recipes = db.prepare(`
    SELECT recipes.* FROM recipes
    INNER JOIN saved_recipes ON recipes.id = saved_recipes.recipe_id
    WHERE saved_recipes.user_id = ?
    ORDER BY saved_recipes.saved_at DESC
  `).all(req.user.id)

  const parsed = recipes.map(recipe => ({
    ...recipe,
    ingredients: JSON.parse(recipe.ingredients),
    steps: JSON.parse(recipe.steps)
  }))

  res.json(parsed)
})


router.post('/', (req, res) => {
  const { recipe_id } = req.body

  if (!recipe_id) {
    return res.status(400).json({ error: 'recipe_id is required' })
  }

  
  const existing = db.prepare(
    'SELECT id FROM saved_recipes WHERE user_id = ? AND recipe_id = ?'
  ).get(req.user.id, recipe_id)

  if (existing) {
    return res.status(400).json({ error: 'Recipe already saved' })
  }

  db.prepare(
    'INSERT INTO saved_recipes (user_id, recipe_id) VALUES (?, ?)'
  ).run(req.user.id, recipe_id)

  res.status(201).json({ message: 'Recipe saved ✅' })
})


router.delete('/:recipeId', (req, res) => {
  db.prepare(
    'DELETE FROM saved_recipes WHERE user_id = ? AND recipe_id = ?'
  ).run(req.user.id, req.params.recipeId)

  res.json({ message: 'Recipe removed ✅' })
})

module.exports = router