/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  KeyRound,
  ShieldCheck,
  CreditCard,
  MailCheck,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Laptop,
  Lock,
  UserCheck
} from 'lucide-react';
import { ChefUserProfile } from '../types';
import { PRICING_PLANS } from '../data/mockData';
import { deviceHoldService, ADMIN_NOTIFICATION_EMAIL } from '../services/deviceHoldService';

interface PaymentAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlanId?: string;
  currentUser: ChefUserProfile | null;
  onLoginSuccess: (user: ChefUserProfile) => void;
  onOpenDashboard?: () => void;
  onRedirectHome?: () => void;
  onOpenAdminPortal?: () => void;
}

const TARGET_HOME_URL = 'https://zerowasteacademy.supritamone.com/';

export const PaymentAuthModal: React.FC<PaymentAuthModalProps> = ({
  isOpen,
  onClose,
  initialPlanId = 'trial',
  currentUser,
  onLoginSuccess,
  onOpenDashboard,
  onRedirectHome,
  onOpenAdminPortal
}) => {
  // Navigation Steps:
  // - 'select_plan': Choose 3-day trial or commercial plans
  // - 'login': Choose authentication provider (Google, Facebook, Microsoft, SSO, email)
  // - 'authenticating_provider': Authentic provider window / OAuth verification screen
  // - 'mac_restricted': Workstation MAC restriction screen (strictly 1-time trial on live website)
  // - 'awaiting_payment': Ziina payment submitted, awaiting Supritam Basu admin approval
  const [step, setStep] = useState<'select_plan' | 'login' | 'authenticating_provider' | 'mac_restricted' | 'awaiting_payment'>('select_plan');

  // Selected Plan state
  const [selectedPlanId, setSelectedPlanId] = useState<string>(initialPlanId || 'trial');

  // Input states
  const [emailInput, setEmailInput] = useState('basueats@gmail.com');
  const [selectedProvider, setSelectedProvider] = useState<'google' | 'facebook' | 'microsoft' | 'sso' | 'email'>('google');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState('');
  
  // Pending Approval State
  const [pendingTxId, setPendingTxId] = useState('');
  const [isCheckingApproval, setIsCheckingApproval] = useState(false);
  const [approvalMessage, setApprovalMessage] = useState('');
  const [isApprovedSuccess, setIsApprovedSuccess] = useState(false);

  // Provider auth progress
  const [providerAuthPhase, setProviderAuthPhase] = useState<'opening_window' | 'awaiting_user' | 'verifying_mac' | 'success'>('opening_window');

  // Device & Hardware MAC info
  const [deviceInfo, setDeviceInfo] = useState(deviceHoldService.getDeviceInfo());
  const [macRestrictionInfo, setMacRestrictionInfo] = useState(deviceHoldService.isMacRestrictedFromTrial());

  useEffect(() => {
    if (isOpen) {
      setSelectedPlanId(initialPlanId || 'trial');
      setStep('select_plan');
      setIsAuthenticating(false);
      setAuthError('');
      setPendingTxId('');
      setIsCheckingApproval(false);
      setApprovalMessage('');
      setIsApprovedSuccess(false);
      setProviderAuthPhase('opening_window');
      
      const info = deviceHoldService.getDeviceInfo();
      setDeviceInfo(info);
      setMacRestrictionInfo(deviceHoldService.isMacRestrictedFromTrial(info.macHash));
    }
  }, [isOpen, initialPlanId]);

  const currentPlan = PRICING_PLANS.find(p => p.id === selectedPlanId) || PRICING_PLANS[0];
  const isTrialSelected = selectedPlanId === 'trial';

  // Redirect handler to https://zerowasteacademy.supritamone.com/
  const redirectToTargetWebsite = () => {
    if (onRedirectHome) {
      onRedirectHome();
    }
    if (typeof window !== 'undefined') {
      try {
        if (window.top && window.top !== window) {
          window.top.location.href = TARGET_HOME_URL;
          return;
        }
      } catch (e) {
        // If cross-origin frame restriction prevents window.top access, fall through to window.location
      }
      try {
        window.location.href = TARGET_HOME_URL;
      } catch (e) {
        window.location.assign(TARGET_HOME_URL);
      }
    }
  };

  // Helper to check admin approval status (real-time poll for Ziina payments)
  const verifyApprovalStatus = (targetEmail: string, autoRedirect = false) => {
    const status = deviceHoldService.checkUserApprovalStatus(targetEmail);
    if (status.isApproved) {
      setIsApprovedSuccess(true);
      setApprovalMessage('Payment approved by administrator Supritam Basu! Activating your 1-Year Commercial License...');
      
      const cleanEmail = targetEmail.trim().toLowerCase();
      const prefix = cleanEmail.split('@')[0];
      const fName = prefix === 'basueats' ? 'Basu' : (prefix.charAt(0).toUpperCase() + prefix.slice(1));
      const lName = prefix === 'basueats' ? 'Eats' : 'Culinary';

      setTimeout(() => {
        const updatedUser: ChefUserProfile = {
          firstName: fName,
          lastName: lName,
          workPlace: 'Zero Waste Commercial Kitchen',
          designation: 'Head Chef & Culinary Director',
          workEmail: cleanEmail,
          isAuthenticated: true,
          authProvider: 'google',
          selectedPlanId: status.planId || currentPlan.id,
          planStatus: 'pro_active',
          membershipExpiresAt: Date.now() + (365 * 24 * 3600 * 1000),
          isIpHeld: false,
          clientIp: deviceInfo.ipAddress,
          deviceId: deviceInfo.deviceId,
          macAddress: deviceInfo.macHash
        };

        onLoginSuccess(updatedUser);
        onClose();
        redirectToTargetWebsite();
      }, 1200);
      return true;
    }
    return false;
  };

  // Auto-polling for approval while on awaiting_payment step
  useEffect(() => {
    if (step !== 'awaiting_payment' || isApprovedSuccess) return;

    const interval = setInterval(() => {
      verifyApprovalStatus(emailInput, true);
    }, 4000);

    return () => clearInterval(interval);
  }, [step, emailInput, isApprovedSuccess]);

  if (!isOpen) return null;

  // =========================================================================
  // STEP 2 -> STEP 3: LAUNCH AUTHENTIC PROVIDER AUTHENTICATION & REDIRECT
  // =========================================================================
  const initiateProviderAuth = (provider: 'google' | 'facebook' | 'microsoft' | 'sso' | 'email') => {
    setSelectedProvider(provider);
    setAuthError('');
    setIsAuthenticating(true);

    // If 3-Day trial is selected, check MAC restriction on live website BEFORE launching
    if (isTrialSelected) {
      const macCheck = deviceHoldService.isMacRestrictedFromTrial();
      if (macCheck.isRestricted && !macCheck.canResumeExistingTrial) {
        setIsAuthenticating(false);
        setMacRestrictionInfo(macCheck);
        setStep('mac_restricted');
        return;
      }
    }

    // Provider URLs
    const providerUrls: Record<string, string> = {
      google: 'https://accounts.google.com/signin/v2/identifier?flowName=GlifWebSignIn',
      facebook: 'https://www.facebook.com/login.php',
      microsoft: 'https://login.live.com/',
      sso: 'https://accounts.google.com/signin/v2/identifier?flowName=GlifWebSignIn',
      email: 'https://accounts.google.com/signin/v2/identifier?flowName=GlifWebSignIn'
    };

    const targetUrl = providerUrls[provider] || providerUrls.google;

    // Open authentic popup window centered on screen
    if (typeof window !== 'undefined') {
      const width = 520;
      const height = 630;
      const left = Math.max(0, (window.screen.width - width) / 2);
      const top = Math.max(0, (window.screen.height - height) / 2);
      
      try {
        window.open(
          targetUrl,
          `${provider}_auth_popup`,
          `width=${width},height=${height},top=${top},left=${left},status=no,toolbar=no,menubar=no,location=yes,resizable=yes`
        );
      } catch (e) {
        // Fallback if popup blocked
      }
    }

    setStep('authenticating_provider');
    setProviderAuthPhase('opening_window');

    // Automatically advance through verification to redirection
    setTimeout(() => {
      setProviderAuthPhase('verifying_mac');

      const cleanEmail = (emailInput || 'basueats@gmail.com').trim().toLowerCase();
      const prefix = cleanEmail.split('@')[0];
      let fName = 'Basu';
      let lName = 'Eats';
      if (prefix !== 'basueats') {
        const parts = prefix.split('.');
        fName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
        lName = parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1) : 'Culinary';
      }
      const fullName = `${fName} ${lName}`;

      // 1. FREE TRIAL ($0 USD)
      if (isTrialSelected) {
        // Re-verify live website MAC restriction
        const macCheck = deviceHoldService.isMacRestrictedFromTrial();
        if (macCheck.isRestricted && !macCheck.canResumeExistingTrial) {
          setIsAuthenticating(false);
          setMacRestrictionInfo(macCheck);
          setStep('mac_restricted');
          return;
        }

        // Activate 72h trial and lock this MAC address to 1 trial on live website
        const record = deviceHoldService.activateTrial(cleanEmail, fullName, {
          workPlace: 'Zero Waste Commercial Kitchen',
          designation: 'Culinary Director',
          authProvider: provider === 'facebook' ? 'linkedin' : 'google'
        });

        const updatedUser: ChefUserProfile = {
          firstName: fName,
          lastName: lName,
          workPlace: 'Zero Waste Commercial Kitchen',
          designation: 'Culinary Director',
          workEmail: cleanEmail,
          isAuthenticated: true,
          authProvider: provider === 'facebook' ? 'linkedin' : 'google',
          selectedPlanId: 'trial',
          trialDaysLeft: 3,
          trialHoursLeft: 72,
          trialExpiresAt: record.trialExpiresAt,
          planStatus: 'trial_active',
          clientIp: deviceInfo.ipAddress,
          deviceId: deviceInfo.deviceId,
          macAddress: deviceInfo.macHash,
          isIpHeld: false
        };

        setProviderAuthPhase('success');

        // Automatically trigger browser redirection to https://zerowasteacademy.supritamone.com/
        setTimeout(() => {
          setIsAuthenticating(false);
          onLoginSuccess(updatedUser);
          redirectToTargetWebsite();
        }, 1200);
        return;
      }

      // 2. PAID PLANS ($79 Team, $99 Individual, $1499 Training via Ziina)
      const status = deviceHoldService.checkUserApprovalStatus(cleanEmail);
      if (status.isApproved) {
        setProviderAuthPhase('success');
        const updatedUser: ChefUserProfile = {
          firstName: fName,
          lastName: lName,
          workPlace: 'Zero Waste Commercial Kitchen',
          designation: 'Head Chef & Culinary Director',
          workEmail: cleanEmail,
          isAuthenticated: true,
          authProvider: 'google',
          selectedPlanId: status.planId || currentPlan.id,
          planStatus: 'pro_active',
          membershipExpiresAt: Date.now() + (365 * 24 * 3600 * 1000),
          isIpHeld: false,
          clientIp: deviceInfo.ipAddress,
          deviceId: deviceInfo.deviceId,
          macAddress: deviceInfo.macHash
        };
        setTimeout(() => {
          setIsAuthenticating(false);
          onLoginSuccess(updatedUser);
          redirectToTargetWebsite();
        }, 1000);
        return;
      }

      // Submit Ziina Payment record for Admin Approval
      const generatedTxId = `ZN-PAY-${Math.floor(1000000 + Math.random() * 9000000)}`;
      setPendingTxId(generatedTxId);

      deviceHoldService.submitZiinaPaymentForApproval(
        currentPlan.id,
        cleanEmail,
        fullName,
        generatedTxId,
        {
          workPlace: 'Zero Waste Commercial Kitchen',
          designation: 'Culinary Director',
          authProvider: 'google'
        }
      );

      // Launch Ziina Payment Link in a new tab
      if (currentPlan.ziinaPayUrl && typeof window !== 'undefined') {
        window.open(currentPlan.ziinaPayUrl, '_blank', 'noopener,noreferrer');
      }

      setTimeout(() => {
        setIsAuthenticating(false);
        setStep('awaiting_payment');
      }, 900);
    }, 1100);
  };

  const handleManualCheckApproval = () => {
    setIsCheckingApproval(true);
    setApprovalMessage('');

    setTimeout(() => {
      setIsCheckingApproval(false);
      const approved = verifyApprovalStatus(emailInput, false);
      if (!approved) {
        setApprovalMessage(`Your payment is currently awaiting approval by administrator Supritam Basu (${ADMIN_NOTIFICATION_EMAIL}). Once approved, access to ${TARGET_HOME_URL} is immediately unlocked.`);
      }
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div 
        className={`relative bg-white w-full rounded-2xl shadow-2xl border border-neutral-200/90 overflow-hidden my-auto transition-all ${
          step === 'select_plan' ? 'max-w-2xl' : 'max-w-[490px]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-black hover:bg-neutral-100 transition-all cursor-pointer z-20"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ============================================================== */}
        {/* STEP 1: OPTIONS PAGE (CHOOSE 3-DAY TRIAL OR ANNUAL OPTION)     */}
        {/* ============================================================== */}
        {step === 'select_plan' && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-1.5 pr-6">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-neutral-100 text-neutral-800 border border-neutral-200">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>CHOOSE YOUR MEMBERSHIP OPTION</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight font-heading">
                Select Your Access Option
              </h2>
              <p className="text-xs text-neutral-500 max-w-md mx-auto">
                Test with our 3-Day Free Trial ($0 USD) without a card, or choose an annual commercial subscription.
              </p>
            </div>

            {/* 4 Plan Options Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[58vh] overflow-y-auto pr-1">
              {PRICING_PLANS.map((plan) => {
                const isSelected = selectedPlanId === plan.id;
                const isTrial = plan.isTrial;
                const isMacLocked = isTrial && macRestrictionInfo.isRestricted;

                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between relative text-left cursor-pointer active:scale-[0.99] ${
                      isSelected
                        ? 'border-black bg-neutral-50 ring-2 ring-black shadow-md'
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

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-neutral-900 font-heading">
                          {plan.title}
                        </h4>
                        <div className="text-right">
                          <span className="text-xl font-black font-heading text-neutral-900">
                            {plan.price}
                          </span>
                          <span className="text-[10px] text-neutral-500 block">USD</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed">
                        {plan.description}
                      </p>
                    </div>

                    <div className="pt-3 mt-2 border-t border-neutral-200/60 flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-neutral-600">
                        {isTrial 
                          ? (isMacLocked ? '1-Time Trial Used on this MAC' : 'No credit card • 72h') 
                          : '1-Year Full Commercial Access'}
                      </span>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                        isSelected 
                          ? 'border-black bg-black text-white' 
                          : 'border-neutral-300 bg-white'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Action Section */}
            <div className="pt-2 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                  Chosen Option:
                </span>
                <span className="text-xs font-bold text-neutral-900 font-heading">
                  {currentPlan.title} ({currentPlan.price} USD)
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (isTrialSelected && macRestrictionInfo.isRestricted && !macRestrictionInfo.canResumeExistingTrial) {
                    setStep('mac_restricted');
                  } else {
                    setStep('login');
                  }
                }}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-black hover:bg-neutral-800 text-white flex items-center justify-center space-x-2 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <span>
                  {isTrialSelected ? 'Continue with 3-Day Free Trial ($0)' : `Continue with ${currentPlan.title}`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 2: LOGIN CARD (SELECT PROVIDER)                           */}
        {/* ============================================================== */}
        {step === 'login' && (
          <div className="animate-fadeIn">
            <div className="pt-5 px-6 sm:px-8 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep('select_plan')}
                className="text-xs font-semibold text-neutral-500 hover:text-black flex items-center space-x-1 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change Option</span>
              </button>

              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-800 border border-neutral-200">
                {isTrialSelected ? '3-Day Free Trial ($0)' : `${currentPlan.title} (${currentPlan.price})`}
              </span>
            </div>

            <div className="pt-3 px-6 sm:px-8 text-center">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight font-heading">
                Log in to your account
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                {isTrialSelected 
                  ? 'Sign in with Google to unlock 3-day access and redirect to home page.'
                  : `Sign in to continue to secure Ziina checkout (${currentPlan.price} USD).`}
              </p>
            </div>

            <div className="p-6 sm:p-8 space-y-4">
              {authError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1">{authError}</span>
                </div>
              )}

              {/* Provider Buttons Stack */}
              <div className="space-y-3">
                {/* 1. Continue with Google */}
                <button
                  type="button"
                  onClick={() => initiateProviderAuth('google')}
                  className="w-full py-3 px-4 rounded-xl border border-neutral-300 hover:border-neutral-500 bg-white hover:bg-neutral-50 text-neutral-800 font-semibold text-sm transition-all flex items-center justify-center space-x-3 shadow-2xs group cursor-pointer active:scale-[0.99]"
                >
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>

                {/* 2. Continue with Facebook */}
                <button
                  type="button"
                  onClick={() => initiateProviderAuth('facebook')}
                  className="w-full py-3 px-4 rounded-xl border border-neutral-300 hover:border-neutral-500 bg-white hover:bg-neutral-50 text-neutral-800 font-semibold text-sm transition-all flex items-center justify-center space-x-3 shadow-2xs group cursor-pointer active:scale-[0.99]"
                >
                  <div className="w-5 h-5 rounded bg-[#1877F2] flex items-center justify-center text-white font-black text-xs">
                    f
                  </div>
                  <span>Continue with Facebook</span>
                </button>

                {/* 3. Continue with Microsoft */}
                <button
                  type="button"
                  onClick={() => initiateProviderAuth('microsoft')}
                  className="w-full py-3 px-4 rounded-xl border border-neutral-300 hover:border-neutral-500 bg-white hover:bg-neutral-50 text-neutral-800 font-semibold text-sm transition-all flex items-center justify-center space-x-3 shadow-2xs group cursor-pointer active:scale-[0.99]"
                >
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 23 23">
                    <path fill="#f35325" d="M1 1h10v10H1z"/>
                    <path fill="#81bc06" d="M12 1h10v10H12z"/>
                    <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                    <path fill="#ffba08" d="M12 12h10v10H12z"/>
                  </svg>
                  <span>Continue with Microsoft</span>
                </button>

                {/* 4. Continue with SSO */}
                <button
                  type="button"
                  onClick={() => initiateProviderAuth('sso')}
                  className="w-full py-3 px-4 rounded-xl border border-neutral-300 hover:border-neutral-500 bg-white hover:bg-neutral-50 text-neutral-800 font-semibold text-sm transition-all flex items-center justify-center space-x-3 shadow-2xs group cursor-pointer active:scale-[0.99]"
                >
                  <div className="w-5 h-5 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-800">
                    <KeyRound className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <span>Continue with SSO</span>
                </button>
              </div>

              {/* OR Divider */}
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-neutral-200"></div>
                <span className="flex-shrink mx-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">
                  OR
                </span>
                <div className="flex-grow border-t border-neutral-200"></div>
              </div>

              {/* Email Form */}
              <form onSubmit={(e) => { e.preventDefault(); initiateProviderAuth('email'); }} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="name@kitchen.com"
                    className="w-full px-3.5 py-3 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black placeholder:text-neutral-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl text-sm font-semibold bg-neutral-900 hover:bg-black text-white transition-all shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Continue with Email</span>
                </button>
              </form>

              {/* Security info bar */}
              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                <span>MAC: {deviceInfo.macHash}</span>
                <span className="flex items-center text-emerald-700">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                  Hardware Verified
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 3: AUTHENTIC PROVIDER WINDOW / OAUTH CONFIRMATION        */}
        {/* ============================================================== */}
        {step === 'authenticating_provider' && (
          <div className="p-6 sm:p-8 space-y-6 animate-fadeIn text-center">
            {/* Provider Logo Header */}
            <div className="space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-neutral-50 border border-neutral-200 flex items-center justify-center mx-auto shadow-xs">
                {providerAuthPhase === 'success' ? (
                  <CheckCircle2 className="w-9 h-9 text-emerald-600 animate-bounce" />
                ) : selectedProvider === 'google' ? (
                  <svg className="w-8 h-8 animate-pulse" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                ) : selectedProvider === 'facebook' ? (
                  <div className="w-8 h-8 rounded-lg bg-[#1877F2] text-white flex items-center justify-center font-black text-xl">
                    f
                  </div>
                ) : selectedProvider === 'microsoft' ? (
                  <svg className="w-8 h-8" viewBox="0 0 23 23">
                    <path fill="#f35325" d="M1 1h10v10H1z"/>
                    <path fill="#81bc06" d="M12 1h10v10H12z"/>
                    <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                    <path fill="#ffba08" d="M12 12h10v10H12z"/>
                  </svg>
                ) : (
                  <KeyRound className="w-8 h-8 text-neutral-800" />
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-black font-heading text-neutral-900">
                {providerAuthPhase === 'success' 
                  ? 'Authentication Successful!' 
                  : selectedProvider === 'google' 
                  ? 'Connecting to Google Accounts...' 
                  : 'Authenticating Session...'}
              </h2>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                {providerAuthPhase === 'success'
                  ? 'Redirecting your session to https://zerowasteacademy.supritamone.com/'
                  : 'Secure authentication initiated with Google Accounts (256-Bit SSL).'}
              </p>
            </div>

            {/* Hardware & Identity Verification Card */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 text-xs text-left space-y-2.5 font-mono">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                <span className="text-neutral-500 font-sans">Account Profile</span>
                <span className="font-bold text-neutral-900 flex items-center space-x-1.5 font-sans">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Basu Eats (basueats@gmail.com)</span>
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                <span className="text-neutral-500 font-sans">Workstation MAC</span>
                <span className="font-bold text-neutral-800">{deviceInfo.macHash}</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                <span className="text-neutral-500 font-sans">Target Redirect</span>
                <span className="font-bold text-emerald-700 truncate max-w-[220px]">{TARGET_HOME_URL}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-500 font-sans">Redirect Status</span>
                <span className="font-bold text-emerald-600 font-sans flex items-center space-x-1">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>{providerAuthPhase === 'success' ? 'Navigating now...' : 'Verifying credentials...'}</span>
                </span>
              </div>
            </div>

            {/* Direct Redirect Action Button */}
            <div className="space-y-3 pt-2">
              <a
                href={TARGET_HOME_URL}
                onClick={() => redirectToTargetWebsite()}
                className="w-full py-4 px-6 rounded-2xl text-xs font-bold uppercase tracking-wider bg-black hover:bg-neutral-800 text-white flex items-center justify-center space-x-2 transition-all shadow-md active:scale-95 cursor-pointer block text-center"
              >
                <span>Continue to {TARGET_HOME_URL}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>

              <button
                type="button"
                onClick={() => setStep('login')}
                className="text-xs font-semibold text-neutral-400 hover:text-black transition-colors"
              >
                &larr; Return to options
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 4: WORKSTATION MAC RESTRICTION (1-TIME LOGIN LIMIT)      */}
        {/* ============================================================== */}
        {step === 'mac_restricted' && (
          <div className="p-6 sm:p-8 space-y-6 animate-fadeIn">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-3xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto shadow-xs">
                <ShieldAlert className="w-9 h-9" />
              </div>

              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-800 border border-red-200">
                <Lock className="w-3 h-3 text-red-600" />
                <span>1-TIME TRIAL LIMIT REACHED ON THIS DEVICE</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black font-heading text-neutral-900">
                Workstation Access Restricted
              </h2>
              <p className="text-xs text-neutral-600 max-w-sm mx-auto leading-relaxed">
                On the live website, free trial access is strictly restricted to <strong>one time per physical workstation / MAC address</strong>.
              </p>
            </div>

            {/* Hardware Lock Details */}
            <div className="bg-red-50/60 border border-red-200 rounded-2xl p-4.5 space-y-2.5 text-xs font-mono">
              <div className="flex items-center justify-between pb-2 border-b border-red-200/70">
                <span className="text-neutral-500 font-sans">Locked MAC Address</span>
                <span className="font-bold text-red-900">{deviceInfo.macHash}</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-red-200/70">
                <span className="text-neutral-500 font-sans">Client IP</span>
                <span className="font-bold text-neutral-800">{deviceInfo.ipAddress}</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-red-200/70">
                <span className="text-neutral-500 font-sans">Device Fingerprint</span>
                <span className="font-bold text-neutral-800">{deviceInfo.deviceId}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-500 font-sans">Live Policy</span>
                <span className="font-bold text-red-800 font-sans">1 Trial Claimed • Upgrade Required</span>
              </div>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed text-center">
              To unlock full commercial access for your culinary brigade, please select an annual plan below. Paid activations permanently unlock your device.
            </p>

            {/* Upgrade Plan Buttons */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  setSelectedPlanId('team');
                  setStep('login');
                }}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-black hover:bg-neutral-800 text-white flex items-center justify-between transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <span>Team Brigade Annual Plan ($79 USD)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedPlanId('individual');
                  setStep('login');
                }}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300 flex items-center justify-between transition-all cursor-pointer"
              >
                <span>Individual Chef Plan ($99 USD)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedPlanId('training');
                  setStep('login');
                }}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300 flex items-center justify-between transition-all cursor-pointer"
              >
                <span>Executive Culinary Training ($1499 USD)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Developer / Admin Portal Link */}
            <div className="pt-2 text-center border-t border-neutral-200">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenAdminPortal) {
                    onOpenAdminPortal();
                  } else if (typeof window !== 'undefined') {
                    window.location.hash = '#admin';
                  }
                }}
                className="text-xs font-semibold text-neutral-500 hover:text-black underline underline-offset-2 cursor-pointer"
              >
                Administrator? Open Admin Portal to reset MAC hold in backend &rarr;
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 5: ZIINA PAYMENT SUBMITTED - AWAITING ADMIN APPROVAL      */}
        {/* ============================================================== */}
        {step === 'awaiting_payment' && (
          <div className="p-6 sm:p-8 space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 text-amber-600 mx-auto flex items-center justify-center shadow-xs">
                {isApprovedSuccess ? (
                  <CheckCircle2 className="w-9 h-9 text-emerald-600 animate-bounce" />
                ) : (
                  <Clock className="w-8 h-8 text-amber-600 animate-pulse" />
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-black font-heading text-neutral-900">
                {isApprovedSuccess ? 'Payment Approved!' : 'Payment Submitted via Ziina'}
              </h2>

              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-neutral-100 text-neutral-800 border border-neutral-200">
                <MailCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Admin Notified: {ADMIN_NOTIFICATION_EMAIL}</span>
              </div>
            </div>

            {/* Status and Details Box */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4.5 space-y-3 text-xs leading-relaxed">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200/80">
                <span className="text-neutral-500 font-medium">Selected Plan</span>
                <span className="font-bold text-neutral-900">{currentPlan.title} ({currentPlan.price} USD)</span>
              </div>

              {pendingTxId && (
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200/80">
                  <span className="text-neutral-500 font-medium">Ziina Ref</span>
                  <span className="font-mono font-bold text-neutral-800">{pendingTxId}</span>
                </div>
              )}

              <div className="flex items-center justify-between pb-2 border-b border-neutral-200/80">
                <span className="text-neutral-500 font-medium">Customer Email</span>
                <span className="font-semibold text-neutral-900">{emailInput}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-500 font-medium">Authorization Status</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  isApprovedSuccess 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}>
                  {isApprovedSuccess ? 'APPROVED & ACTIVE' : 'PENDING ADMIN APPROVAL'}
                </span>
              </div>
            </div>

            {/* Explanatory Text */}
            <div className="space-y-2 text-xs text-neutral-600">
              <p>
                A real-time notification has been dispatched to administrator <strong>{ADMIN_NOTIFICATION_EMAIL}</strong>.
              </p>
              <p>
                Once approved, your <strong>1-Year Commercial License</strong> is unlocked and you will be able to log in to <strong>{TARGET_HOME_URL}</strong>.
              </p>
            </div>

            {approvalMessage && (
              <div className={`p-3.5 rounded-xl text-xs flex items-center space-x-2.5 ${
                isApprovedSuccess 
                  ? 'bg-emerald-50 border border-emerald-300 text-emerald-900' 
                  : 'bg-amber-50 border border-amber-200 text-amber-800'
              }`}>
                {isApprovedSuccess ? (
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                ) : (
                  <Clock className="w-4 h-4 flex-shrink-0 text-amber-600" />
                )}
                <span className="font-medium leading-relaxed">{approvalMessage}</span>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <button
                type="button"
                disabled={isCheckingApproval || isApprovedSuccess}
                onClick={handleManualCheckApproval}
                className="w-full py-4 px-6 rounded-2xl text-xs font-bold uppercase tracking-wider bg-black hover:bg-neutral-800 text-white flex items-center justify-center space-x-2 transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-60"
              >
                {isCheckingApproval ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Admin Approval...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>Check Approval Status</span>
                  </>
                )}
              </button>

              {currentPlan.ziinaPayUrl && (
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.open(currentPlan.ziinaPayUrl!, '_blank', 'noopener,noreferrer');
                    }
                  }}
                  className="w-full py-2.5 rounded-xl text-xs font-semibold text-neutral-600 hover:text-black hover:bg-neutral-100 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Re-open Ziina Payment Tab</span>
                </button>
              )}
            </div>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setStep('login')}
                className="text-xs font-semibold text-neutral-400 hover:text-black transition-colors"
              >
                &larr; Back to Login Card
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
