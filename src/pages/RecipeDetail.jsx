import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Clock3,
  Users,
  Share2,
  Trash2,
  Globe,
  Lock,
  ChefHat,
  Check,
} from 'lucide-react'

import Navbar from '../components/Navbar'
import {
  saveRecipe,
  unsaveRecipe,
  getSavedRecipes,
} from '../api/cookbook'
import { useAuth } from '../context/AuthContext'
import {
  fetchRecipeById,
  updateVisibility,
  deleteRecipe,
} from '../api/recipes'

export default function RecipeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [isPublic, setIsPublic] = useState(null)
  const [visibilityLoading, setVisibilityLoading] = useState(false)

  useEffect(() => {
    async function loadRecipe() {
      try {
        const data = await fetchRecipeById(id)
        setRecipe(data)
        setIsPublic(data.is_public === 1)
      } catch (err) {
        setError('Recipe not found.')
      } finally {
        setLoading(false)
      }
    }

    loadRecipe()
  }, [id])

  async function handleVisibilityToggle() {
    setVisibilityLoading(true)

    try {
      await updateVisibility(id, !isPublic)
      setIsPublic(!isPublic)
    } catch (err) {
      alert(err.message)
    } finally {
      setVisibilityLoading(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm('Delete this recipe? This cannot be undone.')) {
      return
    }

    try {
      await deleteRecipe(id)
      navigate('/')
    } catch (err) {
      alert(err.message)
    }
  }

  useEffect(() => {
    async function checkSaved() {
      if (!user) return

      try {
        const savedRecipes = await getSavedRecipes()
        const isSaved = savedRecipes.some(
          (recipe) => recipe.id === Number(id)
        )

        setSaved(isSaved)
      } catch (err) {
        // Not critical — silently fail
      }
    }

    checkSaved()
  }, [id, user])

  async function handleSave() {
    if (!user) {
      navigate('/login')
      return
    }

    setSaveLoading(true)

    try {
      if (saved) {
        await unsaveRecipe(id)
        setSaved(false)
      } else {
        await saveRecipe(Number(id))
        setSaved(true)
      }
    } catch (err) {
      alert(err.message)
    } finally {
      setSaveLoading(false)
    }
  }

  async function handleShare() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: recipe.title,
          text: recipe.description,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        alert('Recipe link copied!')
      }
    } catch (err) {
      // User cancelled sharing — do nothing
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F7FC]">
        <Navbar />

        <div className="flex items-center justify-center min-h-[70vh]">
          <p className="text-sm text-[#756E68]">
            Loading recipe...
          </p>
        </div>
      </div>
    )
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-[#F8F7FC]">
        <Navbar />

        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
          <div className="w-12 h-12 rounded-full bg-[#FFF0E5] text-[#C85A1C] flex items-center justify-center mb-4">
            <ChefHat size={20} />
          </div>

          <h1
            className="text-2xl text-[#24211F]"
            style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
            }}
          >
            Recipe not found
          </h1>

          <p className="text-sm text-[#756E68] mt-1">
            We couldn't find the recipe you're looking for.
          </p>

          <button
            onClick={() => navigate(-1)}
            className="
              mt-5
              inline-flex
              items-center
              gap-2
              px-5
              py-2.5
              rounded-full
              bg-[#F47A32]
              hover:bg-[#E96820]
              text-white
              text-xs
              font-medium
              transition-colors
            "
          >
            <ArrowLeft size={14} />
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const isOwner = user && recipe.user_id === user.id

  return (
    <div className="min-h-screen bg-[#F8F7FC]">
      <Navbar />

      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="relative bg-[#FAF7F2] overflow-hidden">
        <div className="relative h-[420px] sm:h-[470px] lg:h-[500px]">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Image overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/75 to-white/5" />

          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2] via-transparent to-transparent" />

          <div className="relative z-10 w-full max-w-[1400px] mx-auto h-full px-4 sm:px-6 lg:px-10 xl:px-12 flex items-center">
            <div className="max-w-[650px] pt-6 sm:pt-10">
              {/* Back */}
              <button
                onClick={() => navigate(-1)}
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  text-xs
                  text-[#625C57]
                  hover:text-[#C85A1C]
                  transition-colors
                  mb-8
                "
              >
                <ArrowLeft size={15} />
                Back
              </button>

              

              {/* Title */}
              <h1
                className="
                  mt-3
                  text-4xl
                  sm:text-5xl
                  lg:text-[54px]
                  xl:text-[58px]
                  leading-[1.02]
                  text-[#24211F]
                "
                style={{
                  fontFamily: "'DM Serif Display', Georgia, serif",
                }}
              >
                {recipe.title}
              </h1>

              {/* Description */}
              {recipe.description && (
                <p className="mt-4 max-w-[580px] text-sm sm:text-[15px] leading-relaxed text-[#625C57]">
                  {recipe.description}
                </p>
              )}

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-6 text-xs text-[#625C57]">
                <div className="flex items-center gap-1.5">
                  <Clock3
                    size={15}
                    strokeWidth={1.8}
                    className="text-[#C85A1C]"
                  />
                  <span>{recipe.time}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Users
                    size={15}
                    strokeWidth={1.8}
                    className="text-[#C85A1C]"
                  />
                  <span>{recipe.servings} servings</span>
                </div>
              </div>

              {/* Hero actions */}
              <div className="flex items-center gap-2 mt-6">
                <button
                  onClick={handleSave}
                  disabled={saveLoading}
                  className={`
                    inline-flex
                    items-center
                    gap-2
                    px-5
                    py-2.5
                    rounded-full
                    text-xs
                    font-medium
                    transition-colors
                    ${
                      saved
                        ? 'bg-[#F8E8DC] text-[#C85A1C] hover:bg-[#FFE4D0]'
                        : 'bg-[#F47A32] hover:bg-[#E96820] text-white'
                    }
                  `}
                >
                  {saved ? (
                    <BookmarkCheck size={15} />
                  ) : (
                    <Bookmark size={15} />
                  )}

                  {saveLoading
                    ? 'Saving...'
                    : saved
                      ? 'Saved'
                      : 'Save to Cookbook'}
                </button>

                <button
                  onClick={handleShare}
                  className="
                    w-10
                    h-10
                    rounded-full
                    bg-white/90
                    border
                    border-[#E7E0D9]
                    text-[#625C57]
                    flex
                    items-center
                    justify-center
                    hover:text-[#C85A1C]
                    hover:bg-white
                    transition-colors
                  "
                  aria-label="Share recipe"
                >
                  <Share2 size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}
      <main className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 lg:gap-8">
          {/* =================================================
              LEFT CONTENT
          ================================================== */}
          <div className="space-y-6">
            {/* Ingredients */}
            <section className="bg-white border border-[#E9E4DF] rounded-2xl p-6 sm:p-8 shadow-[0_4px_18px_rgba(36,33,31,0.04)]">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-full bg-[#FFF0E5] text-[#C85A1C] flex items-center justify-center">
                  <ChefHat size={16} />
                </div>

                <h2
                  className="text-2xl text-[#24211F]"
                  style={{
                    fontFamily: "'DM Serif Display', Georgia, serif",
                  }}
                >
                  Ingredients
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                {recipe.ingredients.map((ingredient, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3"
                  >
                    <span className="w-4 h-4 rounded-full border border-[#E7BFA8] mt-0.5 shrink-0" />

                    <p className="text-sm text-[#625C57] leading-relaxed">
                      {ingredient}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Instructions */}
            <section className="bg-white border border-[#E9E4DF] rounded-2xl p-6 sm:p-8 shadow-[0_4px_18px_rgba(36,33,31,0.04)]">
              <div className="flex items-center gap-2 mb-7">
                <div className="w-8 h-8 rounded-full bg-[#FFF0E5] text-[#C85A1C] flex items-center justify-center">
                  <Check size={16} />
                </div>

                <h2
                  className="text-2xl text-[#24211F]"
                  style={{
                    fontFamily: "'DM Serif Display', Georgia, serif",
                  }}
                >
                  Instructions
                </h2>
              </div>

              <div className="relative">
                {/* Timeline */}
                <div className="absolute left-[15px] top-4 bottom-4 w-px bg-[#E9E4DF]" />

                <ol className="space-y-5">
                  {recipe.steps.map((step, index) => (
                    <li
                      key={index}
                      className="relative flex items-start gap-4"
                    >
                      <div
                        className="
                          relative
                          z-10
                          w-8
                          h-8
                          rounded-full
                          bg-[#FFF0E5]
                          border
                          border-[#F3D2BE]
                          text-[#C85A1C]
                          flex
                          items-center
                          justify-center
                          text-xs
                          font-semibold
                          shrink-0
                        "
                      >
                        {index + 1}
                      </div>

                      <div className="flex-1 bg-[#FAF7F2] border border-[#E9E4DF] rounded-xl px-4 py-4">
                        <p className="text-sm text-[#625C57] leading-relaxed">
                          {step}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          </div>

          {/* =================================================
              RIGHT SIDEBAR
          ================================================== */}
          <aside className="space-y-5">
            {/* Actions */}
            <div className="bg-white border border-[#E9E4DF] rounded-2xl p-5 shadow-[0_4px_18px_rgba(36,33,31,0.04)]">
              <button
                onClick={handleSave}
                disabled={saveLoading}
                className={`
                  w-full
                  h-11
                  rounded-full
                  flex
                  items-center
                  justify-center
                  gap-2
                  text-xs
                  font-medium
                  transition-colors
                  ${
                    saved
                      ? 'bg-[#F8E8DC] text-[#C85A1C] hover:bg-[#FFE4D0]'
                      : 'bg-[#F47A32] hover:bg-[#E96820] text-white'
                  }
                `}
              >
                {saved ? (
                  <BookmarkCheck size={15} />
                ) : (
                  <Bookmark size={15} />
                )}

                {saveLoading
                  ? 'Saving...'
                  : saved
                    ? 'Saved to Cookbook'
                    : 'Save to Cookbook'}
              </button>

              {isOwner && (
                <>
                  {/* Visibility */}
                  <div className="mt-4 pt-4 border-t border-[#E9E4DF]">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5 text-[#C85A1C]">
                          {isPublic ? (
                            <Globe size={16} />
                          ) : (
                            <Lock size={16} />
                          )}
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-[#24211F]">
                            {isPublic ? 'Public Recipe' : 'Private Recipe'}
                          </p>

                          <p className="text-[10px] text-[#756E68] mt-0.5 leading-relaxed">
                            {isPublic
                              ? 'Visible on the Home page'
                              : 'Only visible in your Cookbook'}
                          </p>
                        </div>
                      </div>

                      <button
  type="button"
  onClick={handleVisibilityToggle}
  disabled={visibilityLoading}
  aria-label={isPublic ? 'Make recipe private' : 'Make recipe public'}
  className={`
    relative
    inline-flex
    items-center
    w-11
    h-6
    rounded-full
    shrink-0
    transition-colors
    duration-200
    ${
      isPublic
        ? 'bg-[#F47A32]'
        : 'bg-[#D8D0C9]'
    }
  `}
>
  <span
    className={`
      absolute
      top-1
      left-1
      w-4
      h-4
      rounded-full
      bg-white
      shadow-sm
      transition-transform
      duration-200
      ${
        isPublic
          ? 'translate-x-5'
          : 'translate-x-0'
      }
    `}
  />
</button>
                    </div>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={handleDelete}
                    className="
                      w-full
                      h-10
                      mt-4
                      rounded-full
                      border
                      border-red-100
                      bg-red-50
                      hover:bg-red-100
                      text-red-500
                      flex
                      items-center
                      justify-center
                      gap-2
                      text-xs
                      font-medium
                      transition-colors
                    "
                  >
                    <Trash2 size={14} />
                    Delete Recipe
                  </button>
                </>
              )}
            </div>

            {/* Recipe information */}
            <div className="bg-white border border-[#E9E4DF] rounded-2xl p-5 shadow-[0_4px_18px_rgba(36,33,31,0.04)]">
              <h3
                className="text-xl text-[#24211F] mb-5"
                style={{
                  fontFamily: "'DM Serif Display', Georgia, serif",
                }}
              >
                Recipe Info
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-[#625C57]">
                    <Clock3
                      size={14}
                      className="text-[#C85A1C]"
                    />
                    Time
                  </div>

                  <span className="font-medium text-[#24211F]">
                    {recipe.time}
                  </span>
                </div>

                <div className="h-px bg-[#E9E4DF]" />

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-[#625C57]">
                    <Users
                      size={14}
                      className="text-[#C85A1C]"
                    />
                    Servings
                  </div>

                  <span className="font-medium text-[#24211F]">
                    {recipe.servings}
                  </span>
                </div>

                {recipe.category && (
                  <>
                    <div className="h-px bg-[#E9E4DF]" />

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#625C57]">
                        Category
                      </span>

                      
                    </div>
                  </>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}