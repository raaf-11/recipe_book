import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full">
      {/* Search Icon */}
      <Search
        className="
          absolute
          left-4
          sm:left-5
          top-1/2
          -translate-y-1/2
          w-4
          h-4
          sm:w-[18px]
          sm:h-[18px]
          text-[#8B847D]
          pointer-events-none
        "
        strokeWidth={2}
      />

      {/* Search Input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search recipes, ingredients, or categories..."
        className="
          w-full
          h-11
          sm:h-12
          lg:h-14

          pl-11
          sm:pl-12
          lg:pl-13

          pr-4
          sm:pr-5

          rounded-full
          bg-white
          border border-[#E7E0D9]

          shadow-[0_4px_18px_rgba(70,45,25,0.06)]

          focus:outline-none
          focus:border-[#F47A32]
          focus:ring-2
          focus:ring-[#F47A32]/15

          text-sm
          lg:text-[15px]
          text-[#24211F]

          placeholder:text-[#B5AEA7]

          transition-all
          duration-200
        "
      />
    </div>
  );
}