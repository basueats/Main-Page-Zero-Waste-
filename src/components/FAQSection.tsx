import React, { useState } from 'react';
import { FAQ_ITEMS } from '../data/mockData';
import { Plus, Minus, ArrowRight, HelpCircle } from 'lucide-react';

interface FAQSectionProps {
  onContactClick: () => void;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ onContactClick }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 sm:py-24 bg-white" id="faq">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#f7f8f9] border border-neutral-200/80 rounded-3xl p-8 sm:p-12 lg:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Heading and Contact CTA */}
            <div className="lg:col-span-5 space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold font-heading text-neutral-900 tracking-tight leading-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-neutral-500 leading-relaxed max-w-sm">
                Still have questions? Take a look at the FAQ or reach out anytime.
              </p>
              <div className="pt-2">
                <button
                  onClick={onContactClick}
                  className="px-8 py-3.5 rounded-lg bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95"
                >
                  CONTACT ME
                </button>
              </div>
            </div>

            {/* Right Column: Clean Bordered Accordion */}
            <div className="lg:col-span-7 divide-y divide-neutral-200 border-t border-neutral-200">
              {FAQ_ITEMS.map((item, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div key={idx} className="py-4 transition-colors">
                    <button
                      onClick={() => toggleAccordion(idx)}
                      className="w-full flex items-center justify-between text-left py-1 group focus:outline-none"
                      aria-expanded={isOpen}
                    >
                      <span className={`text-sm sm:text-base font-semibold pr-4 transition-colors ${
                        isOpen ? 'text-black font-bold' : 'text-neutral-800 group-hover:text-black'
                      }`}>
                        {item.question}
                      </span>
                      <span className="flex-shrink-0 text-neutral-500 group-hover:text-black">
                        {isOpen ? (
                          <Minus className="w-5 h-5 stroke-[2.5]" />
                        ) : (
                          <Plus className="w-5 h-5 stroke-[2.5]" />
                        )}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="pt-3 pb-2 text-xs sm:text-sm text-neutral-600 leading-relaxed animate-fadeIn">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
