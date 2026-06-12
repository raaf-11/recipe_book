
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

  useEffect(() => {
    async function loadRecipes() {
      try {
        setLoading(true)
        setError('')
        const data = await fetchRecipes({
          category: activeCategory,
          search
        })
        setRecipes(data)
      } catch (err) {
        setError('Could not load recipes. Is the server running?')
      } finally {
        setLoading(false)
      }
    }

    loadRecipes()
  }, [activeCategory, search])

  return (
    <div className="min-h-screen bg-[#FFFDF9]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">

        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">
            Discover Recipes
          </h1>

          <p className="text-gray-500 mt-2 text-lg">
            Find inspiration for your next meal.
          </p>
        </div>

        {/* Search + Filters */}
        <div className="bg-white border border-orange-100 rounded-3xl shadow-sm p-6 mb-10">

          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search recipes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all
                  ${
                    activeCategory === category
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-orange-50'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        {!loading && !error && (
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-gray-500">
              {recipes.length} recipe{recipes.length !== 1 ? 's' : ''} found
            </p>
          </div>
        )}

        {/* States */}
        {loading ? (
          <div className="text-center mt-16">
            <div className="inline-block h-8 w-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-500">
              Loading recipes...
            </p>
          </div>
        ) : error ? (
          <p className="text-center text-red-500 mt-16">
            {error}
          </p>
        ) : recipes.length === 0 ? (
          <p className="text-center text-gray-400 mt-16 text-lg">
            No recipes found 😕
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map(recipe => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
              />
            ))}
          </div>
        )}

      </main>
    </div>
  )
}

