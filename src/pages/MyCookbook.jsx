import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Bookmark,
  ChefHat,
  Clock3,
  Plus,
  X,
} from 'lucide-react'

import Navbar from '../components/Navbar'
import { getSavedRecipes, unsaveRecipe } from '../api/cookbook'
import { fetchMyRecipes } from '../api/recipes'

export default function MyCookbook() {
  const [savedRecipes, setSavedRecipes] = useState([])
  const [myRecipes, setMyRecipes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCookbook() {
      try {
        // Fetch both in parallel
        const [saved, mine] = await Promise.all([
          getSavedRecipes(),
          fetchMyRecipes(),
        ])

        setSavedRecipes(saved)
        setMyRecipes(mine)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadCookbook()
  }, [])

  async function handleUnsave(recipeId) {
    try {
      await unsaveRecipe(recipeId)

      setSavedRecipes((prev) =>
        prev.filter((recipe) => recipe.id !== recipeId)
      )
    } catch (err) {
      alert(err.message)
    }
  }

  // Reusable recipe card
  function RecipeCard({ recipe, onRemove }) {
    return (
      <Link
        to={`/recipe/${recipe.id}`}
        className="
          group
          block
          bg-white
          border
          border-[#E9E4DF]
          rounded-2xl
          overflow-hidden
          shadow-[0_4px_16px_rgba(36,33,31,0.04)]
          transition-all
          duration-300
          hover:-translate-y-1.5
          hover:shadow-[0_12px_28px_rgba(36,33,31,0.10)]
        "
      >
        {/* Image */}
        <div className="relative h-[210px] sm:h-[225px] lg:h-[240px] overflow-hidden">
          <img
            src={
              recipe.image ||
              'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800'
            }
            alt={recipe.title}
            className="
              w-full
              h-full
              object-cover
              transition-transform
              duration-500
              group-hover:scale-[1.03]
            "
          />

          {/* Category */}
          {recipe.category && (
            <span
              className="
                absolute
                top-3
                left-3
                px-3
                py-1
                rounded-full
                bg-[#FFE4D0]
                text-[#7A3517]
                text-[10px]
                font-medium
              "
            >
              {recipe.category}
            </span>
          )}

          {/* Remove */}
          {onRemove && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onRemove(recipe.id)
              }}
              className="
                absolute
                top-3
                right-3
                w-8
                h-8
                rounded-full
                bg-white/95
                backdrop-blur-sm
                flex
                items-center
                justify-center
                text-[#625C57]
                hover:text-red-500
                hover:bg-white
                transition-colors
                shadow-sm
              "
              aria-label="Remove from cookbook"
            >
              <X size={15} strokeWidth={2} />
            </button>
          )}
        </div>

        {/* Card content */}
        <div className="p-4 sm:p-5">
          <h3
            className="
              text-lg
              sm:text-xl
              text-[#24211F]
              leading-tight
              line-clamp-2
              transition-colors
              group-hover:text-[#C85A1C]
            "
            style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
            }}
          >
            {recipe.title}
          </h3>

          {/* Metadata */}
          <div className="flex items-center gap-4 mt-3 text-[11px] text-[#756E68]">
            {recipe.time && (
              <div className="flex items-center gap-1.5">
                <Clock3 size={13} strokeWidth={1.8} />
                <span>{recipe.time}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F7FC]">
      <Navbar />

      <main className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-10 sm:py-12 lg:py-16">
        {/* =====================================================
            PAGE HEADER
        ====================================================== */}
        <section className="mb-8 lg:mb-10">
          <h1
            className="
              text-4xl
              sm:text-5xl
              lg:text-[50px]
              text-[#24211F]
              leading-tight
            "
            style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
            }}
          >
            My Cookbook
          </h1>

          <p className="mt-2 text-sm sm:text-[15px] text-[#625C57]">
            All your saved and personal recipes in one place.
          </p>
        </section>

        {/* =====================================================
            SUMMARY CARDS
        ====================================================== */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5 mb-10">
          {/* Saved recipes */}
          <div
            className="
              bg-white
              border
              border-[#E9E4DF]
              rounded-2xl
              px-5
              py-5
              flex
              items-center
              gap-4
              shadow-[0_3px_14px_rgba(36,33,31,0.03)]
            "
          >
            <div
              className="
                w-11
                h-11
                rounded-full
                bg-[#FFF0E5]
                text-[#C85A1C]
                flex
                items-center
                justify-center
                shrink-0
              "
            >
              <Bookmark size={19} strokeWidth={1.8} />
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.08em] text-[#756E68]">
                Saved Recipes
              </p>

              <p className="text-2xl font-semibold text-[#24211F] mt-0.5">
                {savedRecipes.length}
              </p>
            </div>
          </div>

          {/* My recipes */}
          <div
            className="
              bg-white
              border
              border-[#E9E4DF]
              rounded-2xl
              px-5
              py-5
              flex
              items-center
              gap-4
              shadow-[0_3px_14px_rgba(36,33,31,0.03)]
            "
          >
            <div
              className="
                w-11
                h-11
                rounded-full
                bg-[#F8E8DC]
                text-[#C85A1C]
                flex
                items-center
                justify-center
                shrink-0
              "
            >
              <ChefHat size={19} strokeWidth={1.8} />
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.08em] text-[#756E68]">
                My Recipes
              </p>

              <p className="text-2xl font-semibold text-[#24211F] mt-0.5">
                {myRecipes.length}
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================
            SAVED RECIPES
        ====================================================== */}
        <section className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5">
            <div>
              <div className="flex items-center gap-2">
                <h2
                  className="text-2xl sm:text-3xl text-[#24211F]"
                  style={{
                    fontFamily: "'DM Serif Display', Georgia, serif",
                  }}
                >
                  Saved Recipes
                </h2>

                <span className="text-xs text-[#756E68]">
                  ({savedRecipes.length})
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#756E68] mt-1">
                Recipes you've saved for later.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center">
              <p className="text-sm text-[#756E68]">
                Loading your cookbook...
              </p>
            </div>
          ) : savedRecipes.length === 0 ? (
            <div
              className="
                bg-white
                border
                border-dashed
                border-[#E7E0D9]
                rounded-2xl
                px-6
                py-14
                text-center
              "
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-[#FFF0E5] flex items-center justify-center text-[#C85A1C]">
                <Bookmark size={20} strokeWidth={1.8} />
              </div>

              <h3
                className="text-xl text-[#24211F] mt-4"
                style={{
                  fontFamily: "'DM Serif Display', Georgia, serif",
                }}
              >
                Your cookbook is waiting
              </h3>

              <p className="text-sm text-[#756E68] mt-1.5">
                Browse recipes and save your favorites here.
              </p>

              <Link
                to="/"
                className="
                  inline-flex
                  items-center
                  justify-center
                  mt-5
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
                Discover Recipes
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
              {savedRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onRemove={handleUnsave}
                />
              ))}
            </div>
          )}
        </section>

        {/* =====================================================
            MY OWN RECIPES
        ====================================================== */}
        <section className="pt-8 border-t border-[#E7E0D9]">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5">
            <div>
              <div className="flex items-center gap-2">
                <h2
                  className="text-2xl sm:text-3xl text-[#24211F]"
                  style={{
                    fontFamily: "'DM Serif Display', Georgia, serif",
                  }}
                >
                  My Recipes
                </h2>

                <span className="text-xs text-[#756E68]">
                  ({myRecipes.length})
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#756E68] mt-1">
                Recipes you've created yourself.
              </p>
            </div>

            <Link
              to="/submit"
              className="
                inline-flex
                items-center
                justify-center
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
                shrink-0
              "
            >
              <Plus size={15} strokeWidth={2} />
              Add Recipe
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center">
              <p className="text-sm text-[#756E68]">
                Loading your recipes...
              </p>
            </div>
          ) : myRecipes.length === 0 ? (
            <div
              className="
                bg-white
                border
                border-dashed
                border-[#E7E0D9]
                rounded-2xl
                px-6
                py-14
                text-center
              "
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-[#F8E8DC] flex items-center justify-center text-[#C85A1C]">
                <ChefHat size={20} strokeWidth={1.8} />
              </div>

              <h3
                className="text-xl text-[#24211F] mt-4"
                style={{
                  fontFamily: "'DM Serif Display', Georgia, serif",
                }}
              >
                Create your first recipe
              </h3>

              <p className="text-sm text-[#756E68] mt-1.5">
                Share your own recipes with your cookbook.
              </p>

              <Link
                to="/submit"
                className="
                  inline-flex
                  items-center
                  gap-2
                  mt-5
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
                <Plus size={15} />
                Add Recipe
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
              {myRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}