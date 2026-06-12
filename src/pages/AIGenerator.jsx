import { useState } from 'react'
import Navbar from '../components/Navbar'
import { generateRecipe } from '../api/generator'
import { submitRecipe } from '../api/recipes'     
import { saveRecipe } from '../api/cookbook'        
import { useAuth } from '../context/AuthContext'    
import { useNavigate } from 'react-router-dom'  

export default function AIGenerator() {
  const [ingredients, setIngredients] = useState('')
  const [loading, setLoading] = useState(false)
  const [recipe, setRecipe] = useState(null)
  const [error, setError] = useState('')
  const { user } = useAuth()
const navigate = useNavigate()
const [saving, setSaving] = useState(false)
const [savedSuccess, setSavedSuccess] = useState(false)

async function handleSaveToCookbook() {
  if (!user) {
    navigate('/login')
    return
  }

  setSaving(true)
  try {
    // Step 1 — insert the generated recipe into the recipes table
    const submitted = await submitRecipe({
      title: recipe.title,
      category: recipe.category,
      time: recipe.time,
      servings: recipe.servings,
      description: recipe.description,
      image: recipe.image || null,
      ingredients: recipe.ingredients,
      steps: recipe.steps
    })

    // Step 2 — save it to the user's cookbook
    await saveRecipe(submitted.id)

    setSavedSuccess(true)
  } catch (err) {
    alert(err.message)
  } finally {
    setSaving(false)
  }
}

  async function handleGenerate(e) {
    e.preventDefault()
    if (!ingredients.trim()) return

    setLoading(true)
    setError('')
    setRecipe(null)

    try {
      const data = await generateRecipe(ingredients)
      setRecipe(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-orange-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-8">

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🤖 Recipe Generator
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Enter ingredients you have and Llama 3 will generate a recipe for you.
        </p>

        <form onSubmit={handleGenerate} className="flex flex-col gap-4 mb-8">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Your Ingredients
            </label>
            <p className="text-xs text-gray-400">
              Separate with commas — e.g. chicken, garlic, tomatoes, cream
            </p>
            <textarea
              value={ingredients}
              onChange={e => setIngredients(e.target.value)}
              placeholder="chicken, garlic, tomatoes, cream..."
              rows={4}
              className="border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {loading ? 'Generating your recipe...' : 'Generate Recipe'}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-600 text-sm px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Generated Recipe Result */}
        {recipe && (
  <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col gap-6">

    {/* Image — shows if Unsplash returned one */}
    {recipe.image ? (
      <img
        src={recipe.image}
        alt={recipe.title}
        className="w-full h-56 object-cover"
      />
    ) : (
      <div className="w-full h-56 bg-orange-100 flex items-center justify-center text-5xl">
        🍽
      </div>
    )}

    <div className="px-6 pb-6 flex flex-col gap-6">

      {/* Header */}
      <div>
        <span className="text-xs font-semibold text-orange-400 uppercase tracking-wide">
          {recipe.category}
        </span>
        <h2 className="text-2xl font-bold text-gray-800 mt-1">
          {recipe.title}
        </h2>
        <p className="text-gray-500 text-sm mt-2">{recipe.description}</p>
        <div className="flex gap-6 text-sm text-gray-600 mt-3">
          <span>⏱ {recipe.time}</span>
          <span>🍽 {recipe.servings} servings</span>
        </div>
      </div>

      {/* Ingredients */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-3">Ingredients</h3>
        <ul className="flex flex-col gap-2">
          {recipe.ingredients.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-orange-400 mt-0.5">•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Steps */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-3">Instructions</h3>
        <ol className="flex flex-col gap-3">
          {recipe.steps.map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
              <span className="bg-orange-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* Save button */}
      <button
  onClick={handleSaveToCookbook}
  disabled={saving || savedSuccess}
  className={`w-full font-semibold py-3 rounded-xl transition-colors
    ${savedSuccess
      ? 'bg-gray-100 text-gray-600'
      : 'bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white'
    }`}
>
  {saving ? 'Saving...' : savedSuccess ? '✅ Saved to Cookbook!' : '📖 Save to Cookbook'}
</button>
    </div>
  </div>
)}

      </main>
    </div>
  )
}