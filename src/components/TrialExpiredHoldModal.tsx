/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Lock, 
  ShieldAlert, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles, 
  ArrowRight,
  RefreshCw,
  Clock,
  Wifi,
  Laptop
} from 'lucide-react';
import { deviceHoldService } from '../services/deviceHoldService';
import { PRICING_PLANS } from '../data/mockData';
import { ChefUserProfile } from '../types';

interface TrialExpiredHoldModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onMembershipActivated: (updatedUser: ChefUserProfile) => void;
  currentUser: ChefUserProfile | null;
  onRedirectHome?: () => void;
}

export const TrialExpiredHoldModal: React.FC<TrialExpiredHoldModalProps> = ({
  isOpen,
  onClose,
  onMembershipActivated,
  currentUser,
  onRedirectHome
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>('team');
  const [ziinaWindowOpened, setZiinaWindowOpened] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const isDevEnvironment = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' ||
    window.location.hostname.includes('ais-dev') ||
    window.location.hostname.includes('ais-pre') ||
    window.location.hostname.includes('127.0.0.1') ||
    window.location.hostname.includes('run.app') ||
    window.location.port === '3000'
  );

  const deviceInfo = deviceHoldService.getDeviceInfo();
  const paidPlans = PRICING_PLANS.filter(p => !p.isTrial);
  const currentPlan = paidPlans.find(p => p.id === selectedPlanId) || paidPlans[0];

  const handleOpenZiina = (url: string) => {
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
      setZiinaWindowOpened(true);
    }
  };

  const handleConfirmZiinaPayment = () => {
    setIsVerifying(true);
    setTimeout(() => {
      const email = currentUser?.workEmail || 'member@kitchen.org';
      const name = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Culinary Director';
      
      const record = deviceHoldService.activatePaidMembership(
        selectedPlanId,
        email,
        name
      );

      const updatedUser: ChefUserProfile = {
        firstName: currentUser?.firstName || 'Executive',
        lastName: currentUser?.lastName || 'Chef',
        workPlace: currentUser?.workPlace || 'Commercial Culinary Operation',
        designation: currentUser?.designation || 'Head Chef',
        workEmail: email,
        isAuthenticated: true,
        selectedPlanId,
        planStatus: selectedPlanId === 'team' ? 'team_active' : (
          selectedPlanId === 'training' ? 'training_active' : 'pro_active'
        ),
        membershipExpiresAt: record.membershipExpiresAt,
        isIpHeld: false,
        clientIp: deviceInfo.ipAddress,
        deviceId: deviceInfo.deviceId
      };

      setIsVerifying(false);
      onMembershipActivated(updatedUser);
      if (onRedirectHome) {
        onRedirectHome();
      }
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div 
        className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-neutral-300 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Warning Banner */}
        <div className="bg-red-600 text-white p-6 sm:p-7 relative">
          {/* Close Control */}
          <div className="absolute top-4 right-4">
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-black/20 transition-all cursor-pointer"
                aria-label="Close"
              >
                <span className="text-lg font-bold leading-none">&times;</span>
              </button>
            )}
          </div>
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 text-white">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/30 text-white">
                <Lock className="w-3 h-3" />
                <span>DEVICE & NETWORK IP HOLD ENFORCED</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-heading tracking-tight text-white">
                Your 3-Day Free Trial Has Ended
              </h2>
              <p className="text-xs sm:text-sm text-red-100 leading-relaxed max-w-xl">
                The 72-hour trial period has concluded for this workstation. Access without a subscription is now on hold. To continue using the Zero Waste Kitchen platform, please choose 1 membership option below.
              </p>
            </div>
          </div>

          {/* Network & Device Hold Metadata */}
          <div className="mt-4 pt-3 border-t border-white/20 grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-mono text-red-100">
            <div className="flex items-center space-x-1.5 bg-black/20 px-2.5 py-1.5 rounded-lg">
              <Wifi className="w-3.5 h-3.5 text-white flex-shrink-0" />
              <span className="truncate">Network IP: {deviceInfo.ipAddress}</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-black/20 px-2.5 py-1.5 rounded-lg">
              <Laptop className="w-3.5 h-3.5 text-white flex-shrink-0" />
              <span className="truncate">Hardware: {deviceInfo.macHash}</span>
            </div>
            <div className="col-span-2 sm:col-span-1 flex items-center space-x-1.5 bg-black/20 px-2.5 py-1.5 rounded-lg">
              <Lock className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
              <span className="text-amber-200 font-bold">Status: Hold Active</span>
            </div>
          </div>
        </div>

        {/* Modal Body: Choose 1 Membership Option */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[72vh] overflow-y-auto">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base sm:text-lg font-bold font-heading text-neutral-900">
              Choose 1 Option to Unlock 1-Year Commercial Brigade Access
            </h3>
            <p className="text-xs text-neutral-500">
              Secure checkout via Ziina Payment Gateway. Instant account activation upon completion.
            </p>
          </div>

          {/* 3 Paid Membership Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {paidPlans.map((plan) => {
              const isSelected = selectedPlanId === plan.id;
              const isTeam = plan.id === 'team';

              return (
                <div
                  key={plan.id}
                  onClick={() => {
                    setSelectedPlanId(plan.id);
                    setZiinaWindowOpened(false);
                  }}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between relative space-y-4 ${
                    isSelected
                      ? 'border-black bg-neutral-50 ring-2 ring-black shadow-md'
                      : 'border-neutral-200 bg-white hover:border-neutral-400'
                  }`}
                >
                  {plan.badge && (
                    <span className={`absolute -top-2.5 right-4 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      isTeam ? 'bg-black text-white' : 'bg-neutral-800 text-neutral-200'
                    }`}>
                      {plan.badge}
                    </span>
                  )}

                  <div className="space-y-2">
                    <div>
                      <h4 className="font-bold text-base text-neutral-900 font-heading">{plan.title}</h4>
                      <p className="text-[11px] text-neutral-500">{plan.cadence}</p>
                    </div>

                    <div className="space-y-0.5 pt-1">
                      <div className="flex items-baseline space-x-1">
                        <span className="text-3xl font-black font-heading text-black">{plan.price}</span>
                        <span className="text-xs font-bold text-neutral-500">USD</span>
                      </div>
                      <span className="text-[10px] text-emerald-700 font-bold block">
                        Full 1-Year Access
                      </span>
                    </div>

                    <ul className="space-y-1.5 text-xs text-neutral-600 pt-2 border-t border-neutral-100">
                      {plan.features.slice(0, 4).map((f, i) => (
                        <li key={i} className="flex items-start space-x-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-neutral-900 mt-0.5 flex-shrink-0" />
                          <span className="text-[11px] leading-tight">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPlanId(plan.id);
                        if (plan.ziinaPayUrl) {
                          handleOpenZiina(plan.ziinaPayUrl);
                        }
                      }}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5 ${
                        isSelected
                          ? 'bg-black text-white hover:bg-neutral-800'
                          : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                      }`}
                    >
                      <span>Pay {plan.price} USD</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Plan Ziina Checkout Panel */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Selected Subscription
                </span>
                <p className="text-sm font-bold text-neutral-900">
                  {currentPlan.title} Membership • {currentPlan.price} USD for 1 Year
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-neutral-700 bg-white px-2.5 py-1 rounded-lg border border-neutral-200 self-start sm:self-auto">
                Ziina Secure Gateway
              </span>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-neutral-600 leading-relaxed">
                Click below to open the secure payment link on Ziina. Once paid, return to this tab to immediately release the device hold and activate your <strong>1-Year Commercial Brigade License</strong>.
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (currentPlan.ziinaPayUrl) {
                      handleOpenZiina(currentPlan.ziinaPayUrl);
                    }
                    handleConfirmZiinaPayment();
                  }}
                  disabled={isVerifying}
                  className="w-full py-4 px-6 rounded-2xl text-xs font-bold uppercase tracking-wider bg-black hover:bg-neutral-800 text-white flex items-center justify-center space-x-2 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Opening Ziina & Activating 1-Year Access...</span>
                    </>
                  ) : (
                    <>
                      <span>Pay {currentPlan.price} USD on Ziina & Unlock 1-Year Access</span>
                      <ExternalLink className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
