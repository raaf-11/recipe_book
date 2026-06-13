import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { submitRecipe } from '../api/recipes'

export default function SubmitRecipe() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    time: '',
    servings: '',
    description: '',
    ingredients: '',
    steps: '',
    is_public: true,
    source: 'user'
  })

  const [imagePreview, setImagePreview] = useState(null)
  const [imageBase64, setImageBase64] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Convert image file to base64 string
  function handleImageChange(e) {
    const file = e.target.files[0]
    if (!file) return

    // Show preview
    const previewUrl = URL.createObjectURL(file)
    setImagePreview(previewUrl)

    // Convert to base64 for storage
    const reader = new FileReader()
    reader.onloadend = () => {
      setImageBase64(reader.result)
    }
    reader.readAsDataURL(file)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const ingredientsArray = formData.ingredients
        .split('\n')
        .map(line => line.trim())
        .filter(line => line !== '')

      const stepsArray = formData.steps
        .split('\n')
        .map(line => line.trim())
        .filter(line => line !== '')

      if (ingredientsArray.length === 0 || stepsArray.length === 0) {
        setError('Please add at least one ingredient and one step')
        setLoading(false)
        return
      }

      await submitRecipe({
        ...formData,
        servings: Number(formData.servings),
        ingredients: ingredientsArray,
        steps: stepsArray,
        image: imageBase64 || null,
        is_public: formData.is_public ? 1 : 0
      })

      navigate('/cookbook')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-orange-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Submit a Recipe</h1>

        {error && (
          <div className="bg-red-100 text-red-600 text-sm px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Title */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Recipe Title</label>
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

          {/* Category + Time */}
          <div className="flex gap-4">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm font-medium text-gray-700">Category</label>
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
              <label className="text-sm font-medium text-gray-700">Cook Time</label>
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
            <label className="text-sm font-medium text-gray-700">Servings</label>
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
            <label className="text-sm font-medium text-gray-700">Short Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="A brief description..."
              rows={2}
              required
              className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white resize-none"
            />
          </div>

          {/* Image upload */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Recipe Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="border border-gray-300 rounded-xl px-4 py-2 text-sm bg-white"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 w-full h-48 object-cover rounded-xl"
              />
            )}
          </div>

          {/* Ingredients */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Ingredients</label>
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
            <label className="text-sm font-medium text-gray-700">Instructions</label>
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

          {/* Visibility toggle */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Make this recipe public</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {formData.is_public
                  ? 'Visible to everyone on the Home page'
                  : 'Only visible in your Cookbook'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, is_public: !formData.is_public })}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                formData.is_public ? 'bg-orange-500' : 'bg-gray-300'
              }`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                formData.is_public ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {loading ? 'Submitting...' : 'Submit Recipe'}
          </button>

        </form>
      </main>
    </div>
  )
}