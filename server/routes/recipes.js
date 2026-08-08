const express = require('express')
const router = express.Router()
const { query } = require('../database')
const authMiddleware = require('../middleware/auth')

router.get('/', async (req, res) => {
  const { category, search } = req.query

  let text = `
    SELECT recipes.*, users.name as author_name
    FROM recipes
    LEFT JOIN users ON recipes.user_id = users.id
    WHERE recipes.is_public = 1
  `
  const params = []
  let i = 1

  if (category && category !== 'All') {
    text += ` AND recipes.category = $${i++}`
    params.push(category)
  }

  if (search) {
    text += ` AND recipes.title ILIKE $${i++}`
    params.push(`%${search}%`)
  }

  text += ' ORDER BY recipes.created_at DESC'

  try {
    const result = await query(text, params)
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

router.get('/mine', authMiddleware, async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM recipes WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    )
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

router.get('/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM recipes WHERE id = $1', [req.params.id])
    const recipe = result.rows[0]

    if (!recipe) return res.status(404).json({ error: 'Recipe not found' })

    res.json({
      ...recipe,
      ingredients: JSON.parse(recipe.ingredients),
      steps: JSON.parse(recipe.steps)
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/', authMiddleware, async (req, res) => {
  const { title, category, time, servings, description, ingredients, steps, image, is_public, source } = req.body

  if (!title || !category || !time || !servings || !ingredients || !steps) {
    return res.status(400).json({ error: 'Please fill in all required fields' })
  }

  try {
    const result = await query(
      `INSERT INTO recipes 
        (title, category, time, servings, description, image, ingredients, steps, user_id, is_public, source)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING id`,
      [
        title, category, time, Number(servings), description,
        image || null,
        JSON.stringify(ingredients),
        JSON.stringify(steps),
        req.user.id,
        is_public !== undefined ? is_public : 1,
        source || 'user'
      ]
    )

    res.status(201).json({
      message: 'Recipe submitted successfully ✅',
      id: result.rows[0].id
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.patch('/:id/visibility', authMiddleware, async (req, res) => {
  const { is_public } = req.body
  try {
    const result = await query('SELECT * FROM recipes WHERE id = $1', [req.params.id])
    const recipe = result.rows[0]

    if (!recipe) return res.status(404).json({ error: 'Recipe not found' })
    if (recipe.user_id !== req.user.id) return res.status(403).json({ error: 'Not your recipe' })

    await query('UPDATE recipes SET is_public = $1 WHERE id = $2', [is_public ? 1 : 0, req.params.id])
    res.json({ message: 'Visibility updated ✅', is_public })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await query('SELECT * FROM recipes WHERE id = $1', [req.params.id])
    const recipe = result.rows[0]

    if (!recipe) return res.status(404).json({ error: 'Recipe not found' })
    if (recipe.user_id !== req.user.id) return res.status(403).json({ error: 'Not your recipe' })

    await query('DELETE FROM saved_recipes WHERE recipe_id = $1', [req.params.id])
    await query('DELETE FROM recipes WHERE id = $1', [req.params.id])

    res.json({ message: 'Recipe deleted ✅' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router