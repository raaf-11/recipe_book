require('dotenv').config()
const express = require('express')
const router = express.Router()
const Groq = require('groq-sdk')

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

// Fetches a food image from Unsplash based on recipe title
async function fetchRecipeImage(title) {
  const query = encodeURIComponent(`${title} food recipe`)
  const url = `https://api.unsplash.com/search/photos?query=${query}&per_page=1&orientation=landscape`

  const res = await fetch(url, {
    headers: {
      Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
    }
  })

  const data = await res.json()

  // Return the regular size image URL, or null if nothing found
  return data.results?.[0]?.urls?.regular || null
}

// POST /api/generator
router.post('/', async (req, res) => {
  const { ingredients } = req.body

  if (!ingredients || ingredients.trim() === '') {
    return res.status(400).json({ error: 'Please provide some ingredients' })
  }

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are a professional chef and recipe creator. 
When given a list of ingredients, you generate a complete, well-structured recipe.
You MUST respond with only valid JSON — no extra text, no markdown, no backticks.
The JSON must follow this exact structure:
{
  "title": "Recipe Name",
  "category": "Breakfast | Lunch | Dinner | Dessert",
  "time": "X mins",
  "servings": 2,
  "description": "A short appetizing description",
  "ingredients": ["ingredient 1", "ingredient 2"],
  "steps": ["Step 1 instruction", "Step 2 instruction"]
}`
        },
        {
          role: 'user',
          content: `Create a recipe using these ingredients: ${ingredients}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1024
    })

    const text = completion.choices[0].message.content.trim()
    const recipe = JSON.parse(text)

    // Fetch a matching image from Unsplash
    const image = await fetchRecipeImage(recipe.title)
    recipe.image = image

    res.json(recipe)

  } catch (err) {
    console.error('Generator error:', err.message)

    if (err instanceof SyntaxError) {
      return res.status(500).json({ error: 'Model returned invalid format. Try again.' })
    }

    res.status(500).json({ error: 'Failed to generate recipe. Try again.' })
  }
})

module.exports = router