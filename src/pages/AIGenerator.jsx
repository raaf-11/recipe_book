import { useState } from 'react'
import {
  ChefHat,
  Sparkles,
  Plus,
  Clock3,
  Users,
  Bookmark,
  BookmarkCheck,
  Trash2,
  RotateCcw,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import Navbar from '../components/Navbar'
import { generateRecipe } from '../api/generator'
import { submitRecipe } from '../api/recipes'
import { saveRecipe } from '../api/cookbook'
import { useAuth } from '../context/AuthContext'

const COMMON_INGREDIENTS = [
  'Chicken',
  'Eggs',
  'Rice',
  'Cheese',
  'Spinach',
  'Milk',
  'Tomatoes',
]

export default function AIGenerator() {
  const [ingredients, setIngredients] = useState('')
  const [loading, setLoading] = useState(false)
  const [recipe, setRecipe] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const { user } = useAuth()
  const navigate = useNavigate()

  async function handleGenerate(e) {
    e.preventDefault()

    if (!ingredients.trim()) return

    setLoading(true)
    setError('')
    setRecipe(null)
    setSavedSuccess(false)

    try {
      const data = await generateRecipe(ingredients)
      setRecipe(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function addIngredient(ingredient) {
    const current = ingredients.trim()

    if (!current) {
      setIngredients(`${ingredient}, `)
      return
    }

    const alreadyAdded = current
      .split(',')
      .map((item) => item.trim().toLowerCase())
      .includes(ingredient.toLowerCase())

    if (alreadyAdded) return

    setIngredients(`${current}, ${ingredient.toLowerCase()}`)
  }

  async function handleSave(saveChoice) {
    if (!user) {
      navigate('/login')
      return
    }

    if (!recipe) return

    setSaving(true)

    try {
      const submitted = await submitRecipe({
        title: recipe.title,
        category: recipe.category,
        time: recipe.time,
        servings: recipe.servings,
        description: recipe.description,
        image: recipe.image || null,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        source: 'ai',
        is_public: saveChoice === 'public' ? 1 : 0,
      })

      await saveRecipe(submitted.id)

      setSavedSuccess(true)
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  function handleDiscard() {
    setRecipe(null)
    setIngredients('')
    setSavedSuccess(false)
    setError('')
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <Navbar />

      <main className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-8 sm:py-10 lg:py-12">

        {/* =====================================================
            PAGE HEADER
        ====================================================== */}
        <section className="bg-white border border-[#E9E4DF] rounded-2xl shadow-[0_4px_18px_rgba(36,33,31,0.04)] px-5 sm:px-8 lg:px-10 py-7 sm:py-8 text-center">
          
          <div className="w-11 h-11 mx-auto rounded-full bg-[#FFF0E5] text-[#C85A1C] flex items-center justify-center mb-3">
            <Sparkles size={20} strokeWidth={1.8} />
          </div>

          <h1
            className="text-3xl sm:text-4xl lg:text-[42px] text-[#24211F] leading-tight"
            style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
            }}
          >
            AI Recipe Generator
          </h1>

          <p className="text-xs sm:text-sm text-[#756E68] mt-2">
            Turn your available ingredients into a delicious recipe with AI.
          </p>
        </section>

        {/* =====================================================
            GENERATOR AREA
        ====================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-[340px_minmax(0,1fr)] gap-5 lg:gap-6 mt-6">

          {/* =================================================
              LEFT — INGREDIENT INPUT
          ================================================== */}
          <form
            onSubmit={handleGenerate}
            className="
              bg-white
              border
              border-[#E9E4DF]
              rounded-2xl
              shadow-[0_4px_18px_rgba(36,33,31,0.04)]
              p-5
              sm:p-6
              flex
              flex-col
            "
          >
            {/* Heading */}
            <div className="flex items-center gap-2 mb-4">
              <ChefHat
                size={17}
                strokeWidth={1.8}
                className="text-[#C85A1C]"
              />

              <label className="text-sm font-medium text-[#24211F]">
                What ingredients do you have?
              </label>
            </div>

            <p className="text-[11px] text-[#756E68] mb-2">
              Separate ingredients with commas.
            </p>

            {/* Textarea */}
            <textarea
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="Chicken, onions, tomatoes, garlic, olive oil..."
              rows={4}
              className="
                w-full
                resize-none
                bg-[#F8F7FC]
                border
                border-[#E7E0D9]
                rounded-lg
                px-3
                py-3
                text-xs
                leading-5
                text-[#24211F]
                placeholder:text-[#8A817A]
                outline-none
                transition
                focus:border-[#F47A32]
                focus:ring-2
                focus:ring-[#F47A32]/10
              "
            />

            {/* Common ingredients */}
            <div className="mt-4">
              <p className="text-[10px] uppercase tracking-wide text-[#756E68] mb-2">
                Common ingredients
              </p>

              <div className="flex flex-wrap gap-1.5">
                {COMMON_INGREDIENTS.map((ingredient) => (
                  <button
                    key={ingredient}
                    type="button"
                    onClick={() => addIngredient(ingredient)}
                    className="
                      inline-flex
                      items-center
                      gap-1
                      px-2.5
                      py-1.5
                      rounded-full
                      bg-[#FFE4D0]
                      text-[#7A3517]
                      text-[10px]
                      font-medium
                      hover:bg-[#FFD6BB]
                      transition-colors
                    "
                  >
                    {ingredient}
                    <Plus size={10} />
                  </button>
                ))}
              </div>
            </div>

            {/* Generate */}
            <button
              type="submit"
              disabled={loading || !ingredients.trim()}
              className="
                w-full
                h-10
                mt-6
                rounded-full
                bg-[#F47A32]
                hover:bg-[#E96820]
                disabled:bg-[#F5B28D]
                text-white
                text-xs
                font-medium
                flex
                items-center
                justify-center
                gap-2
                transition-colors
              "
            >
              <Sparkles size={14} />

              {loading
                ? 'Generating your recipe...'
                : 'Generate Recipe'}
            </button>

            {loading && (
              <p className="text-center text-[10px] text-[#756E68] mt-3">
                Your AI chef is creating something delicious...
              </p>
            )}
          </form>

          {/* =================================================
              RIGHT — RESULT
          ================================================== */}
          <div className="min-h-[430px]">

            {/* Error */}
            {error && (
              <div className="h-full min-h-[430px] bg-white border border-red-100 rounded-2xl flex flex-col items-center justify-center px-6 text-center">
                <div className="w-11 h-11 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-3">
                  <RotateCcw size={18} />
                </div>

                <h2
                  className="text-xl text-[#24211F]"
                  style={{
                    fontFamily: "'DM Serif Display', Georgia, serif",
                  }}
                >
                  Something went wrong
                </h2>

                <p className="text-xs text-[#756E68] mt-1 max-w-sm">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() => setError('')}
                  className="
                    mt-4
                    px-5
                    py-2
                    rounded-full
                    bg-[#F47A32]
                    hover:bg-[#E96820]
                    text-white
                    text-xs
                    font-medium
                    transition-colors
                  "
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Empty state */}
            {!recipe && !loading && !error && (
              <div
                className="
                  h-full
                  min-h-[430px]
                  bg-white
                  border
                  border-[#E9E4DF]
                  rounded-2xl
                  shadow-[0_4px_18px_rgba(36,33,31,0.04)]
                  flex
                  flex-col
                  items-center
                  justify-center
                  px-6
                  text-center
                "
              >
                <div className="w-16 h-16 rounded-full bg-[#F8F7FC] flex items-center justify-center text-[#D6D0CB] mb-4">
                  <ChefHat size={38} strokeWidth={1.3} />
                </div>

                <h2
                  className="text-xl text-[#24211F]"
                  style={{
                    fontFamily: "'DM Serif Display', Georgia, serif",
                  }}
                >
                  Ready to cook?
                </h2>

                <p className="text-xs text-[#756E68] leading-relaxed max-w-[310px] mt-2">
                  Enter your ingredients on the left, and your AI Chef will
                  craft a unique recipe just for you.
                </p>
              </div>
            )}

            {/* Loading state */}
            {loading && (
              <div
                className="
                  h-full
                  min-h-[430px]
                  bg-white
                  border
                  border-[#E9E4DF]
                  rounded-2xl
                  flex
                  flex-col
                  items-center
                  justify-center
                  text-center
                "
              >
                <div className="w-14 h-14 rounded-full bg-[#FFF0E5] text-[#F47A32] flex items-center justify-center animate-pulse">
                  <Sparkles size={24} />
                </div>

                <h2
                  className="text-xl text-[#24211F] mt-4"
                  style={{
                    fontFamily: "'DM Serif Display', Georgia, serif",
                  }}
                >
                  Creating your recipe...
                </h2>

                <p className="text-xs text-[#756E68] mt-1">
                  Your ingredients are inspiring something delicious.
                </p>
              </div>
            )}

            {/* Generated recipe */}
            {recipe && !loading && (
              <div className="bg-white border border-[#E9E4DF] rounded-2xl shadow-[0_4px_18px_rgba(36,33,31,0.04)] overflow-hidden">

                {/* Recipe image */}
                {recipe.image ? (
                  <div className="h-[220px] sm:h-[250px] relative overflow-hidden">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-full object-cover"
                    />

                    {recipe.category && (
                      <span
                        className="
                          absolute
                          top-4
                          left-4
                          px-3
                          py-1
                          rounded-full
                          bg-[#FFE4D0]
                          text-[#7A3517]
                          text-[10px]
                          font-semibold
                          uppercase
                          tracking-wide
                        "
                      >
                        {recipe.category}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="h-[220px] bg-[#FAF7F2] flex items-center justify-center">
                    <ChefHat
                      size={48}
                      strokeWidth={1.2}
                      className="text-[#D6D0CB]"
                    />
                  </div>
                )}

                <div className="p-5 sm:p-6">

                  {/* Title */}
                  <h2
                    className="text-2xl sm:text-3xl text-[#24211F] leading-tight"
                    style={{
                      fontFamily: "'DM Serif Display', Georgia, serif",
                    }}
                  >
                    {recipe.title}
                  </h2>

                  {recipe.description && (
                    <p className="text-xs sm:text-sm text-[#756E68] leading-relaxed mt-2">
                      {recipe.description}
                    </p>
                  )}

                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-5 mt-4 text-[11px] text-[#625C57]">
                    <div className="flex items-center gap-1.5">
                      <Clock3
                        size={14}
                        className="text-[#C85A1C]"
                      />
                      {recipe.time}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Users
                        size={14}
                        className="text-[#C85A1C]"
                      />
                      {recipe.servings} servings
                    </div>
                  </div>

                  {/* Ingredients */}
                  <div className="mt-6 pt-5 border-t border-[#E9E4DF]">
                    <h3
                      className="text-lg text-[#24211F] mb-3"
                      style={{
                        fontFamily: "'DM Serif Display', Georgia, serif",
                      }}
                    >
                      Ingredients
                    </h3>

                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {recipe.ingredients.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-xs text-[#625C57]"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F47A32] mt-1.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Instructions */}
                  <div className="mt-6 pt-5 border-t border-[#E9E4DF]">
                    <h3
                      className="text-lg text-[#24211F] mb-3"
                      style={{
                        fontFamily: "'DM Serif Display', Georgia, serif",
                      }}
                    >
                      Instructions
                    </h3>

                    <ol className="space-y-3">
                      {recipe.steps.map((step, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-3 text-xs text-[#625C57] leading-relaxed"
                        >
                          <span className="w-6 h-6 rounded-full bg-[#FFF0E5] border border-[#F3D2BE] text-[#C85A1C] flex items-center justify-center text-[10px] font-semibold shrink-0">
                            {index + 1}
                          </span>

                          <span className="pt-0.5">
                            {step}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Save / discard */}
                  {!savedSuccess ? (
                    <div className="mt-7 pt-5 border-t border-[#E9E4DF]">
                      <p className="text-xs font-medium text-[#24211F] mb-3">
                        What would you like to do with this recipe?
                      </p>

                      <div className="space-y-2.5">
                        <button
                          type="button"
                          onClick={() => handleSave('public')}
                          disabled={saving}
                          className="
                            w-full
                            h-10
                            rounded-full
                            bg-[#F47A32]
                            hover:bg-[#E96820]
                            disabled:bg-[#F5B28D]
                            text-white
                            text-xs
                            font-medium
                            flex
                            items-center
                            justify-center
                            gap-2
                            transition-colors
                          "
                        >
                          <Bookmark size={14} />
                          Save publicly to Home
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSave('private')}
                          disabled={saving}
                          className="
                            w-full
                            h-10
                            rounded-full
                            border
                            border-[#E7E0D9]
                            bg-[#F8F7FC]
                            hover:bg-[#FAF7F2]
                            text-[#625C57]
                            text-xs
                            font-medium
                            flex
                            items-center
                            justify-center
                            gap-2
                            transition-colors
                          "
                        >
                          <Bookmark size={14} />
                          Save privately to Cookbook
                        </button>

                        <button
                          type="button"
                          onClick={handleDiscard}
                          disabled={saving}
                          className="
                            w-full
                            h-10
                            rounded-full
                            border
                            border-red-100
                            bg-red-50
                            hover:bg-red-100
                            text-red-500
                            text-xs
                            font-medium
                            flex
                            items-center
                            justify-center
                            gap-2
                            transition-colors
                          "
                        >
                          <Trash2 size={14} />
                          Discard
                        </button>
                      </div>

                      {saving && (
                        <p className="text-center text-[10px] text-[#756E68] mt-3">
                          Saving recipe...
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="mt-7 bg-[#F1FAF3] border border-[#D7EBD9] text-[#4C8053] text-xs font-medium px-4 py-3 rounded-xl flex items-center justify-center gap-2">
                      <BookmarkCheck size={15} />
                      Recipe saved to your Cookbook!
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}