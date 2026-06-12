import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getSavedRecipes, unsaveRecipe } from '../api/cookbook'
import { fetchMyRecipes } from '../api/recipes'

export default function MyCookbook() {
  const [savedRecipes, setSavedRecipes] = useState([])
  const [myRecipes, setMyRecipes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCookbook() {
      try {
        // Fetch both in parallel — faster than one after the other
        const [saved, mine] = await Promise.all([
          getSavedRecipes(),
          fetchMyRecipes()
        ])
        setSavedRecipes(saved)
        setMyRecipes(mine)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadCookbook()
  }, [])

  async function handleUnsave(recipeId) {
    try {
      await unsaveRecipe(recipeId)
      setSavedRecipes(prev => prev.filter(r => r.id !== recipeId))
    } catch (err) {
      alert(err.message)
    }
  }

  // Reusable recipe card used in both sections
  function RecipeCard({ recipe, onRemove }) {
    return (
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <Link to={`/recipe/${recipe.id}`}>
          <img
            src={recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'}
            alt={recipe.title}
            className="w-full h-40 object-cover"
          />
          <div className="p-4">
            <span className="text-xs text-orange-400 font-semibold uppercase">
              {recipe.category}
            </span>
            <h3 className="text-base font-bold text-gray-800 mt-1">
              {recipe.title}
            </h3>
            <p className="text-xs text-gray-400 mt-1">⏱ {recipe.time}</p>
          </div>
        </Link>
        {onRemove && (
          <div className="px-4 pb-4">
            <button
              onClick={() => onRemove(recipe.id)}
              className="text-xs text-red-400 hover:text-red-600 font-semibold"
            >
              Remove from Cookbook
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-orange-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Cookbook</h1>

        {/* Saved Recipes */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            📌 Saved Recipes
          </h2>

          {loading ? (
            <p className="text-gray-400 text-sm">Loading...</p>
          ) : savedRecipes.length === 0 ? (
            <p className="text-gray-400 text-sm">
              No saved recipes yet. Browse and save some!
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedRecipes.map(recipe => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onRemove={handleUnsave}
                />
              ))}
            </div>
          )}
        </section>

        <hr className="border-gray-200 mb-10" />

        {/* My Own Recipes */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-700">
              📝 My Own Recipes
            </h2>
            <Link
              to="/submit"
              className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              + Add Recipe
            </Link>
          </div>

          {loading ? (
            <p className="text-gray-400 text-sm">Loading...</p>
          ) : myRecipes.length === 0 ? (
            <p className="text-gray-400 text-sm">
              You haven't added any recipes yet. Hit "+ Add Recipe" to get started!
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myRecipes.map(recipe => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                />
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  )
}