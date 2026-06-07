import { useState } from 'react'
import Navbar from '../components/Navbar'

export default function SubmitRecipe() {

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    time: '',
    servings: '',
    description: '',
    ingredients: '',
    steps: ''
  })

  const [submitted, setSubmitted] = useState(false)

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    // No backend yet — just show a success message for now
    console.log('Recipe submitted:', formData)
    setSubmitted(true)
  }

  // Success screen after submit
  if (submitted) {
    return (
      <div className="min-h-screen bg-orange-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center mt-24 gap-4">
          <p className="text-5xl">🎉</p>
          <h2 className="text-2xl font-bold text-gray-800">Recipe Submitted!</h2>
          <p className="text-gray-500 text-sm">
            We'll save it once the backend is connected.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-4 bg-orange-500 text-white font-semibold px-6 py-2 rounded-xl hover:bg-orange-600 transition-colors"
          >
            Submit Another
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-orange-50">

      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-8">

        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Submit a Recipe
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Title */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Recipe Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Mango Lassi"
              required
              className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
            />
          </div>

          {/* Category + Time row */}
          <div className="flex gap-4">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
              >
                <option value="">Select...</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Dessert">Dessert</option>
              </select>
            </div>

            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm font-medium text-gray-700">
                Cook Time
              </label>
              <input
                type="text"
                name="time"
                value={formData.time}
                onChange={handleChange}
                placeholder="e.g. 30 mins"
                required
                className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
              />
            </div>
          </div>

          {/* Servings */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Servings
            </label>
            <input
              type="number"
              name="servings"
              value={formData.servings}
              onChange={handleChange}
              placeholder="e.g. 4"
              required
              className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Short Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="A brief description of the recipe..."
              rows={2}
              required
              className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white resize-none"
            />
          </div>

          {/* Ingredients */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Ingredients
            </label>
            <p className="text-xs text-gray-400">One ingredient per line</p>
            <textarea
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              placeholder={"2 cups flour\n1 tsp salt\n3 eggs"}
              rows={5}
              required
              className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
            />
          </div>

          {/* Steps */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Instructions
            </label>
            <p className="text-xs text-gray-400">One step per line</p>
            <textarea
              name="steps"
              value={formData.steps}
              onChange={handleChange}
              placeholder={"Mix the dry ingredients.\nAdd eggs and stir.\nBake at 180°C for 30 mins."}
              rows={6}
              required
              className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Submit Recipe
          </button>

        </form>
      </main>
    </div>
  )
}