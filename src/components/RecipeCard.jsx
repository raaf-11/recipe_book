import { Link } from 'react-router-dom'

export default function RecipeCard({ recipe, onDelete, currentUserId }) {
  const isOwner = currentUserId && recipe.user_id === currentUserId

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <Link to={`/recipe/${recipe.id}`}>
        <img
          src={recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'}
          alt={recipe.title}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-orange-400 uppercase tracking-wide">
              {recipe.category}
            </span>
            {/* Feature 3 — author tag */}
            {recipe.source === 'ai' && recipe.author_name && (
              <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
                🤖 AI by {recipe.author_name}
              </span>
            )}
            {recipe.source === 'user' && recipe.author_name && (
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                👤 {recipe.author_name}
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-gray-800 mt-1">{recipe.title}</h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{recipe.description}</p>
          <p className="text-xs text-gray-400 mt-3">⏱ {recipe.time}</p>
        </div>
      </Link>

      {/* Delete button — only shown to the recipe owner */}
      {isOwner && onDelete && (
        <div className="px-4 pb-4">
          <button
            onClick={() => onDelete(recipe.id)}
            className="text-xs text-red-400 hover:text-red-600 font-semibold transition-colors"
          >
            🗑 Delete recipe
          </button>
        </div>
      )}
    </div>
  )
}