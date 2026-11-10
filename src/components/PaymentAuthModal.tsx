/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  CreditCard, 
  Building2, 
  User, 
  Mail, 
  Briefcase, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Wifi,
  Laptop,
  AlertTriangle
} from 'lucide-react';
import { ChefUserProfile, PricingPlan } from '../types';
import { PRICING_PLANS } from '../data/mockData';
import { deviceHoldService } from '../services/deviceHoldService';

interface PaymentAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlanId?: string;
  currentUser: ChefUserProfile | null;
  onLoginSuccess: (user: ChefUserProfile) => void;
  onOpenDashboard?: () => void;
}

export const PaymentAuthModal: React.FC<PaymentAuthModalProps> = ({
  isOpen,
  onClose,
  initialPlanId = 'trial',
  currentUser,
  onLoginSuccess,
  onOpenDashboard
}) => {
  // Steps: 'login' | 'google_select' | 'profile' | 'checkout' | 'confirmation'
  const [step, setStep] = useState<'login' | 'google_select' | 'profile' | 'checkout' | 'confirmation'>('login');
  
  // Selected Plan state
  const [selectedPlanId, setSelectedPlanId] = useState<string>(initialPlanId || 'trial');

  // Auth Provider
  const [authProvider, setAuthProvider] = useState<'google' | 'linkedin' | 'email'>('google');
  const [googleAccountChosen, setGoogleAccountChosen] = useState<{
    name: string;
    email: string;
    avatar: string;
    role: string;
  } | null>(null);

  // Form fields
  const [loginEmail, setLoginEmail] = useState(currentUser?.workEmail || '');
  const [loginPassword, setLoginPassword] = useState('••••••••••');
  const [loginError, setLoginError] = useState('');

  // Profile form fields
  const [firstName, setFirstName] = useState(currentUser?.firstName || '');
  const [lastName, setLastName] = useState(currentUser?.lastName || '');
  const [workPlace, setWorkPlace] = useState(currentUser?.workPlace || '');
  const [designation, setDesignation] = useState(currentUser?.designation || '');
  const [workEmail, setWorkEmail] = useState(currentUser?.workEmail || '');
  const [profileError, setProfileError] = useState('');

  // Device & IP hold info
  const [deviceInfo, setDeviceInfo] = useState(deviceHoldService.getDeviceInfo());
  const [canClaimTrial, setCanClaimTrial] = useState(deviceHoldService.canClaimTrial());
  const [isIpHeld, setIsIpHeld] = useState(deviceHoldService.isDeviceOrIpHeld());

  // Ziina external payment tracking
  const [ziinaOpened, setZiinaOpened] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [trialActivatedDate, setTrialActivatedDate] = useState<string>('');

  useEffect(() => {
    if (initialPlanId) {
      setSelectedPlanId(initialPlanId);
    }
  }, [initialPlanId]);

  useEffect(() => {
    const info = deviceHoldService.getDeviceInfo();
    setDeviceInfo(info);
    setCanClaimTrial(deviceHoldService.canClaimTrial());
    setIsIpHeld(deviceHoldService.isDeviceOrIpHeld());
  }, [isOpen, selectedPlanId]);

  useEffect(() => {
    if (currentUser?.isAuthenticated) {
      setFirstName(currentUser.firstName);
      setLastName(currentUser.lastName);
      setWorkPlace(currentUser.workPlace);
      setDesignation(currentUser.designation);
      setWorkEmail(currentUser.workEmail);
      setLoginEmail(currentUser.workEmail);
      // Already authenticated -> jump straight to checkout
      setStep('checkout');
    } else {
      setStep('login');
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const currentPlan = PRICING_PLANS.find(p => p.id === selectedPlanId) || PRICING_PLANS[0];
  const isTrialSelected = selectedPlanId === 'trial';

  // Available Google Accounts in account picker
  const googleAccounts = [
    {
      name: 'Executive Culinary Account',
      email: 'culinary.director@kitchen.org',
      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=120&q=80',
      role: 'Executive Culinary Director',
      workPlace: 'Commercial Hospitality Group'
    },
    {
      name: 'Brigade Operations Account',
      email: 'brigade.operations@kitchen.org',
      avatar: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?auto=format&fit=crop&w=120&q=80',
      role: 'Kitchen Operations & Station Lead',
      workPlace: 'Hotel Culinary Brigade'
    }
  ];

  // 1. Google Single Sign-On Handler
  const handleSelectGoogleAccount = (acc: typeof googleAccounts[0]) => {
    setAuthProvider('google');
    setGoogleAccountChosen(acc);
    const [fName, ...lNames] = acc.name.split(' ');
    setFirstName(fName);
    setLastName(lNames.join(' '));
    setWorkEmail(acc.email);
    setLoginEmail(acc.email);
    setWorkPlace(acc.workPlace);
    setDesignation(acc.role);

    // Direct transition to profile check or checkout
    setStep('checkout');
  };

  // 2. LinkedIn Sign-In Handler
  const handleLinkedInSignIn = () => {
    setAuthProvider('linkedin');
    setFirstName('Culinary');
    setLastName('Member');
    setWorkEmail('member@hospitality.com');
    setLoginEmail('member@hospitality.com');
    setWorkPlace('Luxury Hotel & Resort Brigade');
    setDesignation('Executive Sous Chef');
    setStep('checkout');
  };

  // 3. Email Form Submit Handler
  const handleEmailLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      setLoginError('Please enter your work email to proceed.');
      return;
    }
    setLoginError('');
    setAuthProvider('email');
    setWorkEmail(loginEmail);

    if (!firstName) {
      const parts = loginEmail.split('@')[0].split('.');
      if (parts.length >= 2) {
        setFirstName(parts[0].charAt(0).toUpperCase() + parts[0].slice(1));
        setLastName(parts[1].charAt(0).toUpperCase() + parts[1].slice(1));
      } else {
        setFirstName('Chef');
        setLastName('Member');
      }
      setWorkPlace('Commercial Kitchen Brigade');
      setDesignation('Culinary Professional');
    }

    setStep('checkout');
  };

  // 4. Open Ziina Payment Link in New Tab
  const handleOpenZiinaLink = (url: string) => {
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
      setZiinaOpened(true);
    }
  };

  // 5. Activate 3-Day Free Trial ($0 USD)
  const handleActivateTrial = () => {
    if (!canClaimTrial && isIpHeld) {
      alert('Your device and network IP are currently in hold because the 3-day trial has already concluded. Please choose an annual membership option.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const record = deviceHoldService.activateTrial(workEmail || loginEmail, `${firstName} ${lastName}`);
      
      const updatedUser: ChefUserProfile = {
        firstName: firstName || 'Executive',
        lastName: lastName || 'Chef',
        workPlace: workPlace || 'Zero Waste Commercial Kitchen',
        designation: designation || 'Executive Chef',
        workEmail: workEmail || loginEmail,
        isAuthenticated: true,
        authProvider,
        selectedPlanId: 'trial',
        trialDaysLeft: 3,
        trialHoursLeft: 72,
        trialExpiresAt: record.trialExpiresAt,
        planStatus: 'trial_active',
        clientIp: deviceInfo.ipAddress,
        deviceId: deviceInfo.deviceId,
        isIpHeld: false
      };

      setTrialActivatedDate(new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
      setIsProcessing(false);
      onLoginSuccess(updatedUser);
      setStep('confirmation');
    }, 700);
  };

  // 6. Confirm Paid Ziina Membership ($79, $99, $1499) -> 1-Year Access
  const handleConfirmPaidMembership = (plan: PricingPlan) => {
    setIsProcessing(true);
    setTimeout(() => {
      const record = deviceHoldService.activatePaidMembership(
        plan.id,
        workEmail || loginEmail,
        `${firstName} ${lastName}`
      );

      const statusMap: Record<string, ChefUserProfile['planStatus']> = {
        individual: 'pro_active',
        team: 'team_active',
        training: 'training_active'
      };

      const updatedUser: ChefUserProfile = {
        firstName: firstName || 'Executive',
        lastName: lastName || 'Chef',
        workPlace: workPlace || 'Zero Waste Commercial Kitchen',
        designation: designation || 'Head Chef',
        workEmail: workEmail || loginEmail,
        isAuthenticated: true,
        authProvider,
        selectedPlanId: plan.id,
        planStatus: statusMap[plan.id] || 'pro_active',
        membershipExpiresAt: record.membershipExpiresAt,
        isIpHeld: false,
        clientIp: deviceInfo.ipAddress,
        deviceId: deviceInfo.deviceId
      };

      setTrialActivatedDate(new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
      setIsProcessing(false);
      onLoginSuccess(updatedUser);
      setStep('confirmation');
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div 
        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-neutral-900 text-white p-6 sm:p-7 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-[11px] font-bold bg-neutral-800 text-emerald-400 border border-neutral-700">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ZERO WASTE BY SUPRITAMONE • CHEF ONBOARDING</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-heading text-white tracking-tight">
              {step === 'login' && 'Single Sign-On to Access'}
              {step === 'google_select' && 'Choose Your Google Account'}
              {step === 'profile' && 'Chef Professional Profile'}
              {step === 'checkout' && 'Checkout & Membership Activation'}
              {step === 'confirmation' && 'Kitchen Access Activated!'}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              {step === 'login' && 'Sign in with Google, LinkedIn, or Work Email to proceed to checkout.'}
              {step === 'google_select' && 'Select an account to authorize commercial kitchen access.'}
              {step === 'profile' && 'Confirm your official kitchen brigade credentials.'}
              {step === 'checkout' && 'Activate your 3-day free trial ($0) or choose an annual membership.'}
              {step === 'confirmation' && 'Your license is verified and commercial access is ready.'}
            </p>
          </div>

          {/* Stepper bar */}
          <div className="pt-5 grid grid-cols-3 gap-2">
            {[
              { id: 'login', num: '1', label: 'Sign In (Google/Email)' },
              { id: 'checkout', num: '2', label: 'Checkout & Plan' },
              { id: 'confirmation', num: '3', label: 'Active Access' },
            ].map((s) => {
              const isCurrent = (step === 'login' || step === 'google_select' || step === 'profile') 
                ? s.id === 'login' 
                : step === s.id;
              const isPast = (step === 'checkout' && s.id === 'login') || step === 'confirmation';
              return (
                <div key={s.id} className="space-y-1">
                  <div 
                    className={`h-1.5 rounded-full transition-all ${
                      isCurrent ? 'bg-emerald-400' : isPast ? 'bg-emerald-600' : 'bg-neutral-800'
                    }`} 
                  />
                  <div className="text-[10px] text-neutral-400 font-medium">
                    <span className={isCurrent ? 'text-white font-bold' : isPast ? 'text-emerald-400' : ''}>
                      {s.num}. {s.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          {/* ================= STEP 1: AUTHENTICATION (GOOGLE, LINKEDIN, EMAIL) ================= */}
          {step === 'login' && (
            <div className="space-y-6">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-bold font-heading text-neutral-900">
                  Select Your Preferred Login Method
                </h3>
                <p className="text-xs text-neutral-500">
                  Instant authentication. You will be redirected to the checkout page next.
                </p>
              </div>

              {/* 1. GOOGLE SIGN-IN BUTTON (PRIMARY - OFFICIAL STYLE) */}
              <button
                type="button"
                onClick={() => setStep('google_select')}
                className="w-full py-3.5 px-4 rounded-2xl border-2 border-neutral-200 hover:border-neutral-400 bg-white hover:bg-neutral-50 transition-all flex items-center justify-center space-x-3 shadow-xs group cursor-pointer active:scale-[0.99]"
              >
                {/* Official Google G Logo SVG */}
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span className="text-sm font-bold text-neutral-800 group-hover:text-black">
                  Continue with Google
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 ml-auto">
                  Instant
                </span>
              </button>

              {/* 2. LINKEDIN SIGN-IN BUTTON */}
              <button
                type="button"
                onClick={handleLinkedInSignIn}
                className="w-full py-3.5 px-4 rounded-2xl border border-neutral-200 hover:border-neutral-300 bg-white hover:bg-neutral-50 transition-all flex items-center justify-center space-x-3 shadow-2xs group cursor-pointer active:scale-[0.99]"
              >
                {/* LinkedIn Logo */}
                <div className="w-5 h-5 rounded bg-[#0A66C2] flex items-center justify-center text-white font-bold text-xs">
                  in
                </div>
                <span className="text-sm font-semibold text-neutral-700 group-hover:text-black">
                  Continue with LinkedIn
                </span>
              </button>

              {/* Divider */}
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-neutral-200"></div>
                <span className="flex-shrink mx-4 text-xs uppercase font-bold text-neutral-400">
                  Or sign in with work email
                </span>
                <div className="flex-grow border-t border-neutral-200"></div>
              </div>

              {/* 3. EMAIL FORM */}
              <form onSubmit={handleEmailLoginSubmit} className="space-y-4">
                {loginError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Work Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. culinary.director@hotelgroup.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-neutral-800">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[11px] text-neutral-500 hover:text-black cursor-pointer">
                      Forgot Password?
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-black hover:bg-neutral-800 text-white flex items-center justify-center space-x-2 transition-all shadow-sm"
                >
                  <span>Sign In & Continue to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* ================= STEP 1B: GOOGLE ACCOUNT CHOOSER ================= */}
          {step === 'google_select' && (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                </div>
                <h3 className="text-base font-bold text-neutral-900 font-heading">
                  Sign in with Google
                </h3>
                <p className="text-xs text-neutral-500">
                  Choose an account to continue to Zero Waste by Supritamone
                </p>
              </div>

              <div className="space-y-2 border border-neutral-200 rounded-2xl overflow-hidden divide-y divide-neutral-100">
                {googleAccounts.map((acc, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectGoogleAccount(acc)}
                    className="p-3.5 flex items-center space-x-3 hover:bg-neutral-50 cursor-pointer transition-all"
                  >
                    <img
                      src={acc.avatar}
                      alt={acc.name}
                      className="w-10 h-10 rounded-full object-cover border border-neutral-200"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-neutral-900 truncate">{acc.name}</p>
                      <p className="text-[11px] text-neutral-500 truncate">{acc.email}</p>
                      <span className="text-[10px] text-emerald-700 font-semibold">{acc.role}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-400" />
                  </div>
                ))}

                {/* Custom Google Account Option */}
                <div
                  onClick={() => {
                    handleSelectGoogleAccount({
                      name: 'Culinary Professional',
                      email: loginEmail || 'member@kitchen.org',
                      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=120&q=80',
                      role: 'Head of Culinary Brigade',
                      workPlace: 'Culinary Hospitality Group'
                    });
                  }}
                  className="p-3.5 flex items-center space-x-3 hover:bg-neutral-50 cursor-pointer transition-all text-xs text-neutral-700 font-medium"
                >
                  <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 font-bold">
                    +
                  </div>
                  <span>Use another Google account</span>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center text-xs text-neutral-500">
                <button
                  type="button"
                  onClick={() => setStep('login')}
                  className="text-neutral-600 hover:text-black font-semibold"
                >
                  ← Back to other login methods
                </button>
                <span className="text-[11px] text-neutral-400">Google OAuth 2.0 Secure</span>
              </div>
            </div>
          )}

          {/* ================= STEP 2: CHECKOUT & PLAN SELECTION ================= */}
          {step === 'checkout' && (
            <div className="space-y-6">
              {/* Authenticated user bar */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-3.5 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs">
                    {firstName.charAt(0) || 'C'}
                  </div>
                  <div>
                    <p className="font-bold text-neutral-900">
                      Signed in as: {firstName} {lastName} ({workEmail})
                    </p>
                    <p className="text-[10px] text-neutral-500">
                      Provider: {authProvider.toUpperCase()} • {designation || 'Head Chef'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('login')}
                  className="text-[11px] text-neutral-500 hover:text-black font-medium underline"
                >
                  Switch account
                </button>
              </div>

              {/* Device and IP Hold Status Callout */}
              {isIpHeld && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-xs text-red-900 flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold">Device & Network Hold Active</p>
                    <p className="text-red-800 text-[11px] leading-relaxed">
                      Our system detected that the 3-day complimentary trial has already concluded on this network IP (<strong>{deviceInfo.ipAddress}</strong>) and workstation (<strong>{deviceInfo.macHash}</strong>). To proceed, please select one of the 1-year annual membership options below.
                    </p>
                  </div>
                </div>
              )}

              {/* 4 Membership Plans Selection */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center justify-between">
                  <span>Select Membership Plan</span>
                  <span className="text-[10px] font-mono text-neutral-400">
                    Network IP: {deviceInfo.ipAddress}
                  </span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PRICING_PLANS.map((plan) => {
                    const isSelected = selectedPlanId === plan.id;
                    const isTrial = plan.isTrial;
                    const isTrialDisabled = isTrial && (!canClaimTrial || isIpHeld);

                    return (
                      <div
                        key={plan.id}
                        onClick={() => {
                          if (isTrialDisabled) {
                            alert('This device and IP have already used the 3-day trial. Please choose an annual plan.');
                            return;
                          }
                          setSelectedPlanId(plan.id);
                          setZiinaOpened(false);
                        }}
                        className={`p-4 rounded-2xl border transition-all flex flex-col justify-between relative ${
                          isTrialDisabled 
                            ? 'opacity-60 bg-neutral-100 border-neutral-300 cursor-not-allowed'
                            : 'cursor-pointer'
                        } ${
                          isSelected && !isTrialDisabled
                            ? 'border-black bg-neutral-50 ring-2 ring-black shadow-sm'
                            : 'border-neutral-200 bg-white hover:border-neutral-400'
                        }`}
                      >
                        {plan.badge && (
                          <span className={`absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            isTrial 
                              ? 'bg-emerald-600 text-white' 
                              : plan.highlighted 
                              ? 'bg-black text-white' 
                              : 'bg-neutral-800 text-neutral-200'
                          }`}>
                            {plan.badge}
                          </span>
                        )}

                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-sm text-neutral-900 font-heading">{plan.title}</h4>
                            <div className="text-right">
                              <span className="text-xl font-black font-heading text-neutral-900">{plan.price}</span>
                              <span className="text-[10px] text-neutral-500 block">USD {plan.cadence}</span>
                            </div>
                          </div>
                          <p className="text-[11px] text-neutral-600 line-clamp-2 leading-relaxed">
                            {plan.description}
                          </p>
                        </div>

                        <div className="pt-3 mt-2 border-t border-neutral-200/60 flex items-center justify-between">
                          <span className="text-[10px] text-neutral-500">
                            {isTrial 
                              ? (isTrialDisabled ? 'Trial used on this IP' : 'No card required • 72h') 
                              : '1-Year Full Commercial Access'}
                          </span>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-black bg-black text-white' : 'border-neutral-300'
                          }`}>
                            {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ACTION SECTION DEPENDING ON SELECTED PLAN */}
              {isTrialSelected ? (
                /* === OPTION A: 3-DAY FREE TRIAL ($0 USD) === */
                <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center space-x-2 text-emerald-950 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span>3-Day Free Trial ($0.00 USD) • No Credit Card Required</span>
                  </div>
                  <p className="text-xs text-emerald-900 leading-relaxed">
                    Test the complete commercial platform for <strong>72 hours</strong>. After 3 days, this workstation/IP will enter the hold period, where you can select an annual plan to continue.
                  </p>
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-emerald-800 font-mono">
                      Workstation ID: {deviceInfo.deviceId}
                    </span>
                    <button
                      type="button"
                      onClick={handleActivateTrial}
                      disabled={isProcessing || !canClaimTrial || isIpHeld}
                      className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white flex items-center space-x-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <span>Activating 72h Access...</span>
                      ) : (
                        <>
                          <span>START 3-DAY FREE TRIAL ($0 USD)</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                /* === OPTION B: PAID MEMBERSHIPS ($79, $99, $1499 USD via Ziina) === */
                <div className="bg-neutral-50 border border-neutral-300 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                        Selected Annual Plan
                      </span>
                      <h4 className="text-base font-bold text-neutral-900 font-heading">
                        {currentPlan.title} • {currentPlan.price} USD / Year
                      </h4>
                    </div>
                    <span className="text-xs font-mono font-bold bg-white px-2.5 py-1 rounded-lg border border-neutral-200">
                      Ziina Payment Gateway
                    </span>
                  </div>

                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Click <strong>"Pay {currentPlan.price} USD on Ziina"</strong> to open the secure checkout portal. Once your transaction is finished on Ziina, return here and click <strong>"Confirm Ziina Payment & Activate 1-Year Access"</strong>.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (currentPlan.ziinaPayUrl) {
                          handleOpenZiinaLink(currentPlan.ziinaPayUrl);
                        }
                      }}
                      className="flex-1 py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-black hover:bg-neutral-800 text-white flex items-center justify-center space-x-2 transition-all shadow-md active:scale-95"
                    >
                      <span>Pay {currentPlan.price} USD on Ziina</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleConfirmPaidMembership(currentPlan)}
                      disabled={isProcessing}
                      className="flex-1 py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center space-x-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Activating 1-Year Access...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Confirm & Activate 1-Year Access</span>
                        </>
                      )}
                    </button>
                  </div>

                  {ziinaOpened && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>
                        Ziina checkout portal opened! Complete payment in that window, then click "Confirm & Activate 1-Year Access" to unlock your license.
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* QA Simulator controls */}
              <div className="pt-2 border-t border-neutral-100 flex flex-wrap items-center justify-between text-[11px] text-neutral-400 gap-2">
                <span>Testing Options:</span>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      deviceHoldService.simulateTrialExpiry();
                      setIsIpHeld(true);
                      setCanClaimTrial(false);
                      setSelectedPlanId('team');
                    }}
                    className="px-2 py-0.5 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-600"
                  >
                    Simulate Trial Expired / IP Hold
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      deviceHoldService.resetDeviceHold();
                      setIsIpHeld(false);
                      setCanClaimTrial(true);
                      setSelectedPlanId('trial');
                    }}
                    className="px-2 py-0.5 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-600"
                  >
                    Reset Hold
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 3: CONFIRMATION & CREDENTIAL CARD ================= */}
          {step === 'confirmation' && (
            <div className="text-center space-y-6 py-2">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-block">
                  {isTrialSelected ? '🎉 3-DAY FREE TRIAL ACTIVE' : '✨ 1-YEAR ANNUAL MEMBERSHIP ACTIVE'}
                </span>
                <h3 className="text-2xl font-bold font-heading text-neutral-900">
                  Welcome, {firstName} {lastName}!
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto">
                  {isTrialSelected 
                    ? `Your 3-day free trial has been activated on network IP ${deviceInfo.ipAddress}. You have full unrestricted access for 72 hours without a credit card.`
                    : `Your annual subscription has been activated for 1 Year (valid through ${new Date(Date.now() + 365*24*3600*1000).toLocaleDateString()}). Receipt and brigade onboarding sent to ${workEmail}.`}
                </p>
              </div>

              {/* Credential Card */}
              <div className="max-w-md mx-auto bg-neutral-50 border border-neutral-200 rounded-2xl p-5 text-left space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Official Kitchen License
                  </span>
                  <span className="font-mono text-[10px] text-neutral-600 font-bold">
                    ID: ZWK-2026-{Math.floor(1000 + Math.random() * 9000)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-neutral-400 block">License Holder</span>
                    <span className="font-bold text-neutral-900">{firstName} {lastName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block">Work Email</span>
                    <span className="font-bold text-neutral-900 truncate block">{workEmail}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block">Workstation / IP</span>
                    <span className="font-mono text-neutral-700">{deviceInfo.ipAddress}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block">Plan & Duration</span>
                    <span className="font-bold text-emerald-700">
                      {isTrialSelected ? '3-Day Free Trial (72h)' : `${currentPlan.title} (1 Year)`}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-[11px] text-neutral-500">
                  <span>Activated: {trialActivatedDate || 'Today'}</span>
                  {isTrialSelected ? (
                    <span className="text-emerald-700 font-bold">72 Hours Remaining</span>
                  ) : (
                    <span className="text-neutral-700 font-bold">Valid for 365 Days</span>
                  )}
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => {
                    onClose();
                    if (onOpenDashboard) onOpenDashboard();
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-black hover:bg-neutral-800 text-white shadow-md transition-all"
                >
                  Open Kitchen Dashboard
                </button>
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold text-neutral-700 hover:text-black bg-neutral-100 hover:bg-neutral-200 transition-all"
                >
                  Browse Recipes & Upcycles
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
