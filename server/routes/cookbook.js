const express = require('express')
const router = express.Router()
const { query } = require('../database')
const authMiddleware = require('../middleware/auth')

router.use(authMiddleware)

router.get('/', async (req, res) => {
  try {
    const result = await query(`
      SELECT recipes.* FROM recipes
      INNER JOIN saved_recipes ON recipes.id = saved_recipes.recipe_id
      WHERE saved_recipes.user_id = $1
      ORDER BY saved_recipes.saved_at DESC
    `, [req.user.id])

    const parsed = result.rows.map(recipe => ({
      ...recipe,
      ingredients: JSON.parse(recipe.ingredients),
      steps: JSON.parse(recipe.steps)
    }))
    res.json(parsed)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/', async (req, res) => {
  const { recipe_id } = req.body
  if (!recipe_id) return res.status(400).json({ error: 'recipe_id is required' })

  try {
    const existing = await query(
      'SELECT id FROM saved_recipes WHERE user_id = $1 AND recipe_id = $2',
      [req.user.id, recipe_id]
    )
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Recipe already saved' })
    }

    await query(
      'INSERT INTO saved_recipes (user_id, recipe_id) VALUES ($1, $2)',
      [req.user.id, recipe_id]
    )
    res.status(201).json({ message: 'Recipe saved ✅' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.delete('/:recipeId', async (req, res) => {
  try {
    await query(
      'DELETE FROM saved_recipes WHERE user_id = $1 AND recipe_id = $2',
      [req.user.id, req.params.recipeId]
    )
    res.json({ message: 'Recipe removed ✅' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router