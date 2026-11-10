import React, { useState } from 'react';
import { UpcycledRecipe } from '../types';
import { UPCYCLED_RECIPES } from '../data/mockData';
import { Search, Sparkles, ChefHat, ArrowRight } from 'lucide-react';

interface AppRecipesViewProps {
  onOpenRecipe: (recipe: UpcycledRecipe) => void;
  onOpenAddInventory: () => void;
}

export const AppRecipesView: React.FC<AppRecipesViewProps> = ({
  onOpenRecipe,
  onOpenAddInventory
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  const categories = [
    'All',
    'Sauces & Stocks',
    'Ferments & Pickles',
    'Bakery & Pastry',
    'Condiments & Pastes',
    'Entrees'
  ];

  const filteredRecipes = UPCYCLED_RECIPES.filter(recipe => {
    const matchesCategory = selectedCategory === 'All' || recipe.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || recipe.difficulty === selectedDifficulty;
    const matchesSearch =
      recipe.title.toLowerCase().includes(search.toLowerCase()) ||
      recipe.zeroWasteHeroIngredient.toLowerCase().includes(search.toLowerCase()) ||
      recipe.description.toLowerCase().includes(search.toLowerCase()) ||
      recipe.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#fafbfc] py-12 px-4 sm:px-6 lg:px-8 text-neutral-900">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            THE ZERO WASTE RECIPE & BYPRODUCT CATALOGUE
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-neutral-900 tracking-tight">
            Zero-Waste Recipe Intelligence
          </h1>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Standard operating procedures and recipes designed for commercial kitchens to turn organic trimmings, stale bakery stock, spent citrus husks, and prep overproduction into high-margin culinary assets.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search byproduct (e.g. broccoli stalk, citrus peel, sourdough, onion skin)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black"
              />
            </div>

            <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
              <span className="text-xs text-neutral-500 font-bold uppercase">Brigade Level:</span>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-800 font-medium focus:outline-none focus:border-black"
              >
                <option value="All">All Levels</option>
                <option value="Essential Brigade">Essential Brigade</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Professional">Professional</option>
              </select>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-1.5 pt-2 border-t border-neutral-100">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mr-2">Discipline:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-black text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:text-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => onOpenRecipe(recipe)}
              className="bg-white border border-neutral-200 rounded-2xl overflow-hidden hover:border-black transition-all group cursor-pointer flex flex-col justify-between shadow-sm"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white text-black shadow-sm">
                  {recipe.wasteReductionRate}
                </span>
                <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500 text-black shadow-sm">
                  +${recipe.costSavingsPerKg.toFixed(2)}/kg
                </span>
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold text-emerald-800 uppercase tracking-wider">
                      Hero: {recipe.zeroWasteHeroIngredient}
                    </span>
                    <span className="text-neutral-400 font-mono">{recipe.prepTime}</span>
                  </div>

                  <h3 className="text-base font-bold text-neutral-900 group-hover:text-emerald-700 transition-colors">
                    {recipe.title}
                  </h3>

                  <p className="text-xs text-neutral-600 line-clamp-3 mt-2 leading-relaxed">
                    {recipe.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1 text-neutral-500">
                    <ChefHat className="w-3.5 h-3.5 text-black" />
                    <span>Station: {recipe.station}</span>
                  </div>

                  <span className="text-black font-bold group-hover:underline flex items-center">
                    Full Spec Sheet →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
