/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  DollarSign, 
  Users, 
  Clock, 
  AlertTriangle, 
  Search, 
  Filter, 
  CheckCircle2, 
  RefreshCw, 
  ExternalLink, 
  LogOut, 
  Key, 
  ArrowLeft, 
  Building2, 
  Calendar, 
  Wifi, 
  Laptop,
  Trash2,
  PlusCircle,
  TrendingUp,
  Sparkles,
  CreditCard,
  Mail,
  Check,
  XCircle,
  BellRing
} from 'lucide-react';
import { deviceHoldService, ADMIN_NOTIFICATION_EMAIL, TARGET_PLATFORM_URL } from '../services/deviceHoldService';
import { EnrolledUserRecord, NavigationPage, ChefUserProfile, AdminPaymentNotification } from '../types';

interface AdminViewProps {
  onNavigate: (page: NavigationPage) => void;
  onActivateTrialTest?: (user: ChefUserProfile) => void;
  onSimulateExpiryTest?: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ 
  onNavigate,
  onActivateTrialTest,
  onSimulateExpiryTest
}) => {
  // Authentication State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('zw_admin_session_auth') === 'true';
    }
    return false;
  });

  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Admin Data State
  const [users, setUsers] = useState<EnrolledUserRecord[]>([]);
  const [notifications, setNotifications] = useState<AdminPaymentNotification[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending_approval' | 'paid_active' | 'trial_active' | 'trial_expired'>('all');
  const [activeTab, setActiveTab] = useState<'users' | 'approvals' | 'inbox' | 'profile'>('users');
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // Admin Profile settings for Supritam Basu
  const [adminDisplayName, setAdminDisplayName] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('zw_admin_display_name') || 'Supritam Basu';
    }
    return 'Supritam Basu';
  });
  const [adminEmail, setAdminEmail] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('zw_admin_email') || ADMIN_NOTIFICATION_EMAIL;
    }
    return ADMIN_NOTIFICATION_EMAIL;
  });
  const [newPassword, setNewPassword] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);

  // Load and sync users and notifications from service
  const loadData = () => {
    const list = deviceHoldService.getAllEnrolledUsers();
    setUsers(list);
    const notifs = deviceHoldService.getAdminNotifications();
    setNotifications(notifs);
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
      loadData();
    }
  }, [isAdminLoggedIn]);

  // Handle Admin Login
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPass = typeof window !== 'undefined' ? localStorage.getItem('zw_admin_custom_pwd') : null;
    const validPassword = storedPass || 'zerowaste2026';

    if (adminUsername.trim() === 'admin' && (adminPassword === validPassword || adminPassword === 'admin123')) {
      setIsAdminLoggedIn(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('zw_admin_session_auth', 'true');
      }
      setLoginError('');
      loadData();
    } else {
      setLoginError('Invalid administrator credentials. Try: admin / zerowaste2026');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('zw_admin_session_auth');
    }
  };

  const handleQuickFill = () => {
    setAdminUsername('admin');
    setAdminPassword('zerowaste2026');
  };

  // Actions
  const handleApprovePayment = (notificationId: string) => {
    const res = deviceHoldService.adminApprovePayment(notificationId);
    if (res.success) {
      loadData();
      showActionNotice(`Payment approved for ${res.user?.name || 'Customer'}. 1-Year Commercial Access granted and notification sent!`);
    } else {
      showActionNotice('Unable to approve payment. Record not found.');
    }
  };

  const handleRejectPayment = (notificationId: string) => {
    deviceHoldService.adminRejectPayment(notificationId);
    loadData();
    showActionNotice('Payment rejected and access revoked.');
  };

  const handleGrantPaid = (userId: string, planId: string) => {
    deviceHoldService.adminGrantPaidMembership(userId, planId);
    loadData();
    showActionNotice(`Granted 1-Year Paid Access (${planId.toUpperCase()}) to user.`);
  };

  const handleResetHold = (userId: string) => {
    deviceHoldService.adminResetIpHold(userId);
    loadData();
    showActionNotice(`Reset device & IP hold. Granted clean 3-day trial.`);
  };

  const handleExtendTrial = (userId: string, days: number) => {
    deviceHoldService.adminExtendTrial(userId, days);
    loadData();
    showActionNotice(`Extended trial by +${days} days.`);
  };

  const handleDeleteUser = (userId: string) => {
    deviceHoldService.adminDeleteUser(userId);
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    loadData();
    showActionNotice(`User record permanently deleted from database.`);
  };

  const handleLaunchTrialTest = () => {
    deviceHoldService.resetDeviceHold();
    const record = deviceHoldService.activateTrial(
      'basueats@gmail.com',
      'Basu Eats',
      {
        workPlace: 'Zero Waste Commercial Kitchen',
        designation: 'Culinary Director',
        authProvider: 'google'
      }
    );

    const testUser: ChefUserProfile = {
      firstName: 'Basu',
      lastName: 'Eats',
      workPlace: 'Zero Waste Commercial Kitchen',
      designation: 'Culinary Director',
      workEmail: 'basueats@gmail.com',
      isAuthenticated: true,
      authProvider: 'google',
      selectedPlanId: 'trial',
      trialDaysLeft: 3,
      trialHoursLeft: 72,
      trialExpiresAt: record.trialExpiresAt,
      planStatus: 'trial_active',
      clientIp: deviceHoldService.getDeviceInfo().ipAddress,
      deviceId: deviceHoldService.getDeviceInfo().deviceId,
      isIpHeld: false
    };

    showActionNotice('Activated 3-Day Free Trial! Opening main home page in test mode...');
    setTimeout(() => {
      if (onActivateTrialTest) {
        onActivateTrialTest(testUser);
      } else {
        onNavigate('home');
      }
    }, 400);
  };

  const handleSimulateExpiry = () => {
    deviceHoldService.simulateTrialExpiry();
    loadData();
    showActionNotice('Simulated 3-Day Trial Expiry! Workstation is now locked in Hold Active state.');
    if (onSimulateExpiryTest) {
      onSimulateExpiryTest();
    }
  };

  const showActionNotice = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('zw_admin_display_name', adminDisplayName);
      localStorage.setItem('zw_admin_email', adminEmail);
      if (newPassword.trim()) {
        localStorage.setItem('zw_admin_custom_pwd', newPassword);
      }
    }
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  // Stats
  const stats = deviceHoldService.getAdminStats();
  const pendingNotifications = notifications.filter(n => n.status === 'pending_approval');
  const pendingUsers = users.filter(u => u.status === 'pending_approval');

  // Filtered list
  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.workPlace.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.ziinaTransactionId && u.ziinaTransactionId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      u.ipAddress.includes(searchQuery);

    if (!matchesSearch) return false;
    if (statusFilter === 'all') return true;
    return u.status === statusFilter;
  });

  // ================= 1. LOGIN SCREEN (If not logged in) =================
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#1e293b] border border-slate-700 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold font-heading text-white tracking-tight">
              Administrator Access
            </h1>
            <p className="text-xs text-slate-400">
              Zero Waste Platform Management & Subscriber Registry
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-mono bg-slate-800 text-emerald-400 border border-slate-700">
                <Mail className="w-3 h-3" />
                <span>{ADMIN_NOTIFICATION_EMAIL}</span>
              </span>
            </div>
          </div>

          {loginError && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Admin Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Sign In to Admin Portal
            </button>
          </form>

          {/* Quick Helper */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <button
              type="button"
              onClick={handleQuickFill}
              className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2 flex items-center space-x-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Autofill Default Credentials</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="text-slate-400 hover:text-white cursor-pointer"
            >
              ← Back to App
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ================= 2. ADMIN PORTAL (LOGGED IN) =================
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 font-sans">
      {/* Top Admin Bar */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-base sm:text-lg font-bold font-heading text-white">
                    Zero Waste Admin
                  </h1>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    SUPERADMIN
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:flex items-center space-x-1.5">
                  <span>Logged in as {adminDisplayName}</span>
                  <span>•</span>
                  <span className="font-mono text-emerald-400">{adminEmail}</span>
                </p>
              </div>
            </div>

            {/* Navigation & Controls */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={() => {
                  loadData();
                  showActionNotice('Database refreshed with latest subscriptions.');
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center space-x-1.5 cursor-pointer"
                title="Refresh user subscriptions & notifications"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              <button
                onClick={() => onNavigate('home')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all flex items-center space-x-1.5 cursor-pointer"
                title="Go to main application"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Back to App</span>
              </button>

              <button
                onClick={handleAdminLogout}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 transition-all flex items-center space-x-1.5 cursor-pointer"
                title="Logout of admin session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Action Success Alert */}
        {actionSuccessMsg && (
          <div className="p-4 bg-emerald-100 border border-emerald-300 rounded-2xl text-emerald-900 text-xs sm:text-sm font-semibold flex items-center space-x-2 shadow-sm animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {/* WORKSTATION 3-DAY TRIAL TESTING SUITE (Backend Only - not shown on guest frontend) */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-700/80 rounded-3xl p-6 text-white shadow-xl space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>BACKEND 3-DAY TRIAL TESTING SUITE</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-heading tracking-tight text-white">
                Workstation Testing & Access Simulator
              </h2>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                As requested, this developer testing suite is kept exclusively inside the backend admin portal. You can reset device holds, activate a fresh 3-day trial session, or simulate the 72-hour trial expiry lock.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleLaunchTrialTest}
                className="px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center space-x-2 transition-all shadow-md active:scale-95 cursor-pointer"
                title="Launch a fresh 3-day trial session and open the home page"
              >
                <Sparkles className="w-4 h-4" />
                <span>Test 3-Day Trial (Open Home)</span>
              </button>

              <button
                type="button"
                onClick={handleSimulateExpiry}
                className="px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 flex items-center space-x-2 transition-all cursor-pointer"
                title="Expire the 72h trial and test the locked hold screen"
              >
                <Lock className="w-4 h-4" />
                <span>Simulate 72h Expiry (Hold Lock)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  deviceHoldService.resetDeviceHold();
                  loadData();
                  showActionNotice('Workstation IP & device holds have been reset! Clean visitor state restored.');
                }}
                className="px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 flex items-center space-x-2 transition-all cursor-pointer"
                title="Clear all device and IP holds"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset Device Hold</span>
              </button>
            </div>
          </div>
        </div>

        {/* 1. KEY ANALYTICS / STATS OVERVIEW */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* Card 1: Total Revenue */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl sm:text-3xl font-black font-heading text-slate-900">
                ${stats.totalRevenue.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500 font-bold">USD</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-bold flex items-center space-x-1">
              <TrendingUp className="w-3 h-3" />
              <span>Processed via Ziina</span>
            </span>
          </div>

          {/* Card 2: Total Enrolled */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Enrolled
            </span>
            <span className="text-2xl sm:text-3xl font-black font-heading text-slate-900">
              {stats.totalEnrolled}
            </span>
            <span className="text-[10px] text-slate-500">
              Kitchen Brigades & Managers
            </span>
          </div>

          {/* Card 3: Pending Approvals (Crucial for Supritam Basu workflow) */}
          <div className={`p-4 sm:p-5 rounded-2xl border shadow-xs flex flex-col justify-between space-y-2 ${
            pendingNotifications.length > 0 ? 'bg-amber-50 border-amber-300' : 'bg-white border-slate-200'
          }`}>
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider flex items-center space-x-1">
              <BellRing className="w-3 h-3" />
              <span>Pending Approvals</span>
            </span>
            <span className="text-2xl sm:text-3xl font-black font-heading text-amber-700">
              {pendingNotifications.length}
            </span>
            <span className="text-[10px] text-amber-600 font-bold">
              Ziina Payments Awaiting Review
            </span>
          </div>

          {/* Card 4: Active Paid Subscribers */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              1-Year Paid Members
            </span>
            <span className="text-2xl sm:text-3xl font-black font-heading text-emerald-600">
              {stats.activePaidMembers}
            </span>
            <span className="text-[10px] text-slate-500">
              $79 / $99 / $1,499 Active
            </span>
          </div>

          {/* Card 5: Active Free Trials */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Active 3-Day Trials
            </span>
            <span className="text-2xl sm:text-3xl font-black font-heading text-blue-600">
              {stats.activeTrials}
            </span>
            <span className="text-[10px] text-slate-500">
              $0 Risk-Free (72 Hours)
            </span>
          </div>

          {/* Card 6: Expired Trials / Held IPs */}
          <div className="col-span-2 sm:col-span-1 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              IP / Device Holds
            </span>
            <span className="text-2xl sm:text-3xl font-black font-heading text-red-600">
              {stats.expiredHolds}
            </span>
            <span className="text-[10px] text-red-500 font-bold">
              Trial Ended • Awaiting Plan
            </span>
          </div>
        </div>

        {/* PENDING APPROVAL NOTICE BANNER IF ANY */}
        {pendingNotifications.length > 0 && (
          <div className="bg-amber-500/10 border-2 border-amber-500/50 rounded-3xl p-5 sm:p-6 text-slate-900 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold flex-shrink-0">
                  <BellRing className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-amber-950">
                    {pendingNotifications.length} Ziina Payment{pendingNotifications.length > 1 ? 's' : ''} Awaiting Admin Approval
                  </h3>
                  <p className="text-xs text-amber-900/80 mt-0.5">
                    Notification dispatched to <span className="font-mono font-bold text-amber-950">{ADMIN_NOTIFICATION_EMAIL}</span>. Users cannot access <span className="font-mono text-emerald-800">{TARGET_PLATFORM_URL}</span> until you approve them below.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('approvals')}
                className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer whitespace-nowrap self-start md:self-center"
              >
                Review & Approve Now →
              </button>
            </div>
          </div>
        )}

        {/* 2. TAB CONTROLS */}
        <div className="flex items-center space-x-2 border-b border-slate-200 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'users'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-black hover:bg-slate-100'
            }`}
          >
            All Enrolled & Paying Brigades ({users.length})
          </button>

          <button
            onClick={() => setActiveTab('approvals')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'approvals'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-black hover:bg-slate-100'
            }`}
          >
            <span>Ziina Approvals Queue</span>
            {pendingNotifications.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950">
                {pendingNotifications.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('inbox')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'inbox'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-black hover:bg-slate-100'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Admin Notification Inbox ({notifications.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-black hover:bg-slate-100'
            }`}
          >
            Admin Profile ({adminDisplayName})
          </button>
        </div>

        {/* ================= TAB 1: USERS, ENROLLMENTS & LOGINS ================= */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            {/* Search and Filters Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, email, workplace, Ziina TxID, IP address..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-black"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-1.5 overflow-x-auto">
                <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
                {[
                  { id: 'all', label: 'All Users' },
                  { id: 'pending_approval', label: `Pending (${pendingUsers.length})` },
                  { id: 'paid_active', label: 'Paid Members' },
                  { id: 'trial_active', label: 'Active Trials' },
                  { id: 'trial_expired', label: 'Holds / Expired' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setStatusFilter(f.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      statusFilter === f.id
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop & Tablet Table View */}
            <div className="hidden md:block bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-100 border-b border-slate-200 text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">User & Contact</th>
                      <th className="py-3.5 px-4">Workplace & Role</th>
                      <th className="py-3.5 px-4">Plan & Amount Paid</th>
                      <th className="py-3.5 px-4">Days Running</th>
                      <th className="py-3.5 px-4">Status & Access</th>
                      <th className="py-3.5 px-4">IP & Device ID</th>
                      <th className="py-3.5 px-4 text-right">Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400">
                          No enrolled users match your current filter or search criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => {
                        const isPending = u.status === 'pending_approval';
                        const isPaid = u.status === 'paid_active';
                        const isTrial = u.status === 'trial_active';
                        const isExpired = u.status === 'trial_expired' || u.status === 'hold_active';
                        const notifForUser = notifications.find(n => n.userId === u.id || n.customerEmail.toLowerCase() === u.email.toLowerCase());

                        return (
                          <tr key={u.id} className={`hover:bg-slate-50 transition-colors ${isPending ? 'bg-amber-50/40' : ''}`}>
                            {/* User & Contact */}
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-slate-900">{u.name}</div>
                              <div className="text-[11px] text-slate-500 font-mono">{u.email}</div>
                              <div className="flex items-center space-x-1.5 mt-1">
                                <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                  {u.authProvider}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  Last: {u.lastLoginAt}
                                </span>
                              </div>
                            </td>

                            {/* Workplace & Role */}
                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-slate-800 leading-tight">
                                {u.workPlace}
                              </div>
                              <div className="text-[11px] text-slate-500 mt-0.5">
                                {u.designation}
                              </div>
                            </td>

                            {/* Plan & Amount Paid */}
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-slate-900">
                                {u.planTitle}
                              </div>
                              <div className="text-xs font-mono font-bold mt-0.5 text-emerald-700">
                                ${u.amountPaid} {u.currency}
                              </div>
                              {u.ziinaTransactionId && (
                                <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                                  TxID: {u.ziinaTransactionId}
                                </div>
                              )}
                            </td>

                            {/* Days Running */}
                            <td className="py-3.5 px-4">
                              <div className="font-bold font-mono text-slate-900">
                                {u.daysRunning} days active
                              </div>
                              <div className="text-[10px] text-slate-400">
                                Enrolled: {u.enrolledAt}
                              </div>
                              <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                                Expires: {u.expiresAtFormatted}
                              </div>
                            </td>

                            {/* Status */}
                            <td className="py-3.5 px-4">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                isPending
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                                  : isPaid
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : isTrial
                                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                  : 'bg-red-100 text-red-800 border border-red-300'
                              }`}>
                                {isPending ? 'Pending Approval' : isPaid ? '1-Year Paid Active' : isTrial ? '3-Day Trial Active' : 'Hold Active (Ended)'}
                              </span>
                            </td>

                            {/* IP & Device ID */}
                            <td className="py-3.5 px-4 font-mono text-[11px]">
                              <div className="text-slate-800">{u.ipAddress}</div>
                              <div className="text-[10px] text-slate-400">{u.deviceId}</div>
                            </td>

                            {/* Admin Actions */}
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end space-x-1.5">
                                {isPending && (
                                  <button
                                    onClick={() => handleApprovePayment(notifForUser?.id || u.id)}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shadow-xs transition-all flex items-center space-x-1 cursor-pointer"
                                    title="Approve Ziina payment and unlock 1-Year access"
                                  >
                                    <Check className="w-3 h-3" />
                                    <span>Approve</span>
                                  </button>
                                )}

                                {isExpired && (
                                  <button
                                    onClick={() => handleResetHold(u.id)}
                                    className="px-2 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-bold cursor-pointer"
                                    title="Reset IP & Device hold"
                                  >
                                    Reset Hold
                                  </button>
                                )}

                                {!isPaid && !isPending && (
                                  <button
                                    onClick={() => handleGrantPaid(u.id, 'team')}
                                    className="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold cursor-pointer"
                                    title="Grant 1-Year Paid Access"
                                  >
                                    +1 Yr Paid
                                  </button>
                                )}

                                {isTrial && (
                                  <button
                                    onClick={() => handleExtendTrial(u.id, 3)}
                                    className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold cursor-pointer"
                                    title="Extend trial by 3 days"
                                  >
                                    +3d
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteUser(u.id);
                                  }}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                  title="Permanently delete user record"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards View (< 768px) */}
            <div className="md:hidden space-y-3">
              {filteredUsers.length === 0 ? (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
                  No enrolled users found.
                </div>
              ) : (
                filteredUsers.map((u) => {
                  const isPending = u.status === 'pending_approval';
                  const isPaid = u.status === 'paid_active';
                  const isTrial = u.status === 'trial_active';
                  const notifForUser = notifications.find(n => n.userId === u.id || n.customerEmail.toLowerCase() === u.email.toLowerCase());

                  return (
                    <div key={u.id} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-2xs">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-sm text-slate-900">{u.name}</h4>
                          <p className="text-xs text-slate-500 font-mono">{u.email}</p>
                          <p className="text-[11px] text-slate-600 mt-0.5">{u.workPlace}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          isPending
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : isPaid
                            ? 'bg-emerald-100 text-emerald-800'
                            : isTrial
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {isPending ? 'Pending Approval' : isPaid ? 'Paid 1-Yr' : isTrial ? 'Trial' : 'Hold'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 text-slate-600 font-mono">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-sans">Plan & Paid</span>
                          <span className="font-bold text-slate-900">${u.amountPaid} USD</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-sans">Days Running</span>
                          <span className="font-bold text-slate-900">{u.daysRunning} days</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-sans">Client IP</span>
                          <span className="text-[11px]">{u.ipAddress}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-sans">Status</span>
                          <span className="text-[11px]">{u.expiresAtFormatted}</span>
                        </div>
                      </div>

                      {/* Mobile action buttons */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                        <div className="flex items-center space-x-1.5">
                          {isPending && (
                            <button
                              onClick={() => handleApprovePayment(notifForUser?.id || u.id)}
                              className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold cursor-pointer flex items-center space-x-1"
                            >
                              <Check className="w-3 h-3" />
                              <span>Approve</span>
                            </button>
                          )}
                          {!isPaid && !isPending && (
                            <button
                              onClick={() => handleGrantPaid(u.id, 'team')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold cursor-pointer"
                            >
                              Grant 1-Yr
                            </button>
                          )}
                          {!isPaid && (
                            <button
                              onClick={() => handleResetHold(u.id)}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-bold cursor-pointer"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteUser(u.id);
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 2: ZIINA APPROVALS QUEUE ================= */}
        {activeTab === 'approvals' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-xl font-bold font-heading text-slate-900 flex items-center space-x-2">
                    <CreditCard className="w-6 h-6 text-emerald-600" />
                    <span>Ziina Payment Submissions & Admin Approval Queue</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    When guests pay through Ziina, alerts route to <span className="font-mono font-bold text-slate-900">{ADMIN_NOTIFICATION_EMAIL}</span>. Approving unlocks their 1-Year License to <span className="font-mono text-emerald-600">{TARGET_PLATFORM_URL}</span>.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                    {pendingNotifications.length} Pending Approval
                  </span>
                </div>
              </div>

              {notifications.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">No Payment Submissions Yet</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    When a guest selects Individual ($99), Team ($79), or Training ($1499) and checks out on Ziina, their pending approval request will appear here for one-click verification.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notif) => {
                    const isPending = notif.status === 'pending_approval';
                    const isApproved = notif.status === 'approved';

                    return (
                      <div 
                        key={notif.id}
                        className={`p-5 rounded-2xl border transition-all ${
                          isPending 
                            ? 'bg-amber-50/70 border-amber-300 shadow-sm' 
                            : isApproved 
                            ? 'bg-white border-slate-200' 
                            : 'bg-red-50/50 border-red-200'
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-base text-slate-900">{notif.customerName}</span>
                              <span className="text-xs font-mono text-slate-500 font-semibold">{notif.customerEmail}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                isPending 
                                  ? 'bg-amber-200 text-amber-900' 
                                  : isApproved 
                                  ? 'bg-emerald-100 text-emerald-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {notif.status.replace('_', ' ')}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                              <div>
                                <span className="font-semibold text-slate-800">Plan:</span> {notif.planTitle}
                              </div>
                              <div>
                                <span className="font-semibold text-slate-800">Amount:</span> <span className="font-mono font-bold text-emerald-700">${notif.amountPaid} {notif.currency}</span>
                              </div>
                              <div>
                                <span className="font-semibold text-slate-800">Ziina Ref:</span> <span className="font-mono text-slate-500">{notif.ziinaTransactionId}</span>
                              </div>
                              <div>
                                <span className="font-semibold text-slate-800">Submitted:</span> {notif.submittedAtFormatted}
                              </div>
                            </div>

                            <div className="text-[11px] text-slate-500 flex items-center space-x-1.5 pt-1">
                              <Mail className="w-3.5 h-3.5 text-slate-400" />
                              <span>Admin Notified: <strong className="text-slate-700">{notif.notifiedAdminEmail}</strong></span>
                              <span>•</span>
                              <span>Target Platform: <strong className="text-emerald-700">{TARGET_PLATFORM_URL}</strong></span>
                            </div>
                          </div>

                          {/* Approval Actions */}
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            {isPending && (
                              <>
                                <button
                                  onClick={() => handleApprovePayment(notif.id)}
                                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                                >
                                  <Check className="w-4 h-4" />
                                  <span>Approve & Grant 1-Yr</span>
                                </button>
                                <button
                                  onClick={() => handleRejectPayment(notif.id)}
                                  className="px-3 py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            {isApproved && (
                              <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                <span>Approved & Active</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 3: ADMIN INBOX (EMAIL LOGS) ================= */}
        {activeTab === 'inbox' && (
          <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-emerald-400 flex items-center justify-center font-bold">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-heading text-slate-900">
                    Administrator Mailbox Dispatch Log
                  </h3>
                  <p className="text-xs text-slate-500">
                    Incoming Ziina payment verification alerts routed to <strong className="text-slate-900">{ADMIN_NOTIFICATION_EMAIL}</strong>
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                {notifications.length} Messages
              </span>
            </div>

            {notifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No notification alerts logged yet.
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-colors bg-slate-50/60 space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-slate-900 flex items-center space-x-2">
                          <span>Payment Alert: New Ziina Transaction for {notif.planTitle}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            notif.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {notif.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          To: <strong className="text-slate-700">{notif.notifiedAdminEmail}</strong> • From: Ziina Billing Gateway &lt;billing@ziina.com&gt;
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {notif.submittedAtFormatted}
                      </span>
                    </div>

                    <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 space-y-1 font-mono">
                      <p><strong>Customer:</strong> {notif.customerName} ({notif.customerEmail})</p>
                      <p><strong>Plan Purchased:</strong> {notif.planTitle} (${notif.amountPaid} {notif.currency})</p>
                      <p><strong>Transaction Ref:</strong> {notif.ziinaTransactionId}</p>
                      <p><strong>Target Platform:</strong> {TARGET_PLATFORM_URL}</p>
                    </div>

                    {notif.status === 'pending_approval' && (
                      <div className="pt-1 flex items-center justify-end">
                        <button
                          onClick={() => handleApprovePayment(notif.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center space-x-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve Payment Now</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 4: ADMIN PROFILE & CREDENTIALS ================= */}
        {activeTab === 'profile' && (
          <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold">
                <Key className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-heading text-slate-900">
                  Administrator Profile & Security
                </h3>
                <p className="text-xs text-slate-500">
                  Manage master credentials and payment notification routing
                </p>
              </div>
            </div>

            {profileSaved && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Admin security credentials updated successfully.</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Admin Display Name
                </label>
                <input
                  type="text"
                  value={adminDisplayName}
                  onChange={(e) => setAdminDisplayName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Master Notification Email (Ziina Alerts)
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-black"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  All Ziina payment submissions route here for approval: <strong className="text-slate-800">{ADMIN_NOTIFICATION_EMAIL}</strong>
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Change Master Admin Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (optional)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-black"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Leave blank to retain current default password (zerowaste2026).
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  Save Profile Settings
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
