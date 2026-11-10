import React, { useState } from 'react';
import { NavigationPage, ChefUserProfile } from '../types';
import { Logo } from './Logo';
import { 
  Menu, 
  X, 
  Bell, 
  ArrowRight,
  Sparkles,
  User,
  LogOut,
  ShieldCheck,
  Clock
} from 'lucide-react';

interface NavbarProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  activeDonationAlertsCount: number;
  onOpenBooking: () => void;
  currentUser: ChefUserProfile | null;
  onOpenPaymentAuth: (planId?: string) => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  activeDonationAlertsCount,
  onOpenBooking,
  currentUser,
  onOpenPaymentAuth,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: NavigationPage; label: string }[] = [
    { id: 'home', label: 'ZERO WASTE App' },
    { id: 'problem-solution', label: 'Problem & Solutions' },
    { id: 'recipes', label: 'Recipes & Byproducts' },
    { id: 'training', label: 'Training & Pricing' },
    { id: 'faq', label: 'FAQ' },
    { id: 'about', label: 'About' },
  ];

  const handleNavClick = (page: NavigationPage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200 transition-all">
      {/* Top micro announcement */}
      <div className="bg-neutral-900 text-neutral-300 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-black">
              ZERO WASTE ACADEMY
            </span>
            <span className="hidden sm:inline text-neutral-200 text-xs">
              Zero waste by Supritamone • Turning commercial kitchen waste into high-margin profit
            </span>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <button
              onClick={() => handleNavClick('dashboard')}
              className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center space-x-1"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{activeDonationAlertsCount} Live Food Rescue Alerts</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div 
            onClick={() => handleNavClick('home')}
            className="cursor-pointer group flex items-center"
          >
            <Logo size="md" showCompanyName={true} />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative py-2 text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                    isActive
                      ? 'text-black font-semibold'
                      : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center space-x-2.5">
            <button
              onClick={() => handleNavClick('dashboard')}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-all flex items-center space-x-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Dashboard</span>
            </button>

            {currentUser?.isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onOpenPaymentAuth(currentUser.selectedPlanId || 'trial')}
                  className="flex items-center space-x-2.5 px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 transition-all group"
                  title="Click to view chef profile & membership"
                >
                  <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center text-[11px] font-bold font-mono">
                    {currentUser.firstName.charAt(0)}{currentUser.lastName.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-neutral-900 leading-tight">
                      {currentUser.firstName} {currentUser.lastName}
                    </p>
                    <p className="text-[10px] text-neutral-500 leading-tight truncate max-w-[110px]">
                      {currentUser.designation}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    currentUser.planStatus === 'trial_active'
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : currentUser.planStatus === 'trial_expired'
                      ? 'bg-red-100 text-red-900 border-red-300'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  }`}>
                    {currentUser.planStatus === 'trial_active'
                      ? `${currentUser.trialHoursLeft ?? 72}h Trial`
                      : currentUser.planStatus === 'trial_expired'
                      ? 'Trial Ended'
                      : '1-Year License'}
                  </span>
                </button>

                <button
                  onClick={onLogout}
                  className="p-2 rounded-xl text-neutral-400 hover:text-black hover:bg-neutral-100 transition-all"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => onOpenPaymentAuth('trial')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 transition-all flex items-center space-x-1"
                >
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>3-Day Trial ($0)</span>
                </button>

                <button
                  onClick={() => onOpenPaymentAuth('team')}
                  className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-black hover:bg-neutral-800 text-white transition-all shadow-sm active:scale-95"
                >
                  JOIN NOW
                </button>
              </>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => handleNavClick('dashboard')}
              className="p-2 rounded-lg bg-neutral-100 text-neutral-800 relative"
              aria-label="Dashboard Alerts"
            >
              <Bell className="w-5 h-5" />
              {activeDonationAlertsCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-600" />
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-neutral-700 hover:text-black"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-neutral-200 px-4 pt-3 pb-6 space-y-3">
          {currentUser?.isAuthenticated && (
            <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-neutral-900">
                  {currentUser.firstName} {currentUser.lastName}
                </p>
                <p className="text-[11px] text-neutral-500">
                  {currentUser.designation} • {currentUser.workPlace}
                </p>
              </div>
              <button
                onClick={onLogout}
                className="text-xs text-red-600 font-bold"
              >
                Sign Out
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-neutral-100 text-black font-bold'
                      : 'text-neutral-600 hover:text-black hover:bg-neutral-50'
                  }`}
                >
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-neutral-200 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPaymentAuth('trial');
              }}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-300 text-center"
            >
              3-Day Trial ($0)
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPaymentAuth('team');
              }}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-black text-white text-center"
            >
              JOIN NOW
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
