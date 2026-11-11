import React from 'react';
import { NavigationPage, UpcycledRecipe, ChefUserProfile } from '../types';
import { PRICING_PLANS } from '../data/mockData';
import { ProblemSolutionSection } from './ProblemSolutionSection';
import { FAQSection } from './FAQSection';
import {
  Star,
  Check,
  ArrowRight,
  Sparkles,
  BookOpen,
  ChefHat,
  Video,
  FileSpreadsheet,
  Users,
  LayoutDashboard,
  HeartHandshake
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (page: NavigationPage) => void;
  onOpenRecipe: (recipe: UpcycledRecipe) => void;
  onOpenBooking: () => void;
  onOpenPaymentAuth?: (planId?: string) => void;
  currentUser?: ChefUserProfile | null;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onOpenRecipe,
  onOpenBooking,
  onOpenPaymentAuth,
  currentUser
}) => {
  return (
    <div className="bg-white text-neutral-900">
      {/* Active Trial Confirmation Banner */}
      {currentUser?.planStatus === 'trial_active' && (
        <div className="bg-emerald-600 text-white px-4 py-3 shadow-inner animate-fadeIn">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded bg-black/30 text-[10px] font-bold uppercase tracking-wider">
                3-Day Trial Active
              </span>
              <span>
                Welcome, <strong>{currentUser.firstName} {currentUser.lastName}</strong> ({currentUser.workEmail})! 
                Your 3-Day Free Trial ($0 USD) is active with unrestricted access for 72 hours.
              </span>
            </div>
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-3 py-1 bg-white text-emerald-950 font-bold rounded-lg text-[11px] hover:bg-neutral-100 whitespace-nowrap cursor-pointer transition-all"
            >
              Open Live Dashboard →
            </button>
          </div>
        </div>
      )}
      {/* 1. HERO SECTION (Exactly matching image_bb109caa.png) */}
      <section className="pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Bold Typography & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black font-heading tracking-tighter text-black uppercase leading-none">
                ZERO WASTE
              </h1>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-neutral-900 tracking-tight">
                The <span className="font-bold">food waste</span> learning platform for chefs.
              </h2>

              <div className="space-y-2 text-sm sm:text-base text-neutral-600 leading-relaxed max-w-xl">
                <p>Learn how to plan low-waste menus and how to eliminate food waste from your kitchen.</p>
                <p>A catalogue of best practices, recipes, tips, tools and courses for food waste prevention.</p>
                <p className="font-medium text-neutral-900">All in one space for chefs. In your pocket. Ready when you need it.</p>
              </div>

              {/* Action Buttons: Solid Black & Outlined as in screenshot */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3">
                <button
                  onClick={() => {
                    if (onOpenPaymentAuth) {
                      onOpenPaymentAuth('trial');
                    } else {
                      onOpenBooking();
                    }
                  }}
                  className="px-8 py-4 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 text-center cursor-pointer"
                >
                  JOIN NOW
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById('problem-solution');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    else onNavigate('problem-solution');
                  }}
                  className="px-8 py-4 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 text-center"
                >
                  LEARN MORE
                </button>
              </div>

              {/* Quick links to Dashboard */}
              <div className="pt-2 flex items-center space-x-4 text-xs text-neutral-500">
                <span className="flex items-center text-emerald-700 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-ping" />
                  Live Kitchen Inventory & Alert Suite Included
                </span>
                <span>•</span>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="underline hover:text-black font-medium"
                >
                  Launch Live Dashboard →
                </button>
              </div>
            </div>

            {/* Right Column: Hero Visual with Phone Mockups */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Clean Phone Mockup Container */}
                <div className="relative mx-auto rounded-[2.5rem] bg-neutral-950 p-3 shadow-2xl border-4 border-neutral-800 max-w-[310px]">
                  {/* Phone screen */}
                  <div className="rounded-[2rem] bg-white overflow-hidden p-4 space-y-4 text-xs">
                    {/* Phone App Header */}
                    <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                      <span className="font-bold text-black text-xs tracking-tight font-heading">ZERO WASTE</span>
                      <span className="text-[10px] text-neutral-400 font-mono">12:58</span>
                    </div>

                    {/* App Tabs */}
                    <div className="flex space-x-2 text-[10px] border-b border-neutral-100 pb-2 font-medium">
                      <span className="text-black border-b border-black pb-0.5">Courses</span>
                      <span className="text-neutral-400">Library</span>
                      <span className="text-neutral-400">Inventory</span>
                    </div>

                    {/* App Course Cards */}
                    <div className="space-y-2.5">
                      <div className="bg-neutral-900 text-white rounded-xl p-3.5 space-y-1">
                        <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-bold">COURSE 01</span>
                        <h4 className="font-bold text-xs leading-tight">HOW TO REDUCE 50% OF YOUR PREP WASTE</h4>
                        <p className="text-[10px] text-neutral-300">Root, stem and trim optimization for line cooks.</p>
                      </div>

                      <div className="bg-neutral-100 border border-neutral-200 rounded-xl p-3.5 space-y-1">
                        <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold">COURSE 02</span>
                        <h4 className="font-bold text-xs text-neutral-900 leading-tight">HOW TO REDUCE BUFFET WASTE</h4>
                        <p className="text-[10px] text-neutral-500">Display vessel sizing and rapid blast chilling SOPs.</p>
                      </div>

                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-bold text-emerald-900">Live Community Rescue</p>
                          <p className="text-[9px] text-emerald-700">18.5kg Bakery zero waste alert ready</p>
                        </div>
                        <button
                          onClick={() => onNavigate('dashboard')}
                          className="px-2 py-1 bg-emerald-600 text-white rounded text-[9px] font-bold"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 5-STAR TESTIMONIAL (Updated chef name) */}
      <section className="py-12 border-b border-neutral-100 bg-[#fbfcfc]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <div className="flex items-center justify-center space-x-1 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400" />
            ))}
          </div>
          <blockquote className="text-base sm:text-lg text-neutral-800 font-medium leading-relaxed italic max-w-2xl mx-auto">
            "An amazing platform for chefs. Loved going through all the content and finding new ideas. It's clear that the app is built for chefs, as it's very intuitive and a pleasure to use."
          </blockquote>
          <p className="text-xs text-neutral-500">
            — Executive Culinary Director, Luxury Hospitality Resort & Spa
          </p>
        </div>
      </section>

      {/* 3. 4 FEATURE CARDS (Exactly matching image_c70bdd72.png) */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-neutral-900 tracking-tight">
              Food waste prevention for chefs. All in one place.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#f7f8f9] border border-neutral-200/80 rounded-2xl p-6 space-y-2 hover:border-black transition-all">
              <h3 className="text-lg font-bold font-heading text-neutral-900">Courses</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Learn the skills behind food waste prevention in short videos, one topic at a time.
              </p>
            </div>

            <div className="bg-[#f7f8f9] border border-neutral-200/80 rounded-2xl p-6 space-y-2 hover:border-black transition-all">
              <h3 className="text-lg font-bold font-heading text-neutral-900">Recipes</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Learn the secret behind zero-waste cooking with easy-to-replicate recipes in any operation.
              </p>
            </div>

            <div className="bg-[#f7f8f9] border border-neutral-200/80 rounded-2xl p-6 space-y-2 hover:border-black transition-all">
              <h3 className="text-lg font-bold font-heading text-neutral-900">Resources</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Sample zero-waste menus, cost calculators and kitchen posters. Used in kitchens around the world.
              </p>
            </div>

            <div className="bg-[#f7f8f9] border border-neutral-200/80 rounded-2xl p-6 space-y-2 hover:border-black transition-all">
              <h3 className="text-lg font-bold font-heading text-neutral-900">Live sessions</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Live masterclass Q&A calls with culinary mentors. Bring your kitchen's specific challenges and get direct answers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE CORE NARRATIVE (WHAT IS THE PROBLEM, WHAT WE CAN DO, HOW TO FIX IT, SOLUTIONS, HOW APP SOLVES IT) */}
      <ProblemSolutionSection
        onGoToDashboard={() => onNavigate('dashboard')}
        onGoToRecipes={() => onNavigate('recipes')}
      />

      {/* 5. WHAT WILL YOU LEARN INSIDE ZERO WASTE? (Alternating Sections from image_017b79ed.png) */}
      <section className="py-16 sm:py-24 bg-[#fafbfc] border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          <div className="text-center space-y-2">
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-neutral-900 tracking-tight">
              What will you learn inside ZERO WASTE?
            </h2>
          </div>

          {/* Block 1: How to get started */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-3">
              <h3 className="text-2xl sm:text-3xl font-bold font-heading text-neutral-900">
                How to get started
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Learn the easiest ways to reduce food waste and understand the simplest systems for food waste prevention.
              </p>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Change the way you think about food waste and turn zero-waste into your standard approach.
              </p>
            </div>
            <div className="lg:col-span-6 bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-neutral-50 rounded-xl">
                  <span className="font-bold text-black block mb-1">48-Hour Bin Audit</span>
                  <span className="text-neutral-500">Weigh and categorize prep trimmings on your line.</span>
                </div>
                <div className="p-3 bg-neutral-50 rounded-xl">
                  <span className="font-bold text-black block mb-1">Brigade Muscle Memory</span>
                  <span className="text-neutral-500">Train junior cooks on root-to-leaf prep habits.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Block 2: How to create zero-waste recipes */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1 bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                  <span className="font-bold text-neutral-900">Broccoli Stalk Carpaccio</span>
                  <span className="text-emerald-700 font-bold">+100% yield</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                  <span className="font-bold text-neutral-900">Charred Onion Skin Dashi</span>
                  <span className="text-emerald-700 font-bold">Zero-cost umami broth</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-neutral-900">Stale Sourdough Miso</span>
                  <span className="text-emerald-700 font-bold">Fermented pastry caramel</span>
                </div>
              </div>
            </div>
            <div className="lg:col-span-6 order-1 lg:order-2 space-y-3">
              <h3 className="text-2xl sm:text-3xl font-bold font-heading text-neutral-900">
                How to create zero-waste recipes
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Running out of ideas? Find recipes and upcycling tips for every byproduct in the recipe library.
              </p>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Learn simple tricks to create zero-waste recipes and find out the secret behind effortless zero-waste cooking. Easy-to-replicate recipes for every operation.
              </p>
              <button
                onClick={() => onNavigate('recipes')}
                className="text-xs font-bold text-neutral-900 underline pt-2 block"
              >
                Browse all 60+ recipes →
              </button>
            </div>
          </div>

          {/* Block 3: How to engineer a circular menu */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-3">
              <h3 className="text-2xl sm:text-3xl font-bold font-heading text-neutral-900">
                How to engineer a circular menu
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Learn the systems behind creating a circular menu and understand how to prevent food waste during menu development.
              </p>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Get inspired by a sample zero-waste menu and dive-deep into circular menu engineering.
              </p>
            </div>
            <div className="lg:col-span-6 bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
              <div className="p-4 bg-neutral-900 text-white rounded-xl space-y-2">
                <span className="text-[10px] font-mono text-emerald-400 uppercase">Cross-Station Matrix</span>
                <p className="text-xs font-semibold">Prep Trimmings from Station A become finishing sauces for Station B.</p>
                <p className="text-[11px] text-neutral-400">Never design an entrée without designing a home for its byproduct.</p>
              </div>
            </div>
          </div>

          {/* Block 4: Make the most of every ingredient */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1 bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 border border-neutral-200 rounded-lg">
                  <span className="font-bold text-neutral-900 block">Pineapple</span>
                  <span className="text-[10px] text-neutral-500">Tepache & syrups</span>
                </div>
                <div className="p-2 border border-neutral-200 rounded-lg">
                  <span className="font-bold text-neutral-900 block">Cauliflower</span>
                  <span className="text-[10px] text-neutral-500">Pickled core crisps</span>
                </div>
                <div className="p-2 border border-neutral-200 rounded-lg">
                  <span className="font-bold text-neutral-900 block">Herb Stems</span>
                  <span className="text-[10px] text-neutral-500">Chlorophyll oil</span>
                </div>
              </div>
            </div>
            <div className="lg:col-span-6 order-1 lg:order-2 space-y-3">
              <h3 className="text-2xl sm:text-3xl font-bold font-heading text-neutral-900">
                Make the most of every ingredient
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Not sure how to use a certain byproduct?
              </p>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Find quick solutions in the searchable catalogue of byproducts and stop putting your money in the bin. Easy solutions applicable to every operation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. REVIEWS & PRICING (From image_4bf43c99.png) */}
      <section className="py-16 sm:py-24 bg-white" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* 3 Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-neutral-200 rounded-2xl p-6 space-y-3">
              <div className="flex space-x-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-neutral-700 leading-relaxed italic">
                "A practical and user-friendly resource that promotes best practices, creativity, cost efficiency, and better utilisation of trimmings and food waste."
              </p>
              <p className="text-[11px] font-semibold text-neutral-500 pt-2 border-t border-neutral-100">
                — Executive Chef, 5-star resort
              </p>
            </div>

            <div className="border border-neutral-200 rounded-2xl p-6 space-y-3">
              <div className="flex space-x-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-neutral-700 leading-relaxed italic">
                "A valuable tool that encourages creativity, cost efficiency, and better utilisation of food products while reducing waste."
              </p>
              <p className="text-[11px] font-semibold text-neutral-500 pt-2 border-t border-neutral-100">
                — Corporate Chef, hotel group
              </p>
            </div>

            <div className="border border-neutral-200 rounded-2xl p-6 space-y-3">
              <div className="flex space-x-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-neutral-700 leading-relaxed italic">
                "Very user-friendly, easy to use, and the videos are brief and informative. Recipes and posters are now being used in our kitchen"
              </p>
              <p className="text-[11px] font-semibold text-neutral-500 pt-2 border-t border-neutral-100">
                — Executive Chef, 5-star hotel
              </p>
            </div>
          </div>

          {/* Pricing Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
              <Sparkles className="w-3.5 h-3.5" />
              <span>3-DAY FREE TRIAL METHOD AVAILABLE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-neutral-900 tracking-tight">
              One membership. Flexible options.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-xl mx-auto">
              Transparent pricing in USD ($). Test with a 3-Day Free Trial or choose an annual kitchen brigade subscription.
            </p>
          </div>

          {/* 4 Pricing Cards (3-Day Trial + 3 Annual Tiers in USD) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {PRICING_PLANS.map((plan) => {
              const isTrial = plan.isTrial;
              const isPopular = plan.highlighted;

              return (
                <div
                  key={plan.id}
                  className={`border rounded-2xl p-6 flex flex-col justify-between space-y-6 transition-all relative ${
                    isTrial
                      ? 'border-emerald-500 bg-emerald-50/30 ring-1 ring-emerald-500 shadow-sm'
                      : isPopular
                      ? 'border-neutral-900 bg-neutral-50/50 ring-1 ring-neutral-900 shadow-sm'
                      : 'border-neutral-300 hover:border-black bg-white'
                  }`}
                >
                  {plan.badge && (
                    <span className={`absolute -top-3 right-4 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      isTrial
                        ? 'bg-emerald-600 text-white'
                        : isPopular
                        ? 'bg-black text-white'
                        : 'bg-neutral-800 text-neutral-200'
                    }`}>
                      {plan.badge}
                    </span>
                  )}

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold font-heading text-neutral-900">{plan.title}</h3>
                      <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">{plan.description}</p>
                    </div>

                    <div className="space-y-0.5 pt-1 border-t border-neutral-100">
                      <div className="flex items-baseline space-x-1">
                        <span className="text-3xl sm:text-4xl font-black font-heading text-black">{plan.price}</span>
                        <span className="text-xs font-bold text-neutral-500">USD</span>
                      </div>
                      <p className="text-[11px] text-neutral-500 font-medium">{plan.cadence}</p>
                    </div>

                    <div className="pt-2">
                      <p className="text-[11px] font-bold text-neutral-900 mb-2 uppercase tracking-wide">
                        What's included:
                      </p>
                      <ul className="space-y-2 text-xs text-neutral-600">
                        {plan.features.map((f, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                              isTrial ? 'bg-emerald-600' : 'bg-black'
                            }`} />
                            <span className="leading-snug">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-200/80">
                    <button
                      onClick={() => {
                        if (onOpenPaymentAuth) {
                          onOpenPaymentAuth(plan.id);
                        } else {
                          onOpenBooking();
                        }
                      }}
                      className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-sm ${
                        isTrial
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-black hover:bg-neutral-800 text-white'
                      }`}
                    >
                      {plan.buttonText}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. EXPERT CULINARY SYSTEM */}
      <section className="py-16 sm:py-20 bg-[#fafbfc] border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold font-heading text-neutral-900 tracking-tight">
                Built by Commercial Culinary Experts
              </h2>
              <div className="space-y-3 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                <p>
                  Engineered by zero-waste culinary directors, food waste prevention trainers, and operational consultants helping commercial kitchens eliminate waste. Based on the acclaimed methodology of <em>Zero Waste: The Food Waste Guide for Chefs</em> and tested in high-volume commercial kitchens worldwide.
                </p>
                <p>
                  Our methodologies have been implemented with major hospitality groups such as Accor, Hilton, Thomas Franks, and Marriott, supporting kitchen brigades with food waste prevention training worldwide.
                </p>
              </div>
            </div>

            <div className="lg:col-span-6 flex justify-center">
              <div className="relative rounded-2xl overflow-hidden border border-neutral-200 shadow-lg max-w-md">
                <img
                  src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80"
                  alt="Culinary Brigade in commercial kitchen"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-sm text-white px-3 py-1 rounded text-xs font-mono">
                  Zero Waste Culinary Academy
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FREQUENTLY ASKED QUESTIONS (From image_f68fcfab.png) */}
      <FAQSection onContactClick={onOpenBooking} />

      {/* 9. BOTTOM CALL TO ACTION */}
      <section className="py-16 bg-neutral-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-bold font-heading">
              Take the first step towards food waste prevention. Get in touch today.
            </h3>
            <p className="text-xs text-neutral-400">
              Zero waste by Supritamone • Custom brigade training and kitchen audits worldwide.
            </p>
          </div>
          <button
            onClick={onOpenBooking}
            className="px-8 py-3.5 rounded-lg bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-neutral-100 whitespace-nowrap active:scale-95"
          >
            Get in touch
          </button>
        </div>
      </section>
    </div>
  );
};
