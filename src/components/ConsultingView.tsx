import React from 'react';
import { Briefcase, CheckCircle, ArrowRight, TrendingDown, Award, ShieldCheck, Building2, ChefHat } from 'lucide-react';

interface ConsultingViewProps {
  onOpenBooking: () => void;
}

export const ConsultingView: React.FC<ConsultingViewProps> = ({ onOpenBooking }) => {
  const steps = [
    {
      step: '01',
      title: 'Physical Kitchen Waste Characterization',
      description: 'Our senior culinary auditors spend 48 hours on the line with your brigade. Every bin, prep station, trimming bucket, and buffet return is weighed, logged, and monetized.'
    },
    {
      step: '02',
      title: 'Menu Cross-Circularity Re-Engineering',
      description: 'We audit your active menu specs to build circular loops. Trimmings from high-volume prep items are paired with companion recipes (stocks, ferments, salts, dusts, glazes) that directly replace purchased pantry goods.'
    },
    {
      step: '03',
      title: 'SOPs & Staff Behavioral Conditioning',
      description: 'We replace guilt with culinary pride. Hands-on drills with your sous chefs and cooks establish new muscle memory for vegetable peeling, fish and meat breakdown, and blast chilling protocols.'
    },
    {
      step: '04',
      title: 'Inventory Dashboard & Donation Integration',
      description: 'We implement the Zero Waste Kitchen station inventory dashboard and connect your loading bays with verified community food rescue shelters for tax-deductible zero waste food redistribution.'
    }
  ];

  const caseStudies = [
    {
      title: 'Luxury 5-Star Island Resort (420 Rooms, 6 Outlets)',
      metric: '41% Waste Reduction',
      annualSavings: '$118,000 USD / yr',
      challenge: 'High breakfast buffet overproduction and tropical fruit peel wastage.',
      solution: 'Scaled down display vessel sizes, introduced dynamic batch finishing, and turned pineapple/citrus rinds into bar cordials and pastry glazes.',
      timeframe: '90 Days to Full ROI'
    },
    {
      title: 'Urban Convention Center & Banquet Hotel',
      metric: '52% Banquet Food Saved',
      annualSavings: '$184,000 USD / yr',
      challenge: 'Unconsumed banquet spreads discarded due to cold-chain uncertainty.',
      solution: 'Implemented blast chill standard operating procedures and instant community donation alert dispatch to local family shelters.',
      timeframe: 'Immediate Compliance'
    },
    {
      title: 'Farm-to-Table Michelin-Recommended Bistro Group',
      metric: '+6.4% Gross Margin Lift',
      annualSavings: '$42,500 USD / yr',
      challenge: 'High-cost organic heirloom root trimmings going to general compost.',
      solution: 'Created signature allium skin dashi broths and vegetable stem carpaccios that became top-selling starters.',
      timeframe: '6 Weeks'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0d120f] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#18261e] border border-[#273d2f] text-xs font-semibold text-[#4ade80]">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Advisory & Strategic Audits</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white">
            Commercial Kitchen Advisory & Waste Audits
          </h1>
          <p className="text-sm text-[#8a9e91] leading-relaxed">
            Specialized food waste prevention and plant-forward consulting for global hotel brands, resort portfolios, and high-volume catering operations.
          </p>
        </div>

        {/* 4-Step Methodology */}
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl font-bold font-display text-white">
              The 4-Stage Operational Audit
            </h2>
            <p className="text-xs text-[#718579] mt-1">
              Tested across commercial kitchens worldwide to create permanent systemic change.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div key={s.step} className="bg-[#121914] border border-[#202e25] rounded-2xl p-6 space-y-3 relative overflow-hidden">
                <span className="text-3xl font-extrabold font-mono text-[#22c55e]/20 absolute top-4 right-4">
                  {s.step}
                </span>
                <span className="text-xs font-bold text-[#4ade80] font-mono">Stage {s.step}</span>
                <h3 className="text-base font-bold text-white leading-snug">{s.title}</h3>
                <p className="text-xs text-[#8a9e91] leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Case Studies */}
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4ade80]">
              Verified Outcomes
            </span>
            <h2 className="text-2xl font-bold font-display text-white mt-1">
              Client Case Studies
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {caseStudies.map((cs, idx) => (
              <div key={idx} className="bg-[#121914] border border-[#202e25] rounded-2xl p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#4ade80] px-2.5 py-1 rounded bg-[#17261d] border border-[#233b2b]">
                      {cs.metric}
                    </span>
                    <span className="text-xs font-bold font-mono text-white">
                      {cs.annualSavings}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">{cs.title}</h3>

                  <div className="space-y-2 text-xs text-[#8a9e91]">
                    <p><strong className="text-white">Challenge:</strong> {cs.challenge}</p>
                    <p><strong className="text-[#86efac]">Solution:</strong> {cs.solution}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#1c2720] flex items-center justify-between text-[11px] text-[#718579]">
                  <span>Timeline: {cs.timeframe}</span>
                  <span className="text-[#4ade80] font-medium">Verified Audit</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA banner */}
        <div className="bg-gradient-to-r from-[#14231b] to-[#111714] border border-[#243d2c] rounded-3xl p-8 sm:p-12 text-center space-y-4 max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Schedule an Executive Consultation
          </h2>
          <p className="text-xs sm:text-sm text-[#8a9e91] max-w-xl mx-auto">
            Discuss your property’s food cost targets, brigade structure, and sustainability roadmap with our senior culinary specialists.
          </p>
          <div className="pt-2">
            <button
              onClick={onOpenBooking}
              className="px-8 py-3.5 rounded-xl text-xs font-bold bg-[#22c55e] text-black hover:bg-[#16a34a] shadow-lg transition-all"
            >
              Request Kitchen Consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
