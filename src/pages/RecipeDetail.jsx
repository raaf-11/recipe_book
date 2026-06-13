import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { saveRecipe, unsaveRecipe, getSavedRecipes } from '../api/cookbook'
import { useAuth } from '../context/AuthContext'
import { fetchRecipeById, updateVisibility, deleteRecipe } from '../api/recipes'

export default function RecipeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [isPublic, setIsPublic] = useState(null)
  const [visibilityLoading, setVisibilityLoading] = useState(false) 

  useEffect(() => {
  async function loadRecipe() {
    try {
      const data = await fetchRecipeById(id)
      setRecipe(data)
      setIsPublic(data.is_public === 1)  // ← add this line
    } catch (err) {
      setError('Recipe not found.')
    } finally {
      setLoading(false)
    }
  }
  loadRecipe()
}, [id])

//toggle handler
async function handleVisibilityToggle() {
  setVisibilityLoading(true)
  try {
    await updateVisibility(id, !isPublic)
    setIsPublic(!isPublic)
  } catch (err) {
    alert(err.message)
  } finally {
    setVisibilityLoading(false)
  }
}

//delete handler
async function handleDelete() {
  if (!window.confirm('Delete this recipe? This cannot be undone.')) return
  try {
    await deleteRecipe(id)
    navigate('/')
  } catch (err) {
    alert(err.message)
  }
}

  // Check if this recipe is already saved
  useEffect(() => {
    async function checkSaved() {
      if (!user) return
      try {
        const savedRecipes = await getSavedRecipes()
        const isSaved = savedRecipes.some(r => r.id === Number(id))
        setSaved(isSaved)
      } catch (err) {
        // silently fail — not critical
      }
    }
    checkSaved()
  }, [id, user])

  async function handleSave() {
    if (!user) {
      navigate('/login')
      return
    }

    setSaveLoading(true)
    try {
      if (saved) {
        await unsaveRecipe(id)
        setSaved(false)
      } else {
        await saveRecipe(Number(id))
        setSaved(true)
      }
    } catch (err) {
      alert(err.message)
    } finally {
      setSaveLoading(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-orange-50">
      <Navbar />
      <p className="text-center text-gray-400 mt-24">Loading...</p>
    </div>
  )

  if (error || !recipe) return (
    <div className="min-h-screen bg-orange-50">
      <Navbar />
      <p className="text-center text-gray-400 mt-24 text-xl">Recipe not found 😕</p>
    </div>
  )

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
        

       {/* Visibility toggle — only shown to the recipe owner */}
{user && recipe.user_id === user.id && (
  <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between mb-4">
    <div>
      <p className="text-sm font-medium text-gray-700">Recipe visibility</p>
      <p className="text-xs text-gray-400 mt-0.5">
        {isPublic ? 'Visible to everyone on Home page' : 'Only visible in your Cookbook'}
      </p>
    </div>
    <button
      onClick={handleVisibilityToggle}
      disabled={visibilityLoading}
      className={`w-12 h-6 rounded-full transition-colors relative ${
        isPublic ? 'bg-orange-500' : 'bg-gray-300'
      }`}
    >
      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
        isPublic ? 'translate-x-7' : 'translate-x-1'
      }`} />
    </button>
  </div>
)}

{/* Delete button — only shown to owner */}
{user && recipe.user_id === user.id && (
  <button
    onClick={handleDelete}
    className="w-full bg-red-50 hover:bg-red-100 text-red-500 font-semibold py-3 rounded-xl transition-colors mb-4"
  >
    🗑 Delete Recipe
  </button>
)}

{/* Save to Cookbook button */}
<button
  onClick={handleSave}
  disabled={saveLoading}
  className={`w-full font-semibold py-3 rounded-xl transition-colors
    ${saved
      ? 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500'
      : 'bg-orange-500 hover:bg-orange-600 text-white'
    }`}
>
  {saveLoading ? 'Saving...' : saved ? '✅ Saved — click to remove' : '📖 Save to Cookbook'}
</button>
      </main>
    </div>
  )
}