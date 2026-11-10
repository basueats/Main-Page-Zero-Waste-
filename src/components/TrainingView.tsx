import React, { useState } from 'react';
import { TrainingCourse } from '../types';
import { TRAINING_COURSES, PRICING_PLANS } from '../data/mockData';
import {
  GraduationCap,
  Clock,
  CheckCircle2,
  Users,
  Calculator,
  ArrowRight,
  ShieldCheck,
  Star
} from 'lucide-react';

interface TrainingViewProps {
  onOpenBooking: () => void;
  onOpenPaymentAuth?: (planId?: string) => void;
}

export const TrainingView: React.FC<TrainingViewProps> = ({ onOpenBooking, onOpenPaymentAuth }) => {
  const [selectedCourse, setSelectedCourse] = useState<TrainingCourse>(TRAINING_COURSES[0]);

  // Interactive ROI Calculator States
  const [coversPerDay, setCoversPerDay] = useState(300);
  const [monthlyFoodSpend, setMonthlyFoodSpend] = useState(48000);

  const estimatedMonthlySavings = Math.round(monthlyFoodSpend * 0.075);
  const estimatedAnnualSavings = estimatedMonthlySavings * 12;
  const estimatedKgWasteDiverted = Math.round(coversPerDay * 0.22 * 30);

  return (
    <div className="min-h-screen bg-[#fafbfc] py-12 px-4 sm:px-6 lg:px-8 text-neutral-900">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            HOSPITALITY TRAINING & PRICING
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-neutral-900 tracking-tight">
            Transform Kitchen Habits. Protect Profit Margins.
          </h1>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Practical culinary training engineered for Zero waste by Supritamone. Built for busy kitchen brigades, executive chefs, and hotel teams to cut waste by up to 50%.
          </p>
        </div>

        {/* 3 PRICING CARDS (From Screenshot 4) */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-neutral-900">
              One membership. Three options.
            </h2>
            <p className="text-xs text-neutral-500">
              Annual subscription. No per-module fees. Full access on every plan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING_PLANS.filter(p => !p.isTrial).map((plan) => (
              <div
                key={plan.id}
                className="bg-white border border-neutral-300 rounded-2xl p-8 flex flex-col justify-between space-y-6 hover:border-black transition-all shadow-sm"
              >
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold font-heading text-neutral-900">{plan.title}</h3>
                  <div className="space-y-0.5">
                    <span className="text-4xl font-black font-heading text-black">{plan.price}</span>
                    <p className="text-xs text-neutral-500">{plan.cadence}</p>
                  </div>

                  <div className="pt-2">
                    <p className="text-xs font-bold text-neutral-900 mb-2">What's included:</p>
                    <ul className="space-y-2 text-xs text-neutral-600">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <span className="w-1 h-1 rounded-full bg-black mt-2 flex-shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100">
                  <button
                    onClick={() => {
                      if (onOpenPaymentAuth) onOpenPaymentAuth(plan.id);
                      else onOpenBooking();
                    }}
                    className="w-full py-3.5 rounded-lg bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition-all"
                  >
                    {plan.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* INTERACTIVE ROI SAVINGS CALCULATOR */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 pb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center text-black">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-heading text-neutral-900">
                  Commercial Kitchen Waste ROI Calculator
                </h2>
                <p className="text-xs text-neutral-500">
                  Estimate your restaurant or hotel’s annual savings using our circular brigade systems
                </p>
              </div>
            </div>
            <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
              Benchmark: 7.5% Food Cost Recovery
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Sliders */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                    Average Daily Covers Served
                  </label>
                  <span className="text-sm font-mono font-bold text-black">
                    {coversPerDay} covers / day
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1500"
                  step="25"
                  value={coversPerDay}
                  onChange={(e) => setCoversPerDay(parseInt(e.target.value))}
                  className="w-full accent-black cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                    Monthly Kitchen Food Spend ($ USD)
                  </label>
                  <span className="text-sm font-mono font-bold text-black">
                    ${monthlyFoodSpend.toLocaleString()} USD
                  </span>
                </div>
                <input
                  type="range"
                  min="8000"
                  max="200000"
                  step="2000"
                  value={monthlyFoodSpend}
                  onChange={(e) => setMonthlyFoodSpend(parseInt(e.target.value))}
                  className="w-full accent-black cursor-pointer"
                />
              </div>
            </div>

            {/* Output Card */}
            <div className="lg:col-span-5 bg-neutral-900 text-white rounded-2xl p-6 space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                Projected Annual Impact
              </span>
              <div className="space-y-3">
                <div className="pb-3 border-b border-neutral-800">
                  <p className="text-xs text-neutral-400">Estimated Annual Cost Savings</p>
                  <p className="text-3xl font-extrabold font-mono text-emerald-400">
                    ${estimatedAnnualSavings.toLocaleString()} USD
                  </p>
                  <p className="text-[11px] text-neutral-400">${estimatedMonthlySavings.toLocaleString()} / month directly back into profit</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400">Avoidable Food Waste Diverted</p>
                  <p className="text-2xl font-bold font-mono text-white">
                    {estimatedKgWasteDiverted.toLocaleString()} kg / month
                  </p>
                </div>
              </div>
              <button
                onClick={onOpenBooking}
                className="w-full py-3 rounded-xl text-xs font-bold bg-white text-black hover:bg-neutral-100 flex items-center justify-center space-x-1.5"
              >
                <span>Request Custom Kitchen Audit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 3 Training Programs */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-neutral-900">
              Structured Culinary Programs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TRAINING_COURSES.map((course) => {
              const isSelected = selectedCourse.id === course.id;
              return (
                <div
                  key={course.id}
                  onClick={() => setSelectedCourse(course)}
                  className={`bg-white rounded-2xl border p-6 cursor-pointer transition-all flex flex-col justify-between space-y-4 shadow-sm ${
                    isSelected
                      ? 'border-black ring-1 ring-black'
                      : 'border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  <div className="space-y-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-neutral-100 text-neutral-800">
                      {course.format}
                    </span>
                    <h3 className="text-lg font-bold font-heading text-neutral-900">{course.title}</h3>
                    <p className="text-xs text-neutral-600 leading-relaxed line-clamp-3">{course.description}</p>
                  </div>
                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-xs text-neutral-500 font-mono">{course.duration}</span>
                    <span className="text-xs font-bold text-black">
                      {isSelected ? 'Viewing Syllabus' : 'View Syllabus →'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4 Membership Plans in USD with 3-Day Free Trial */}
        <div className="space-y-6 pt-10 border-t border-neutral-200">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              PRICING & MEMBERSHIP (USD)
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-neutral-900">
              Start with a 3-Day Free Trial or Enroll Your Brigade
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-xl mx-auto">
              All plans include complete recipe upcycle cards, byproduct directory, and real-time station alerts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {PRICING_PLANS.map((plan) => {
              const isTrial = plan.isTrial;
              const isPopular = plan.highlighted;

              return (
                <div
                  key={plan.id}
                  className={`border rounded-2xl p-6 flex flex-col justify-between space-y-6 bg-white transition-all relative ${
                    isTrial
                      ? 'border-emerald-500 bg-emerald-50/20 ring-1 ring-emerald-500'
                      : isPopular
                      ? 'border-neutral-900 ring-1 ring-neutral-900 shadow-sm'
                      : 'border-neutral-200 hover:border-black'
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
                      <p className="text-[11px] text-neutral-500 mt-0.5">{plan.description}</p>
                    </div>

                    <div className="space-y-0.5 pt-1 border-t border-neutral-100">
                      <div className="flex items-baseline space-x-1">
                        <span className="text-3xl font-black font-heading text-black">{plan.price}</span>
                        <span className="text-xs font-bold text-neutral-500">USD</span>
                      </div>
                      <p className="text-[11px] text-neutral-500">{plan.cadence}</p>
                    </div>

                    <ul className="space-y-2 text-xs text-neutral-600 pt-2">
                      {plan.features.slice(0, 5).map((f, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${
                            isTrial ? 'text-emerald-600' : 'text-neutral-900'
                          }`} />
                          <span className="leading-snug">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-neutral-100">
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
      </div>
    </div>
  );
};
