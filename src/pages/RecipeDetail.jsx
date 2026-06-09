import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { fetchRecipeById } from '../api/recipes'

export default function RecipeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadRecipe() {
      try {
        const data = await fetchRecipeById(id)
        setRecipe(data)
      } catch (err) {
        setError('Recipe not found.')
      } finally {
        setLoading(false)
      }
    }

    loadRecipe()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50">
        <Navbar />
        <p className="text-center text-gray-400 mt-24">Loading...</p>
      </div>
    )
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-orange-50">
        <Navbar />
        <p className="text-center text-gray-400 mt-24 text-xl">Recipe not found 😕</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-orange-50">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-8">

        <button
          onClick={() => navigate(-1)}
          className="text-sm text-orange-500 font-semibold mb-6 hover:underline flex items-center gap-1"
        >
          ← Back
        </button>

        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-64 object-cover rounded-2xl mb-6"
        />

        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <span className="text-xs font-semibold text-orange-400 uppercase tracking-wide">
            {recipe.category}
          </span>
          <h1 className="text-3xl font-bold text-gray-800 mt-1 mb-3">
            {recipe.title}
          </h1>
          <p className="text-gray-500 text-sm mb-4">{recipe.description}</p>
          <div className="flex gap-6 text-sm text-gray-600">
            <div>
              <span className="font-semibold">⏱ Time</span>
              <p>{recipe.time}</p>
            </div>
            <div>
              <span className="font-semibold">🍽 Servings</span>
              <p>{recipe.servings} people</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Ingredients</h2>
          <ul className="flex flex-col gap-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-orange-400 mt-0.5">•</span>
                {ingredient}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Instructions</h2>
          <ol className="flex flex-col gap-4">
            {recipe.steps.map((step, index) => (
              <li key={index} className="flex items-start gap-3 text-sm text-gray-700">
                <span className="bg-orange-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-colors">
            Save to Cookbook
        </button>

      </main>
    </div>
  )
}