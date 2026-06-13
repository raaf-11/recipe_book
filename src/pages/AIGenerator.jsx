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
  const [saving, setSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const { user } = useAuth()
  const navigate = useNavigate()

  async function handleGenerate(e) {
    e.preventDefault()
    if (!ingredients.trim()) return

    setLoading(true)
    setError('')
    setRecipe(null)
    setSavedSuccess(false)

    try {
      const data = await generateRecipe(ingredients)
      setRecipe(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // saveChoice: 'public' | 'private'
  async function handleSave(saveChoice) {
    if (!user) {
      navigate('/login')
      return
    }

    setSaving(true)
    try {
      const submitted = await submitRecipe({
        title: recipe.title,
        category: recipe.category,
        time: recipe.time,
        servings: recipe.servings,
        description: recipe.description,
        image: recipe.image || null,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        source: 'ai',
        is_public: saveChoice === 'public' ? 1 : 0
      })

      await saveRecipe(submitted.id)
      setSavedSuccess(true)
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  function handleDiscard() {
    setRecipe(null)
    setIngredients('')
    setSavedSuccess(false)
  }

  return (
    <div className="min-h-screen bg-orange-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-8">

        <h1 className="text-3xl font-bold text-gray-800 mb-2">🤖 Recipe Generator</h1>
        <p className="text-gray-500 text-sm mb-8">
          Enter ingredients you have and Llama 3 will generate a recipe for you.
        </p>

        <form onSubmit={handleGenerate} className="flex flex-col gap-4 mb-8">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Your Ingredients</label>
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

        {error && (
          <div className="bg-red-100 text-red-600 text-sm px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {recipe && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col gap-6">

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

              <div>
                <span className="text-xs font-semibold text-orange-400 uppercase tracking-wide">
                  {recipe.category}
                </span>
                <h2 className="text-2xl font-bold text-gray-800 mt-1">{recipe.title}</h2>
                <p className="text-gray-500 text-sm mt-2">{recipe.description}</p>
                <div className="flex gap-6 text-sm text-gray-600 mt-3">
                  <span>⏱ {recipe.time}</span>
                  <span>🍽 {recipe.servings} servings</span>
                </div>
              </div>

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

              {/* Save / Discard choice */}
              {!savedSuccess ? (
                <div className="flex flex-col gap-3">
                  <p className="text-sm font-medium text-gray-700">
                    What would you like to do with this recipe?
                  </p>

                  <button
                    onClick={() => handleSave('public')}
                    disabled={saving}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 rounded-xl transition-colors"
                  >
                    🌍 Save publicly to Home page
                  </button>

                  <button
                    onClick={() => handleSave('private')}
                    disabled={saving}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-colors"
                  >
                    🔒 Save privately to my Cookbook
                  </button>

                  <button
                    onClick={handleDiscard}
                    disabled={saving}
                    className="w-full bg-red-50 hover:bg-red-100 text-red-500 font-semibold py-3 rounded-xl transition-colors"
                  >
                    🗑 Discard
                  </button>

                  {saving && (
                    <p className="text-center text-sm text-gray-400">Saving...</p>
                  )}
                </div>
              ) : (
                <div className="bg-green-50 text-green-600 text-sm font-semibold px-4 py-3 rounded-xl text-center">
                  ✅ Recipe saved to your Cookbook!
                </div>
              )}

            </div>
          </div>
        )}

      </main>
    </div>
  )
}