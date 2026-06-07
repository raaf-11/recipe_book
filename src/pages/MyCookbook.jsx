import Navbar from '../components/Navbar'

// Placeholder data so the page doesn't look empty
const SAVED_RECIPES = [
  {
    id: 1,
    title: 'Fluffy Pancakes',
    category: 'Breakfast',
    time: '20 mins',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400'
  },
  {
    id: 4,
    title: 'Spaghetti Bolognese',
    category: 'Dinner',
    time: '45 mins',
    image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400'
  }
]

export default function MyCookbook() {
  return (
    <div className="min-h-screen bg-orange-50">

      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">

        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Cookbook</h1>

        {/* Section 1 — Saved Recipes */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            📌 Saved Recipes
          </h2>

          {SAVED_RECIPES.length === 0 ? (
            <p className="text-gray-400 text-sm">
              No saved recipes yet. Browse and save some!
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SAVED_RECIPES.map(recipe => (
                <div
                  key={recipe.id}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden"
                >
                  <img
                    src={recipe.image}
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
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Divider */}
        <hr className="border-gray-200 mb-10" />

        {/* Section 2 — My Own Recipes */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-700">
              📝 My Own Recipes
            </h2>
            <button className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
              + Add Recipe
            </button>
          </div>

          {/* Empty state — will populate after backend is connected */}
          <p className="text-gray-400 text-sm">
            You haven't added any recipes yet. Hit "+ Add Recipe" to get started!
          </p>
        </section>

      </main>
    </div>
  )
}