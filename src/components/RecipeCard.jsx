import React from 'react'
import { Clock, Trash2 } from 'lucide-react'

export default function RecipeCard({
  recipe,
  currentUserId,
  onClickCard,
  onDelete,
}) {
  const {
    id,
    title,
    category,
    cuisine,
    time,
    description,
    image,
    userId,
    authorId,
  } = recipe

  // Use category for the current recipe structure.
  // Keep cuisine as a fallback for older recipes.
  const recipeCategory = category || cuisine

  // Recipes from the API may use either userId or authorId
  const ownerId = userId ?? authorId

  const canDelete = Boolean(
    onDelete &&
      currentUserId &&
      ownerId &&
      String(currentUserId) === String(ownerId)
  )

  return (
    <article
      onClick={() => onClickCard?.(recipe)}
      className="
        group
        bg-white
        rounded-2xl
        overflow-hidden
        border border-[#E9E4DF]
        shadow-[0_4px_14px_rgba(0,0,0,0.06)]

        flex
        flex-col

        cursor-pointer

        transition-all
        duration-300
        ease-out

        hover:-translate-y-2
        hover:scale-[1.02]
        hover:shadow-[0_14px_30px_rgba(0,0,0,0.12)]
      "
    >
      {/* ================================
          RECIPE IMAGE
      ================================= */}

      <div
        className="
          relative
          h-[210px]
          sm:h-[230px]
          lg:h-[260px]
          xl:h-[280px]
          overflow-hidden
          cursor-pointer
        "
      >
        {image ? (
          <img
            src={image}
            alt={title}
            className="
              w-full
              h-full
              object-cover
              transition-transform
              duration-500
              ease-out
              group-hover:scale-105
            "
          />
        ) : (
          <div className="w-full h-full bg-[#F1EEE9] flex items-center justify-center">
            <span className="text-sm text-[#8A817A]">
              No image available
            </span>
          </div>
        )}

        {/* Category badge */}
        {recipeCategory && (
          <span
            className="
              absolute
              top-4
              left-4

              inline-flex
              items-center

              px-3
              py-1.5

              rounded-full

              bg-[#FFE4D0]
              text-[#7A3517]

              text-[10px]
              sm:text-[11px]

              font-semibold
              uppercase
              tracking-wide

              shadow-sm
            "
          >
            {recipeCategory}
          </span>
        )}

        {/* Delete button — owner only */}
        {canDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(id)
            }}
            aria-label={`Delete ${title}`}
            title="Delete Recipe"
            className="
              absolute
              top-4
              right-4

              w-9
              h-9
              sm:w-10
              sm:h-10

              rounded-full
              bg-white/90
              backdrop-blur-sm

              flex
              items-center
              justify-center

              text-[#625C57]
              shadow-md

              transition-all
              duration-200

              hover:bg-white
              hover:text-red-500
              hover:scale-110
              active:scale-95
            "
          >
            <Trash2
              className="w-4 h-4 sm:w-5 sm:h-5"
              strokeWidth={1.8}
            />
          </button>
        )}
      </div>

      {/* ================================
          CARD CONTENT
      ================================= */}

      <div
        className="
          px-5
          sm:px-6
          pt-5
          sm:pt-6
          pb-6
          sm:pb-7

          min-h-[175px]
          sm:min-h-[185px]
          lg:min-h-[195px]

          flex
          flex-col

          cursor-pointer
        "
      >
        {/* Cook Time */}
        <div
          className="
            flex
            items-center
            gap-1.5

            text-[#625C57]

            text-[11px]
            sm:text-xs

            font-medium

            mb-3
            sm:mb-4
          "
        >
          <Clock
            className="w-3.5 h-3.5 sm:w-4 sm:h-4"
            strokeWidth={1.8}
          />

          <span>{time}</span>
        </div>

        {/* Title */}
        <h3
          className="
            text-[19px]
            sm:text-[21px]
            lg:text-[22px]

            leading-tight
            font-bold

            text-[#24211F]

            mb-2
            sm:mb-3

            line-clamp-2

            transition-colors
            duration-200

            group-hover:text-[#C85D25]
          "
          style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
          }}
        >
          {title}
        </h3>

        {/* Description */}
        <p
          className="
            text-xs
            sm:text-sm

            leading-5
            sm:leading-6

            text-[#756E68]

            line-clamp-3
          "
        >
          {description}
        </p>
      </div>
    </article>
  )
}