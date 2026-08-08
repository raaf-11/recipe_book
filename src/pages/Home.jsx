import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Hero from '../components/Hero';
import CategoryFilter from '../components/CategoryFilter';
import RecipeCard from '../components/RecipeCard';
import { fetchRecipes, deleteRecipe } from '../api/recipes';
import { useAuth } from '../context/AuthContext';
import { Search } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Breakfast',
  'Lunch',
  'Dinner',
  'Dessert',
];

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // -----------------------------------------
  // FETCH RECIPES
  // -----------------------------------------

  useEffect(() => {
    let cancelled = false;

    async function loadRecipes() {
      try {
        setLoading(true);
        setError('');

        const data = await fetchRecipes({
          category:
            selectedCategory === 'All'
              ? undefined
              : selectedCategory,
          search: searchValue,
        });

        if (!cancelled) {
          setRecipes(data);
        }
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setError(
            'Could not load recipes. Is the server running?'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadRecipes();

    return () => {
      cancelled = true;
    };
  }, [selectedCategory, searchValue]);

  // -----------------------------------------
  // DELETE RECIPE
  // -----------------------------------------

  async function handleDelete(id) {
    const confirmed = window.confirm(
      'Delete this recipe? This cannot be undone.'
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteRecipe(id);

      setRecipes((prev) =>
        prev.filter((recipe) => recipe.id !== id)
      );
    } catch (err) {
      console.error(err);
      alert(err.message || 'Could not delete recipe.');
    }
  }

  // -----------------------------------------
  // CATEGORY CHANGE
  // -----------------------------------------

  function handleCategoryChange(category) {
    setSelectedCategory(category);
  }

  // -----------------------------------------
  // RESET FILTERS
  // -----------------------------------------

  function handleResetFilters() {
    setSearchValue('');
    setSelectedCategory('All');
  }

  // -----------------------------------------
  // RENDER
  // -----------------------------------------

  return (
    <MainLayout>

      {/* ================================
          HERO + SEARCH
      ================================= */}

      <Hero
        searchValue={searchValue}
        setSearchValue={setSearchValue}
      />

      {/* ================================
          RECIPE CONTENT
      ================================= */}

      <section
        className="py-10 md:py-12"
        style={{ backgroundColor: '#F8F7FC' }}
      >
        <div className="max-w-[1200px] mx-auto px-4 md:px-10">

          {/* Category Filters */}
          <CategoryFilter
            categories={CATEGORIES}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategoryChange}
          />

          {/* ================================
              LOADING
          ================================= */}

          {loading && (
            <div className="flex justify-center items-center py-20">
              <p className="text-sm text-[#625C57]">
                Loading recipes...
              </p>
            </div>
          )}

          {/* ================================
              ERROR
          ================================= */}

          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-20 text-center">

              <p className="text-red-500 text-sm mb-4">
                {error}
              </p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 rounded-full bg-[#F47A32] text-white text-sm font-semibold hover:bg-[#E96820] transition-colors"
              >
                Try Again
              </button>

            </div>
          )}

          {/* ================================
              RECIPES
          ================================= */}

          {!loading &&
            !error &&
            recipes.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {recipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    currentUserId={user?.id}
                    onClickCard={(recipe) => navigate(`/recipe/${recipe.id}`)}
                    onDelete={handleDelete}
                  />
                ))}

              </div>
            )}

          {/* ================================
              EMPTY STATE
          ================================= */}

          {!loading &&
            !error &&
            recipes.length === 0 && (
              <div className="flex flex-col items-center justify-center text-center py-20 px-6">

                <div className="w-16 h-16 rounded-full bg-[#FFF0E5] flex items-center justify-center mb-5">
                  <Search className="w-7 h-7 text-[#F47A32]" />
                </div>

                <h2
                  className="text-xl font-semibold text-[#24211F]"
                  style={{
                    fontFamily: "'DM Serif Display', Georgia, serif",
                  }}
                >
                  No recipes found
                </h2>

                <p className="mt-2 text-sm text-[#756E68] max-w-md">
                  We couldn't find any recipes matching your
                  search or selected category.
                </p>

                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-5 px-6 py-2.5 rounded-full bg-[#F47A32] text-white text-sm font-semibold hover:bg-[#E96820] transition-colors"
                >
                  Reset Filters
                </button>

              </div>
            )}

        </div>
      </section>

    </MainLayout>
  );
}