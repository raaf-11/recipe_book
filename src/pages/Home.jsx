import { useState } from 'react'
import Navbar from '../components/Navbar'
import RecipeCard from '../components/RecipeCard'
import { ALL_RECIPES } from '../data/recipes' 

// Hardcoded recipe data — we'll replace this with an API call later


const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert']

export default function Home() {

  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  // Filter logic — runs on every render based on current search + category
  const filteredRecipes = ALL_RECIPES
    .filter(recipe => {
      // Category filter — skip if 'All' is selected
      if (activeCategory !== 'All' && recipe.category !== activeCategory) {
        return false
      }
      // Search filter — checks if title includes the search text (case insensitive)
      if (search && !recipe.title.toLowerCase().includes(search.toLowerCase())) {
        return false
      }
      return true
    })

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

        {/* Category filter buttons */}
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

        {/* Recipe grid */}
        {filteredRecipes.length === 0 ? (
          <p className="text-center text-gray-400 mt-16 text-lg">
            No recipes found 😕
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}

      </main>
    </div>
  )
}