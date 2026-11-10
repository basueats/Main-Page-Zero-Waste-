import React, { useState } from 'react';
import { PROBLEM_SOLUTION_DATA } from '../data/mockData';
import {
  AlertTriangle,
  Lightbulb,
  Wrench,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingDown,
  DollarSign,
  HeartHandshake,
  Trash2,
  ShieldAlert,
  ChefHat,
  Leaf
} from 'lucide-react';

interface ProblemSolutionSectionProps {
  onGoToDashboard: () => void;
  onGoToRecipes: () => void;
}

export const ProblemSolutionSection: React.FC<ProblemSolutionSectionProps> = ({
  onGoToDashboard,
  onGoToRecipes
}) => {
  const [activeTab, setActiveTab] = useState<'problem' | 'whatWeCanDo' | 'howToFixIt' | 'solutions' | 'howAppSolves'>(
    'problem'
  );

  // Interactive Live Scrap Simulator
  const [selectedScrap, setSelectedScrap] = useState<'bread' | 'stalks' | 'citrus' | 'buffet'>('bread');

  const scrapSimulations = {
    bread: {
      name: 'Day-Old Sourdough & Baguettes',
      station: 'Pastry / Bakery Counter',
      quantity: '18.5 kg daily waste',
      problemReason: 'Staling crusts binned every morning before opening.',
      costLost: '$268 USD / week',
      appAction: 'Matched with "Stale Sourdough Miso & Toasted Caramel"',
      upcycleOutcome: 'Converted into savoury umami glaze for grilled vegetables.',
      communityAlternative: 'Or 1-click broadcast 45 portions to St. Jude Community Dining Room.',
      marginBoost: '+$14.50 / kg saved'
    },
    stalks: {
      name: 'Broccoli & Cauliflower Woody Stems',
      station: 'Prep Station',
      quantity: '14.0 kg per prep shift',
      problemReason: 'Flaking and trimming florets while throwing sweet core stems into compost.',
      costLost: '$190 USD / week',
      appAction: 'Matched with "Broccoli Stalk Carpaccio with Preserved Lemon"',
      upcycleOutcome: 'Shaved thin into signature $14 raw appetizer with 100% stalk yield.',
      communityAlternative: 'Crated and sent to local youth soup kitchen for wholesome vegetable stews.',
      marginBoost: '+$9.80 / kg saved'
    },
    citrus: {
      name: 'Spent Lemon, Orange & Lime Husks',
      station: 'Bar & Juice Station',
      quantity: '12.0 kg juiced rinds weekly',
      problemReason: 'Juice extracted; aromatic essential oil peels discarded immediately.',
      costLost: '$145 USD / week',
      appAction: 'Matched with "Citrus Peel Oleo Saccharum & Cordial"',
      upcycleOutcome: 'Cold sugar maceration extracts $60/L cocktail cordial for bar service.',
      communityAlternative: 'Dehydrated and turned into natural citrus seasoning salts.',
      marginBoost: '+$18.00 / kg saved'
    },
    buffet: {
      name: 'Unserved Roasted Vegetables & Grain Trays',
      station: 'Banquet & Hot Line',
      quantity: '26 portions overproduction',
      problemReason: 'Left in holding pans; staff discard due to food safety uncertainty.',
      costLost: '$320 USD per banquet',
      appAction: 'Triggered Community Food Rescue Dispatch Alert',
      upcycleOutcome: 'Blast-chilled under Good Samaritan protocol (<4°C in 90 mins).',
      communityAlternative: 'Picked up within 45 mins by Harbor City Food Rescue Coalition.',
      marginBoost: '100% Tax & CSR Deduction'
    }
  };

  const currentSim = scrapSimulations[selectedScrap];

  return (
    <div className="py-16 sm:py-24 bg-white" id="problem-solution">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            STRATEGIC BREAKDOWN
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-neutral-900 tracking-tight">
            The Circular Kitchen Journey
          </h2>
          <p className="text-base text-neutral-600 leading-relaxed">
            Understand the root cause of kitchen waste, what we can do to shift it, how to systematically fix it, and how Zero waste by Supritamone delivers the complete operational solution.
          </p>
        </div>

        {/* 5-Section Nav Tabs */}
        <div className="flex items-center justify-center">
          <div className="bg-neutral-100 p-1.5 rounded-2xl flex flex-wrap gap-1 border border-neutral-200/80 shadow-inner">
            <button
              onClick={() => setActiveTab('problem')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'problem'
                  ? 'bg-black text-white shadow-md'
                  : 'text-neutral-600 hover:text-black hover:bg-neutral-200/50'
              }`}
            >
              1. What is the Problem?
            </button>
            <button
              onClick={() => setActiveTab('whatWeCanDo')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'whatWeCanDo'
                  ? 'bg-black text-white shadow-md'
                  : 'text-neutral-600 hover:text-black hover:bg-neutral-200/50'
              }`}
            >
              2. What We Can Do
            </button>
            <button
              onClick={() => setActiveTab('howToFixIt')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'howToFixIt'
                  ? 'bg-black text-white shadow-md'
                  : 'text-neutral-600 hover:text-black hover:bg-neutral-200/50'
              }`}
            >
              3. How to Fix It
            </button>
            <button
              onClick={() => setActiveTab('solutions')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'solutions'
                  ? 'bg-black text-white shadow-md'
                  : 'text-neutral-600 hover:text-black hover:bg-neutral-200/50'
              }`}
            >
              4. The Solutions
            </button>
            <button
              onClick={() => setActiveTab('howAppSolves')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'howAppSolves'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>5. How This App Solves It</span>
            </button>
          </div>
        </div>

        {/* TAB 1: WHAT IS THE PROBLEM? */}
        {activeTab === 'problem' && (
          <div className="bg-[#fafbfc] border border-neutral-200 rounded-3xl p-8 sm:p-12 space-y-10 animate-fadeIn">
            <div className="max-w-3xl space-y-2">
              <span className="text-xs font-bold text-red-600 tracking-wider uppercase font-mono">
                {PROBLEM_SOLUTION_DATA.problem.badge}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-heading text-neutral-900">
                {PROBLEM_SOLUTION_DATA.problem.title}
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                {PROBLEM_SOLUTION_DATA.problem.subtitle}
              </p>
            </div>

            {/* Big Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PROBLEM_SOLUTION_DATA.problem.stats.map((stat, i) => (
                <div key={i} className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-2">
                  <span className="text-3xl sm:text-4xl font-extrabold font-heading text-neutral-900 tracking-tight">
                    {stat.value}
                  </span>
                  <h4 className="text-sm font-bold text-neutral-800">{stat.label}</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">{stat.detail}</p>
                </div>
              ))}
            </div>

            {/* Pain Points Grid */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Core Breakdown in the Brigade Workflow
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PROBLEM_SOLUTION_DATA.problem.painPoints.map((p, idx) => (
                  <div key={idx} className="bg-white border border-neutral-200/90 rounded-2xl p-5 flex items-start space-x-3.5">
                    <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Trash2 className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <h5 className="text-sm font-bold text-neutral-900">{p.title}</h5>
                      <p className="text-xs text-neutral-600 leading-relaxed">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WHAT WE CAN DO */}
        {activeTab === 'whatWeCanDo' && (
          <div className="bg-[#fafbfc] border border-neutral-200 rounded-3xl p-8 sm:p-12 space-y-10 animate-fadeIn">
            <div className="max-w-3xl space-y-2">
              <span className="text-xs font-bold text-emerald-600 tracking-wider uppercase font-mono">
                {PROBLEM_SOLUTION_DATA.whatWeCanDo.badge}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-heading text-neutral-900">
                {PROBLEM_SOLUTION_DATA.whatWeCanDo.title}
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                {PROBLEM_SOLUTION_DATA.whatWeCanDo.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {PROBLEM_SOLUTION_DATA.whatWeCanDo.pillars.map((pillar, idx) => (
                <div key={idx} className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
                    0{idx + 1}
                  </div>
                  <h4 className="text-base font-bold text-neutral-900">{pillar.title}</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">{pillar.desc}</p>
                </div>
              ))}
            </div>

            {/* Chef Quote banner */}
            <div className="bg-neutral-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <p className="text-base sm:text-lg italic font-serif">
                  "Zero-waste cooking isn’t about eating peelings out of pity. It’s about culinary skill. High technique transforms onion skins into gold."
                </p>
                <p className="text-xs text-neutral-400">
                  — Zero Waste Commercial Kitchen Brigade Ethos
                </p>
              </div>
              <button
                onClick={onGoToRecipes}
                className="px-6 py-3 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-neutral-100 whitespace-nowrap"
              >
                Explore Upcycled Recipes
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: HOW TO FIX IT */}
        {activeTab === 'howToFixIt' && (
          <div className="bg-[#fafbfc] border border-neutral-200 rounded-3xl p-8 sm:p-12 space-y-10 animate-fadeIn">
            <div className="max-w-3xl space-y-2">
              <span className="text-xs font-bold text-teal-700 tracking-wider uppercase font-mono">
                {PROBLEM_SOLUTION_DATA.howToFixIt.badge}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-heading text-neutral-900">
                {PROBLEM_SOLUTION_DATA.howToFixIt.title}
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                {PROBLEM_SOLUTION_DATA.howToFixIt.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {PROBLEM_SOLUTION_DATA.howToFixIt.steps.map((st) => (
                <div key={st.step} className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-3 relative overflow-hidden">
                  <span className="text-4xl font-extrabold font-heading text-neutral-100 absolute top-4 right-4 pointer-events-none">
                    {st.step}
                  </span>
                  <span className="text-xs font-bold text-teal-600 font-mono">Step {st.step}</span>
                  <h4 className="text-base font-bold text-neutral-900">{st.title}</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">{st.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: THE SOLUTIONS */}
        {activeTab === 'solutions' && (
          <div className="bg-[#fafbfc] border border-neutral-200 rounded-3xl p-8 sm:p-12 space-y-10 animate-fadeIn">
            <div className="max-w-3xl space-y-2">
              <span className="text-xs font-bold text-emerald-600 tracking-wider uppercase font-mono">
                {PROBLEM_SOLUTION_DATA.solutions.badge}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-heading text-neutral-900">
                {PROBLEM_SOLUTION_DATA.solutions.title}
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                {PROBLEM_SOLUTION_DATA.solutions.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PROBLEM_SOLUTION_DATA.solutions.items.map((sol, idx) => (
                <div key={idx} className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 font-bold">
                    ✓
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-base font-bold text-neutral-900">{sol.title}</h4>
                    <p className="text-xs text-neutral-600 leading-relaxed">{sol.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: HOW THIS APPLICATION CAN SOLVE THE PROBLEM (Interactive Simulator) */}
        {activeTab === 'howAppSolves' && (
          <div className="bg-[#fafbfc] border-2 border-emerald-500/40 rounded-3xl p-8 sm:p-12 space-y-8 animate-fadeIn shadow-lg">
            <div className="max-w-3xl space-y-2">
              <span className="text-xs font-bold text-emerald-700 tracking-wider uppercase font-mono bg-emerald-100/70 px-2.5 py-0.5 rounded">
                LIVE INTERACTIVE APPLICATION DEMO
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-heading text-neutral-900">
                How Zero waste by Supritamone Solves Kitchen Waste in Seconds
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Select a common commercial scrap or zero waste byproduct item below to experience how the application detects it, matches it with verified recipes, and protects your margins.
              </p>
            </div>

            {/* Scrap Selector Buttons */}
            <div className="flex flex-wrap gap-2.5">
              {[
                { id: 'bread', label: '🍞 Stale Sourdough & Bakery' },
                { id: 'stalks', label: '🥦 Broccoli & Brassica Stems' },
                { id: 'citrus', label: '🍋 Citrus Peels & Bar Residuals' },
                { id: 'buffet', label: '🍲 Unserved Banquet Mains' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setSelectedScrap(btn.id as any)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    selectedScrap === btn.id
                      ? 'bg-black text-white shadow-md'
                      : 'bg-white text-neutral-700 border border-neutral-300 hover:border-black'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Interactive Result Card */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-5">
                <div>
                  <span className="text-xs font-mono font-bold text-neutral-500 uppercase">
                    Station: {currentSim.station}
                  </span>
                  <h4 className="text-xl font-bold font-heading text-neutral-900 mt-0.5">
                    {currentSim.name}
                  </h4>
                  <p className="text-xs text-red-600 font-medium mt-1">
                    Typical Loss: {currentSim.problemReason}
                  </p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl px-4 py-2 text-right">
                  <span className="text-[10px] text-emerald-800 font-bold uppercase block">Recovered Margin</span>
                  <span className="text-lg font-bold font-mono text-emerald-700">{currentSim.marginBoost}</span>
                </div>
              </div>

              {/* 3-Step App Resolution Flow */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center space-x-2 text-neutral-800 font-bold">
                    <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px]">1</span>
                    <span>Inventory Tracking</span>
                  </div>
                  <p className="text-neutral-600">
                    Cook logs batch ({currentSim.quantity}). Freshness countdown warns before staling occurs.
                  </p>
                </div>

                <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-900 font-bold">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">2</span>
                    <span>Algorithm Recipe Match</span>
                  </div>
                  <p className="text-emerald-800 font-medium">
                    {currentSim.appAction}
                  </p>
                  <p className="text-[11px] text-neutral-600">
                    {currentSim.upcycleOutcome}
                  </p>
                </div>

                <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center space-x-2 text-blue-900 font-bold">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">3</span>
                    <span>Community Food Rescue</span>
                  </div>
                  <p className="text-blue-800 font-medium">
                    {currentSim.communityAlternative}
                  </p>
                </div>
              </div>

              {/* Action Buttons to test live */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-neutral-100">
                <span className="text-xs text-neutral-500">
                  Ready to test this in your kitchen?
                </span>
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <button
                    onClick={onGoToRecipes}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800"
                  >
                    View All Recipes
                  </button>
                  <button
                    onClick={onGoToDashboard}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-lg text-xs font-bold bg-black hover:bg-neutral-800 text-white flex items-center justify-center space-x-1.5"
                  >
                    <span>Launch Live Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
