import { useState } from 'react'
import Navbar from '../components/Navbar'

export default function AIGenerator() {

  const [ingredients, setIngredients] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  function handleGenerate(e) {
    e.preventDefault()
    if (!ingredients.trim()) return

    // Placeholder — real model call goes here in Week 8
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setResult('🚧 AI model not connected yet. Coming in Week 8!')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-orange-50">

      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-8">

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🤖 Recipe Generator
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Enter ingredients you have and we'll generate a recipe for you.
        </p>

        <form onSubmit={handleGenerate} className="flex flex-col gap-4">

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Your Ingredients
            </label>
            <p className="text-xs text-gray-400">
              Separate with commas — e.g. chicken, garlic, tomatoes, cream
            </p>
            <textarea
              value={ingredients}
              onChange={e => setIngredients(e.target.value)}
              placeholder="chicken, garlic, tomatoes, cream..."
              rows={4}
              className="border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {loading ? 'Generating...' : 'Generate Recipe'}
          </button>

        </form>

        {/* Result area */}
        {result && (
          <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm text-gray-700 text-sm">
            {result}
          </div>
        )}

      </main>
    </div>
  )
}