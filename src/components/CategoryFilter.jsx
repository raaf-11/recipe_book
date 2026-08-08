import React from 'react';

const DEFAULT_CATEGORIES = [
  'All',
  'Breakfast',
  'Lunch',
  'Dinner',
  'Dessert',
];

export default function CategoryFilter({
  categories = DEFAULT_CATEGORIES,
  selectedCategory,
  onSelectCategory,
}) {
  return (
    <div
      className="
        flex
        w-full
        overflow-x-auto
        pb-3
        mb-8
        sm:mb-10
        gap-2.5
        sm:gap-3
        snap-x
        hide-scrollbar
      "
    >
      {categories.map((category) => {
        const isActive = selectedCategory === category;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onSelectCategory(category)}
            className={`
              whitespace-nowrap
              px-5
              sm:px-6
              py-2.5
              rounded-full
              text-sm
              font-semibold
              shrink-0
              snap-start
              border
              transition-all
              duration-200
              ease-out
              focus:outline-none

              ${
                isActive
                  ? `
                    bg-[#F47A32]
                    text-white
                    border-[#F47A32]
                    shadow-[0_4px_12px_rgba(244,122,50,0.25)]
                  `
                  : `
                    bg-white
                    text-[#625C57]
                    border-[#E5DED7]

                    hover:bg-[#F47A32]
                    hover:text-white
                    hover:border-[#F47A32]
                    hover:scale-[1.04]
                    hover:shadow-[0_5px_14px_rgba(244,122,50,0.25)]
                  `
              }
            `}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}