import React from 'react';
import SearchBar from './SearchBar';

export default function Hero({
  searchValue,
  setSearchValue,
}) {
  return (
    <section
      className="px-4 py-12 sm:py-14 lg:py-20"
      style={{ backgroundColor: '#FAF7F2' }}
    >
      <div className="w-full max-w-4xl mx-auto text-center">

        {/* Main Title */}
        <h1
          className="
            text-3xl
            sm:text-4xl
            lg:text-[46px]
            xl:text-[50px]
            leading-tight
            text-[#24211F]
          "
          style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
          }}
        >
          Discover Your Next Favorite Recipe
        </h1>

        {/* Subtitle */}
        <p
          className="
            mt-3
            sm:mt-4
            text-sm
            sm:text-base
            text-[#625C57]
          "
          style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
          }}
        >
          Browse hundreds of delicious recipes from breakfast to desserts.
        </p>

        {/* Search */}
        <div className="mt-6 sm:mt-7 w-full max-w-2xl mx-auto">
          <SearchBar
            value={searchValue}
            onChange={setSearchValue}
          />
        </div>

      </div>
    </section>
  );
}