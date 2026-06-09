import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import RecipeCard from '../components/RecipeCard'
import { fetchRecipes } from '../api/recipes'

const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert']

export default function Home() {
  const [recipes, setRecipes] = useState([])
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // useEffect runs after the component renders
  // We fetch recipes whenever search or category changes
  useEffect(() => {
    async function loadRecipes() {
      try {
        setLoading(true)
        setError('')
        const data = await fetchRecipes({ category: activeCategory, search })
        setRecipes(data)
      } catch (err) {
        setError('Could not load recipes. Is the server running?')
      } finally {
        setLoading(false)
      }
    }

    loadRecipes()
  }, [activeCategory, search]) // ← re-runs when these change

  return (
    <div className="min-h-screen bg-orange-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-8">

        {/* Search bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search recipes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          />
        </div>

        {/* Category filters */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors
                ${activeCategory === category
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-orange-100 border border-gray-200'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* States — loading, error, empty, results */}
        {loading ? (
          <p className="text-center text-gray-400 mt-16">Loading recipes...</p>
        ) : error ? (
          <p className="text-center text-red-400 mt-16">{error}</p>
        ) : recipes.length === 0 ? (
          <p className="text-center text-gray-400 mt-16 text-lg">No recipes found 😕</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}

      </main>
    </div>
  )
}