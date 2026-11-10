import React from 'react';
import { ChefHat, Leaf, Award, Globe, Quote, ArrowRight } from 'lucide-react';

interface AboutViewProps {
  onOpenBooking: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onOpenBooking }) => {
  return (
    <div className="min-h-screen bg-[#fafbfc] py-12 px-4 sm:px-6 lg:px-8 text-neutral-900">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            THE ACADEMY & ETHOS
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-neutral-900 tracking-tight">
            Zero waste by Supritamone
          </h1>
          <p className="text-sm text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Redefining professional kitchen economics through circular culinary systems and plant-forward gastronomy.
          </p>
        </div>

        {/* System & Ethos Card */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-8 sm:p-12 space-y-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-5 flex justify-center">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=600&q=80"
                  alt="Zero Waste Culinary Academy"
                  className="w-64 h-80 object-cover rounded-2xl border border-neutral-300 shadow-md"
                />
                <div className="absolute -bottom-3 -right-3 px-3 py-1.5 rounded-xl bg-black text-white font-bold text-xs shadow-lg">
                  Culinary Academy
                </div>
              </div>
            </div>

            <div className="md:col-span-7 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-neutral-900">
                "A bin is not a waste disposal unit; it is an expense account with no return."
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Zero waste by Supritamone was established to tackle commercial food waste through practical brigade systems. After years of operating in high-pressure commercial kitchens across the globe, our team developed actionable solutions for the industry's staggering disregard for edible trimmings and discarded food.
              </p>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                We pioneered commercial operating systems that transform root-to-leaf scraps into high-margin stocks, fermentations, crisps, and powders—turning avoidable waste into measurable culinary profit.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-neutral-100 text-neutral-800 border border-neutral-200">
                  Zero Waste Methodology
                </span>
                <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-neutral-100 text-neutral-800 border border-neutral-200">
                  ISO 9001:2015 & CPD Certified
                </span>
                <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-neutral-100 text-neutral-800 border border-neutral-200">
                  120+ Kitchen Brigades
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* The Manifesto */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold font-heading text-neutral-900 text-center">
            The Zero Waste Manifesto
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-neutral-600">
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-2 shadow-sm">
              <span className="text-lg font-bold font-mono text-black">01</span>
              <h4 className="text-sm font-bold text-neutral-900">Culinary Pride Over Guilt</h4>
              <p className="leading-relaxed">
                Telling chefs "wasting food is bad for the planet" achieves little during a 200-cover Saturday service. But showing them that toasted bread heels create a richer miso than soybeans unlocks culinary mastery.
              </p>
            </div>

            <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-2 shadow-sm">
              <span className="text-lg font-bold font-mono text-black">02</span>
              <h4 className="text-sm font-bold text-neutral-900">Direct Profit Margin Lift</h4>
              <p className="leading-relaxed">
                Food waste is not a CSR side project; it is the single largest controllable variable cost on an F&B P&L statement. Recovering 7% of food spend transforms restaurant margins into resilient balance sheets.
              </p>
            </div>

            <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-2 shadow-sm">
              <span className="text-lg font-bold font-mono text-black">03</span>
              <h4 className="text-sm font-bold text-neutral-900">Zero To Landfill</h4>
              <p className="leading-relaxed">
                Every remaining gram of edible wholesome food that cannot be upcycled must feed human beings. We build automated bridges between hotel loading docks and frontline community soup kitchens.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-neutral-900 text-white rounded-3xl p-8 text-center space-y-4">
          <h3 className="text-xl font-bold font-heading">
            Bring Zero waste by Supritamone to Your Brigade
          </h3>
          <p className="text-xs text-neutral-400 max-w-md mx-auto">
            Schedule a keynote, masterclass, or complete commercial kitchen audit with our culinary team.
          </p>
          <button
            onClick={onOpenBooking}
            className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-white text-black hover:bg-neutral-100"
          >
            Schedule Consultation
          </button>
        </div>
      </div>
    </div>
  );
};
