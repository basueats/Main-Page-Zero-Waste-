import React, { useState } from 'react';
import { BOOK_DETAILS } from '../data/mockData';
import { BookOpen, Check, Star, Download, ShoppingBag, Eye, X, Sparkles, ChefHat } from 'lucide-react';

export const BookView: React.FC = () => {
  const [readingExcerpt, setReadingExcerpt] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);

  const handlePurchase = (tier: string) => {
    setPurchaseSuccess(tier);
    setTimeout(() => setPurchaseSuccess(null), 4000);
  };

  return (
    <div className="min-h-screen bg-[#0d120f] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header & Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Book Render */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group">
              <div className="w-72 sm:w-80 h-[440px] rounded-2xl bg-gradient-to-br from-[#19261f] via-[#121c15] to-[#0c120e] border-2 border-[#2b4032] p-8 shadow-2xl shadow-emerald-950/60 flex flex-col justify-between transform transition-transform duration-300">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#4ade80] mb-4">
                    <span>ZERO WASTE GASTRONOMY</span>
                    <span>1ST EDITION</span>
                  </div>
                  <h1 className="text-3xl font-bold font-display text-white leading-tight">
                    Zero Waste: The Food Waste Guide for Chefs
                  </h1>
                  <p className="text-xs text-[#8a9e91] mt-3">
                    By Zero Waste Culinary Academy
                  </p>
                </div>

                <div className="space-y-3 border-t border-[#233529] pt-4">
                  <p className="text-xs text-[#a1b5a8] italic">
                    "The practical manual for commercial kitchens to eliminate waste, cut costs, and revolutionize menu development."
                  </p>
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#627769]">
                    <span>248 Pages</span>
                    <span>ISBN 978-0-6489354-0-7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Book Info & Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#18261e] border border-[#273d2f] text-xs font-semibold text-[#4ade80]">
              <BookOpen className="w-3.5 h-3.5" />
              <span>International Best Seller for Hospitality</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white">
              Zero Waste: The Food Waste Guide for Chefs
            </h2>

            <p className="text-sm text-[#9ab0a1] leading-relaxed">
              Written from firsthand experience after launching the world's first zero-waste vegan restaurant in Cambodia, this book dismantles the myth that food waste is an unavoidable cost of doing business.
            </p>

            <p className="text-xs text-[#82998a] leading-relaxed">
              The guide provides a complete tactical framework: from shifting brigade psychology and conducting physical 48-hour bin audits, to over 60 commercial-yield upcycled recipes and an extensive scrap-ingredient encyclopedia.
            </p>

            {/* Preview and Buy buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => setReadingExcerpt(true)}
                className="px-5 py-3 rounded-xl text-xs font-semibold bg-[#1a251e] text-white border border-[#2c4032] hover:bg-[#223127] transition-all flex items-center space-x-2"
              >
                <Eye className="w-4 h-4 text-[#4ade80]" />
                <span>Read Free Sample Excerpt</span>
              </button>

              <button
                onClick={() => handlePurchase('Hardcover Signed Edition ($38 USD)')}
                className="px-6 py-3 rounded-xl text-xs font-bold bg-[#22c55e] text-black hover:bg-[#16a34a] shadow-lg transition-all flex items-center space-x-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Order Hardcover ($38 USD)</span>
              </button>

              <button
                onClick={() => handlePurchase('Digital Edition ($19 USD)')}
                className="px-5 py-3 rounded-xl text-xs font-semibold bg-[#141d18] text-[#cbd5e1] border border-[#223126] hover:text-white"
              >
                Digital Bundle ($19 USD)
              </button>
            </div>

            {purchaseSuccess && (
              <div className="bg-[#172b1e] border border-[#22c55e]/50 p-3.5 rounded-xl text-xs text-[#4ade80] flex items-center space-x-2 animate-fadeIn">
                <Check className="w-4 h-4 flex-shrink-0" />
                <span>Added {purchaseSuccess} to order checkout! Instant digital access link generated.</span>
              </div>
            )}
          </div>
        </div>

        {/* CHAPTER BREAKDOWN */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4ade80]">
              Table of Contents
            </span>
            <h3 className="text-2xl font-bold font-display text-white mt-1">
              What You’ll Master Inside
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BOOK_DETAILS.chapters.map((ch) => (
              <div key={ch.number} className="bg-[#121914] border border-[#202e25] rounded-2xl p-6 space-y-3">
                <span className="text-xs font-mono font-bold text-[#4ade80] px-2 py-0.5 rounded bg-[#17261d]">
                  Chapter {ch.number}
                </span>
                <h4 className="text-base font-bold text-white">{ch.title}</h4>
                <p className="text-xs text-[#8a9e91] leading-relaxed">{ch.summary}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SAMPLE EXCERPT MODAL */}
        {readingExcerpt && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#111714] border border-[#2d4233] rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl text-[#cbd5e1] max-h-[90vh] flex flex-col">
              <div className="p-6 bg-[#16221a] border-b border-[#243629] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-[#4ade80]">BOOK EXCERPT: CHAPTER 01</span>
                  <h3 className="text-lg font-bold font-display text-white">The Psychology of the Rubbish Bin</h3>
                </div>
                <button
                  onClick={() => setReadingExcerpt(false)}
                  className="p-2 rounded-lg bg-[#0f1412] text-[#94a3b8] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4 text-xs text-[#a4b8ab] leading-relaxed">
                <p className="text-white text-sm font-serif italic">
                  "Stand in any commercial kitchen at 11:30 PM. The final service tickets are spiked, the range tops are scrubbed with degreaser, and the trash cans are hauled to the back dock. Inside those plastic bags lie thousands of dollars of ingredients that were meticulously ordered, paid for, and prepped by your brigade."
                </p>
                <p>
                  We have trained culinary brigades to treat the garbage bin as an invisible entity. When a cook trims a leek, stripping away 60% of the dark green leaves, they do not see money falling into the bin—they see an obstacle removed from their cutting board so they can plate the white barrel faster.
                </p>
                <p>
                  Zero-waste cooking is not about eating wilted lettuce or forcing subpar ingredients onto guests. It is about culinary technique. The French culinary tradition was founded on using every scrap: bouillons from bones, croutons from stale bread, confit from tough cuts. Somehow, commercial convenience broke this cycle.
                </p>
                <div className="bg-[#17241c] border-l-2 border-[#22c55e] p-3 text-white italic">
                  "When you teach a chef how to turn charred onion skins into a broth that rivals a 12-hour veal stock, you don’t just save food waste—you unlock their creativity."
                </div>
                <p>
                  In Chapter 2, we will strap a hanging digital scale to the prep line and execute the 48-Hour Station Audit...
                </p>
              </div>

              <div className="p-4 bg-[#141b17] border-t border-[#222e26] flex items-center justify-between">
                <span className="text-xs text-[#718579]">End of sample excerpt</span>
                <button
                  onClick={() => {
                    setReadingExcerpt(false);
                    handlePurchase('Hardcover Signed Edition ($38 USD)');
                  }}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-[#22c55e] text-black hover:bg-[#16a34a]"
                >
                  Order Full Book ($38)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
