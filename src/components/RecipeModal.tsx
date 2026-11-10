import React from 'react';
import { UpcycledRecipe } from '../types';
import { X, Clock, Award, DollarSign, Leaf, Sparkles, ChefHat, Check, Printer } from 'lucide-react';

interface RecipeModalProps {
  recipe: UpcycledRecipe | null;
  onClose: () => void;
  onOpenDonationFromRecipe?: (recipe: UpcycledRecipe) => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, onClose }) => {
  if (!recipe) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white border border-neutral-200 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl text-neutral-900 max-h-[92vh] flex flex-col animate-fadeIn">
        {/* Header Image & Close */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden flex-shrink-0">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-all border border-white/20"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white text-black">
                {recipe.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500 text-black">
                {recipe.wasteReductionRate}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-black/60 text-white border border-white/10">
                Station: {recipe.station}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">
              {recipe.title}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Key Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-neutral-50 p-3.5 rounded-2xl border border-neutral-200">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-neutral-600" />
              <div>
                <p className="text-[10px] text-neutral-400 uppercase font-bold">Prep Time</p>
                <p className="text-xs font-bold text-neutral-900">{recipe.prepTime}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-neutral-600" />
              <div>
                <p className="text-[10px] text-neutral-400 uppercase font-bold">Brigade Level</p>
                <p className="text-xs font-bold text-neutral-900">{recipe.difficulty}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <div>
                <p className="text-[10px] text-neutral-400 uppercase font-bold">Saved / Kg</p>
                <p className="text-xs font-bold text-emerald-700">${recipe.costSavingsPerKg.toFixed(2)} USD</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <div>
                <p className="text-[10px] text-neutral-400 uppercase font-bold">CO2e Offset</p>
                <p className="text-xs font-bold text-neutral-900">{recipe.co2OffsetKg} kg</p>
              </div>
            </div>
          </div>

          {/* Hero Zero Waste Highlight */}
          <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-2xl flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                Hero Upcycled Trimming
              </p>
              <p className="text-sm text-neutral-900 font-bold">
                {recipe.zeroWasteHeroIngredient}
              </p>
              <p className="text-xs text-neutral-600 mt-1">
                {recipe.description}
              </p>
            </div>
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Ingredients */}
            <div className="md:col-span-5 bg-neutral-50 border border-neutral-200 rounded-2xl p-4">
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>Brigade Formula</span>
                <span className="text-[10px] text-neutral-500 font-normal">Commercial Yield</span>
              </h3>
              <ul className="space-y-2 text-xs">
                {recipe.ingredients.map((ing, idx) => (
                  <li key={idx} className="flex items-center justify-between pb-2 border-b border-neutral-200/80">
                    <div className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      <span className={ing.isZeroWaste ? "text-emerald-800 font-bold" : "text-neutral-700"}>
                        {ing.item}
                      </span>
                    </div>
                    <span className="font-mono text-neutral-500 font-bold">{ing.amount}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Preparation Steps */}
            <div className="md:col-span-7 space-y-3">
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">
                Execution Steps
              </h3>
              <div className="space-y-3">
                {recipe.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start space-x-3 text-xs leading-relaxed">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-neutral-900 text-white font-bold text-[11px] flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <p className="text-neutral-700 pt-0.5">{step}</p>
                  </div>
                ))}
              </div>

              {/* Chef's Pro Tip */}
              <div className="mt-4 bg-neutral-100 border-l-2 border-black p-3.5 rounded-r-xl text-xs">
                <div className="flex items-center space-x-1.5 text-neutral-900 font-bold mb-1">
                  <ChefHat className="w-3.5 h-3.5" />
                  <span>Executive Culinary Operational Advice</span>
                </div>
                <p className="text-neutral-600 italic">"{recipe.chefTip}"</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between flex-shrink-0">
          <span className="text-xs text-neutral-400">Zero waste by Supritamone • Culinary Specs</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-2 rounded-lg text-xs font-semibold bg-white text-neutral-700 border border-neutral-300 hover:text-black flex items-center space-x-1"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Sheet</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg text-xs font-bold bg-black text-white hover:bg-neutral-800"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
