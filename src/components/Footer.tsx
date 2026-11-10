import React from 'react';
import { NavigationPage } from '../types';
import { Logo } from './Logo';

interface FooterProps {
  onNavigate: (page: NavigationPage) => void;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenBooking }) => {
  return (
    <footer className="bg-white border-t border-neutral-200 py-12 text-neutral-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pb-8 border-b border-neutral-100">
          {/* Logo & Company Name */}
          <div className="md:col-span-5 space-y-2">
            <Logo size="md" showCompanyName={true} />
            <p className="text-[11px] text-neutral-400 max-w-sm pt-1">
              Zero waste by Supritamone • The culinary learning platform, byproduct catalogue, and live inventory & community alert suite for chefs.
            </p>
          </div>

          {/* Quick Page Links */}
          <div className="md:col-span-4 flex flex-wrap gap-4 text-xs font-medium text-neutral-700">
            <button onClick={() => onNavigate('home')} className="hover:text-black">
              ZERO WASTE App
            </button>
            <button onClick={() => onNavigate('problem-solution')} className="hover:text-black">
              Problem & Solution
            </button>
            <button onClick={() => onNavigate('dashboard')} className="hover:text-black">
              Live Dashboard
            </button>
            <button onClick={() => onNavigate('recipes')} className="hover:text-black">
              Recipes
            </button>
            <button onClick={() => onNavigate('faq')} className="hover:text-black">
              FAQ
            </button>
            <button onClick={onOpenBooking} className="hover:text-black font-bold">
              Contact
            </button>
          </div>

          {/* Legal Links as shown in screenshot */}
          <div className="md:col-span-3 flex md:justify-end space-x-4 text-[11px] text-neutral-500">
            <span className="hover:underline cursor-pointer">Terms & Conditions</span>
            <span className="hover:underline cursor-pointer">Cookie Policy</span>
            <span className="hover:underline cursor-pointer">Privacy policy</span>
          </div>
        </div>

        {/* Certifications & Accreditation Trust Row */}
        <div className="py-6 border-b border-neutral-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-[11px] font-semibold text-neutral-800 uppercase tracking-wider">
              Accredited Quality & Professional Standards
            </p>
            <p className="text-[10px] text-neutral-400">
              ISO 9001:2015 Quality Management Certified • CPD Certified Commercial Culinary Training
            </p>
          </div>
          <div className="flex items-center flex-wrap justify-center gap-3 sm:gap-4">
            <div className="bg-white p-1.5 px-2.5 rounded-xl border border-neutral-200 shadow-2xs hover:shadow-xs hover:border-neutral-300 transition-all">
              <img
                src="/assets/aistudio/images_7ff73340.png"
                alt="ISO 9001:2015 Certified"
                className="h-10 sm:h-11 w-auto object-contain"
                loading="lazy"
              />
            </div>
            <a
              href="https://thecpdregister.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-1.5 px-2.5 rounded-xl border border-neutral-200 shadow-2xs hover:shadow-xs hover:border-amber-400 transition-all block"
              title="Verify CPD Approved Provider #791463 on thecpdregister.com"
            >
              <img
                src="/assets/aistudio/791463_9802fbb0.png"
                alt="The CPD Group Approved Provider #791463"
                className="h-10 sm:h-11 w-auto object-contain"
                loading="lazy"
              />
            </a>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-400">
          <span>© {new Date().getFullYear()} Zero waste by Supritamone. All rights reserved.</span>
          <span className="mt-2 sm:mt-0 font-mono">
            Platform built for commercial culinary teams & food rescue
          </span>
        </div>
      </div>
    </footer>
  );
};
