import { Link } from 'react-router-dom'

// Props: recipe object with id, title, category, time, image, description
export default function RecipeCard({ recipe }) {
  return (
    <Link to={`/recipe/${recipe.id}`}>
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer">

        {/* Recipe image */}
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-48 object-cover"
        />

        {/* Recipe info */}
        <div className="p-4">
          <span className="text-xs font-semibold text-orange-400 uppercase tracking-wide">
            {recipe.category}
          </span>
          <h3 className="text-lg font-bold text-gray-800 mt-1">
            {recipe.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {recipe.description}
          </p>
          <p className="text-xs text-gray-400 mt-3">⏱ {recipe.time}</p>
        </div>

      </div>
    </Link>
  )
}