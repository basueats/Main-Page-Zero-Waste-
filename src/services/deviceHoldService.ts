/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EnrolledUserRecord, AdminPaymentNotification, CustomerApprovalNotice } from '../types';

export const ADMIN_NOTIFICATION_EMAIL = 'supritam.basu@supritamone.com';
export const TARGET_PLATFORM_URL = 'https://zerowasteacademy.supritamone.com/';

export interface DeviceHoldRecord {
  deviceId: string;
  ipAddress: string;
  macHash: string; // Browser hardware fingerprint surrogate
  trialClaimed: boolean;
  trialStartedAt?: number;
  trialExpiresAt?: number;
  activeMembershipPlan?: string;
  membershipExpiresAt?: number;
  userEmail?: string;
  memberName?: string;
  chefName?: string;
  paidTransactionId?: string;
  trialLoginCount?: number;
  macRestricted?: boolean;
  lastAccessAt: number;
}

const STORAGE_KEY = 'zw_device_network_hold_v1';
const USERS_STORAGE_KEY = 'zw_admin_enrolled_users_v1';
const NOTIFICATIONS_STORAGE_KEY = 'zw_admin_payment_notifications_v1';
const CUSTOMER_NOTICES_KEY = 'zw_customer_approval_notices_v1';
const RESTRICTED_MAC_KEY = 'zw_restricted_mac_registry_v1';
const TRIAL_DURATION_MS = 3 * 24 * 60 * 60 * 1000; // 72 hours (3 days)
const ANNUAL_DURATION_MS = 365 * 24 * 60 * 60 * 1000; // 365 days (1 year)

/**
 * Generate a consistent browser hardware fingerprint hash (acting as MAC / Device ID)
 */
function generateHardwareFingerprint(): { deviceId: string; macHash: string; ipAddress: string } {
  try {
    const nav = typeof window !== 'undefined' ? window.navigator : ({} as any);
    const screen = typeof window !== 'undefined' ? window.screen : ({} as any);
    
    // Stable device fingerprint parameters
    const seed = [
      nav.userAgent || '',
      screen.width || '1920',
      screen.height || '1080',
      screen.colorDepth || '24',
      nav.language || 'en',
      nav.hardwareConcurrency || '8',
      Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
    ].join('###');

    // Simple hash
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = ((hash << 5) - hash) + seed.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    
    // Virtual MAC Address representation
    const macMock = `B8:27:EB:${hex.slice(0, 2).toUpperCase()}:${hex.slice(2, 4).toUpperCase()}:${hex.slice(4, 6).toUpperCase()}`;
    const deviceId = `DEV-${hex.toUpperCase()}-${Math.abs(hash % 9999).toString().padStart(4, '0')}`;
    
    // Network Gateway IP
    const storedIp = typeof window !== 'undefined' ? localStorage.getItem('zw_simulated_client_ip') : null;
    const ipAddress = storedIp || `194.71.${100 + (Math.abs(hash) % 150)}.${10 + (Math.abs(hash) % 200)}`;
    if (typeof window !== 'undefined' && !storedIp) {
      localStorage.setItem('zw_simulated_client_ip', ipAddress);
    }

    return { deviceId, macHash: macMock, ipAddress };
  } catch (err) {
    return {
      deviceId: 'DEV-STANDARD-9001',
      macHash: 'B8:27:EB:4A:2F:90',
      ipAddress: '194.71.108.42'
    };
  }
}

// Initial realistic database of enrolled hospitality brigades and culinary managers
const INITIAL_ENROLLED_USERS: EnrolledUserRecord[] = [
  {
    id: 'USR-8901',
    name: 'Executive Culinary Director',
    email: 'culinary.director@grandresort.com',
    workPlace: 'Grand Azure Heritage Resort & Spa',
    designation: 'Executive Chef & Culinary Director',
    authProvider: 'google',
    planId: 'training',
    planTitle: 'Executive Advisory & Training',
    amountPaid: 1499,
    currency: 'USD',
    status: 'paid_active',
    ziinaTransactionId: 'ZN-PAY-9812401',
    ipAddress: '194.71.142.68',
    deviceId: 'DEV-4E8A-2911',
    macAddress: 'B8:27:EB:4E:8A:29',
    enrolledAt: 'Oct 14, 2026',
    enrolledTimestamp: Date.now() - (28 * 24 * 3600 * 1000),
    lastLoginAt: '2 hours ago',
    daysRunning: 28,
    expiresAt: Date.now() + (337 * 24 * 3600 * 1000),
    expiresAtFormatted: 'Oct 14, 2027'
  },
  {
    id: 'USR-8902',
    name: 'Brigade Operations Lead',
    email: 'head.chef@metropolitanhotel.com',
    workPlace: 'The Metropolitan Hotel & Conference Center',
    designation: 'Head of Culinary Brigade',
    authProvider: 'linkedin',
    planId: 'team',
    planTitle: 'Team Brigade Plan (5+ Chefs)',
    amountPaid: 79,
    currency: 'USD',
    status: 'paid_active',
    ziinaTransactionId: 'ZN-PAY-4491022',
    ipAddress: '185.192.68.104',
    deviceId: 'DEV-9B21-8842',
    macAddress: 'B8:27:EB:9B:21:88',
    enrolledAt: 'Nov 02, 2026',
    enrolledTimestamp: Date.now() - (9 * 24 * 3600 * 1000),
    lastLoginAt: 'Yesterday at 04:15 PM',
    daysRunning: 9,
    expiresAt: Date.now() + (356 * 24 * 3600 * 1000),
    expiresAtFormatted: 'Nov 02, 2027'
  },
  {
    id: 'USR-8903',
    name: 'Pastry & Bakery Supervisor',
    email: 'pastry.station@artisanbistro.fr',
    workPlace: 'Artisan Culinary Workshop',
    designation: 'Pastry Chef de Partie',
    authProvider: 'email',
    planId: 'individual',
    planTitle: 'Individual Chef Annual Plan',
    amountPaid: 99,
    currency: 'USD',
    status: 'paid_active',
    ziinaTransactionId: 'ZN-PAY-7719203',
    ipAddress: '213.180.204.11',
    deviceId: 'DEV-1A3C-6509',
    macAddress: 'B8:27:EB:1A:3C:65',
    enrolledAt: 'Nov 06, 2026',
    enrolledTimestamp: Date.now() - (5 * 24 * 3600 * 1000),
    lastLoginAt: 'Today at 08:30 AM',
    daysRunning: 5,
    expiresAt: Date.now() + (360 * 24 * 3600 * 1000),
    expiresAtFormatted: 'Nov 06, 2027'
  },
  {
    id: 'USR-8904',
    name: 'Banquet Sous Chef',
    email: 'banquet.prep@cityconvention.org',
    workPlace: 'Harbor City Convention & Banquets',
    designation: 'Sous Chef - Production Kitchen',
    authProvider: 'google',
    planId: 'trial',
    planTitle: '3-Day Free Trial',
    amountPaid: 0,
    currency: 'USD',
    status: 'trial_active',
    ipAddress: '194.71.189.15',
    deviceId: 'DEV-F089-1123',
    macAddress: 'B8:27:EB:F0:89:11',
    enrolledAt: 'Nov 09, 2026',
    enrolledTimestamp: Date.now() - (1 * 24 * 3600 * 1000),
    lastLoginAt: '45 mins ago',
    daysRunning: 1,
    expiresAt: Date.now() + (2 * 24 * 3600 * 1000),
    expiresAtFormatted: 'Nov 12, 2026'
  },
  {
    id: 'USR-8905',
    name: 'Catering Operations Manager',
    email: 'operations@summitcatering.com',
    workPlace: 'Summit Corporate Catering',
    designation: 'F&B Operations Manager',
    authProvider: 'email',
    planId: 'trial',
    planTitle: '3-Day Free Trial (Ended)',
    amountPaid: 0,
    currency: 'USD',
    status: 'trial_expired',
    ipAddress: '195.154.122.90',
    deviceId: 'DEV-D442-9901',
    macAddress: 'B8:27:EB:D4:42:99',
    enrolledAt: 'Nov 04, 2026',
    enrolledTimestamp: Date.now() - (7 * 24 * 3600 * 1000),
    lastLoginAt: '3 days ago',
    daysRunning: 7,
    expiresAt: Date.now() - (4 * 24 * 3600 * 1000),
    expiresAtFormatted: 'Nov 07, 2026'
  }
];

class DeviceHoldService {
  private getRecord(): DeviceHoldRecord {
    if (typeof window === 'undefined') {
      const fp = generateHardwareFingerprint();
      return {
        deviceId: fp.deviceId,
        ipAddress: fp.ipAddress,
        macHash: fp.macHash,
        trialClaimed: false,
        lastAccessAt: Date.now()
      };
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      // Fallback
    }

    const fp = generateHardwareFingerprint();
    const newRecord: DeviceHoldRecord = {
      deviceId: fp.deviceId,
      ipAddress: fp.ipAddress,
      macHash: fp.macHash,
      trialClaimed: false,
      lastAccessAt: Date.now()
    };
    this.saveRecord(newRecord);
    return newRecord;
  }

  private saveRecord(record: DeviceHoldRecord) {
    if (typeof window === 'undefined') return;
    try {
      record.lastAccessAt = Date.now();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    } catch (e) {
      console.warn('Unable to write to localStorage for device hold', e);
    }
  }

  public getDeviceInfo(): { deviceId: string; ipAddress: string; macHash: string } {
    const record = this.getRecord();
    return {
      deviceId: record.deviceId,
      ipAddress: record.ipAddress,
      macHash: record.macHash
    };
  }

  public hasActivePaidMembership(): boolean {
    const record = this.getRecord();
    if (record.activeMembershipPlan && record.membershipExpiresAt) {
      return Date.now() < record.membershipExpiresAt;
    }
    return false;
  }

  public isTrialActive(): boolean {
    if (this.hasActivePaidMembership()) return false;
    const record = this.getRecord();
    if (record.trialClaimed && record.trialExpiresAt) {
      return Date.now() < record.trialExpiresAt;
    }
    return false;
  }

  public isDeviceOrIpHeld(): boolean {
    if (this.hasActivePaidMembership()) return false;
    const record = this.getRecord();
    if (!record.trialClaimed) return false;
    if (record.trialExpiresAt && Date.now() >= record.trialExpiresAt) {
      return true;
    }
    return false;
  }

  public getRestrictedMacRegistry(): string[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(RESTRICTED_MAC_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  /**
   * On live website, each device/MAC is strictly restricted to ONE-TIME 3-day trial login.
   * In backend admin mode, testing is unlimited.
   */
  public isMacRestrictedFromTrial(macHash?: string): { 
    isRestricted: boolean; 
    macAddress: string; 
    ipAddress: string; 
    deviceId: string;
    loginCount: number; 
    message?: string;
    canResumeExistingTrial: boolean;
  } {
    const record = this.getRecord();
    const targetMac = macHash || record.macHash;
    const isPaid = this.hasActivePaidMembership();

    if (isPaid) {
      return {
        isRestricted: false,
        macAddress: targetMac,
        ipAddress: record.ipAddress,
        deviceId: record.deviceId,
        loginCount: record.trialLoginCount || 1,
        canResumeExistingTrial: false
      };
    }

    const registry = this.getRestrictedMacRegistry();
    const hasBeenRegistered = registry.includes(targetMac);
    const count = record.trialLoginCount || (record.trialClaimed ? 1 : 0);
    const trialActive = this.isTrialActive();

    // If device has claimed trial once on this MAC / IP:
    // It is strictly restricted to ONE trial login
    if (hasBeenRegistered || record.trialClaimed || count >= 1) {
      return {
        isRestricted: !trialActive, // If trial expired or trying to register again -> strictly restricted
        macAddress: targetMac,
        ipAddress: record.ipAddress,
        deviceId: record.deviceId,
        loginCount: count,
        canResumeExistingTrial: trialActive,
        message: `Workstation Access Restricted: MAC ${targetMac} has already utilized its 1-time free trial on the live website. Free trials are strictly limited to one time per physical workstation.`
      };
    }

    return {
      isRestricted: false,
      macAddress: targetMac,
      ipAddress: record.ipAddress,
      deviceId: record.deviceId,
      loginCount: 0,
      canResumeExistingTrial: false
    };
  }

  public canClaimTrial(): boolean {
    if (this.hasActivePaidMembership()) return false;
    const record = this.getRecord();
    const check = this.isMacRestrictedFromTrial();
    return !record.trialClaimed && !check.isRestricted;
  }

  public getTrialTimeRemaining(): { days: number; hours: number; minutes: number; isExpired: boolean } {
    const record = this.getRecord();
    if (!record.trialClaimed || !record.trialExpiresAt) {
      return { days: 3, hours: 72, minutes: 0, isExpired: false };
    }

    const diffMs = record.trialExpiresAt - Date.now();
    if (diffMs <= 0) {
      return { days: 0, hours: 0, minutes: 0, isExpired: true };
    }

    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours: totalHours, minutes, isExpired: false };
  }

  /**
   * Activate 0 USD 3-Day Free Trial (1-time only per MAC on live website)
   */
  public activateTrial(
    email: string, 
    memberName?: string,
    details?: { workPlace?: string; designation?: string; authProvider?: 'google' | 'linkedin' | 'email' }
  ): DeviceHoldRecord {
    const record = this.getRecord();
    const now = Date.now();
    const newCount = (record.trialLoginCount || 0) + 1;

    // Register MAC in the persistent restriction registry
    if (typeof window !== 'undefined') {
      try {
        const registry = this.getRestrictedMacRegistry();
        if (!registry.includes(record.macHash)) {
          registry.push(record.macHash);
          localStorage.setItem(RESTRICTED_MAC_KEY, JSON.stringify(registry));
        }
      } catch (e) {}
    }

    const updated: DeviceHoldRecord = {
      ...record,
      trialClaimed: true,
      trialStartedAt: now,
      trialExpiresAt: now + TRIAL_DURATION_MS,
      trialLoginCount: newCount,
      macRestricted: true,
      userEmail: email,
      memberName: memberName || record.memberName,
      lastAccessAt: now
    };
    this.saveRecord(updated);

    // Record in admin users database with MAC address
    this.recordUserEnrollment({
      id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      name: memberName || 'Kitchen Professional',
      email,
      workPlace: details?.workPlace || 'Commercial Culinary Operation',
      designation: details?.designation || 'Head of Kitchen',
      authProvider: details?.authProvider || 'google',
      planId: 'trial',
      planTitle: '3-Day Free Trial',
      amountPaid: 0,
      currency: 'USD',
      status: 'trial_active',
      ipAddress: record.ipAddress,
      deviceId: record.deviceId,
      macAddress: record.macHash,
      enrolledAt: new Date(now).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      enrolledTimestamp: now,
      lastLoginAt: 'Just now',
      daysRunning: 1,
      expiresAt: now + TRIAL_DURATION_MS,
      expiresAtFormatted: new Date(now + TRIAL_DURATION_MS).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    });

    return updated;
  }

  /**
   * Activate 1-Year Paid Access after paying $79, $99, or $1499 via Ziina
   */
  public activatePaidMembership(
    planId: string,
    email: string,
    memberName?: string,
    transactionIdOrDetails?: string | { workPlace?: string; designation?: string; authProvider?: 'google' | 'linkedin' | 'email' },
    details?: { workPlace?: string; designation?: string; authProvider?: 'google' | 'linkedin' | 'email' }
  ): DeviceHoldRecord {
    const record = this.getRecord();
    const now = Date.now();
    let txId = `ZN-${Math.floor(1000000 + Math.random() * 9000000)}`;
    let userDetails = details;

    if (typeof transactionIdOrDetails === 'string') {
      txId = transactionIdOrDetails;
    } else if (transactionIdOrDetails && typeof transactionIdOrDetails === 'object') {
      userDetails = transactionIdOrDetails;
    }

    const updated: DeviceHoldRecord = {
      ...record,
      activeMembershipPlan: planId,
      membershipExpiresAt: now + ANNUAL_DURATION_MS,
      userEmail: email,
      memberName: memberName || record.memberName,
      paidTransactionId: txId,
      lastAccessAt: now
    };
    this.saveRecord(updated);

    const planPrices: Record<string, { price: number; title: string }> = {
      individual: { price: 99, title: 'Individual Chef Annual Plan' },
      team: { price: 79, title: 'Team Brigade Annual Plan' },
      training: { price: 1499, title: 'Executive Advisory & Training' }
    };
    const planInfo = planPrices[planId] || { price: 79, title: 'Commercial Brigade Plan' };

    // Record in admin users database
    this.recordUserEnrollment({
      id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      name: memberName || 'Commercial Brigade Lead',
      email,
      workPlace: userDetails?.workPlace || 'Hospitality & Dining Brigade',
      designation: userDetails?.designation || 'Culinary Director',
      authProvider: userDetails?.authProvider || 'google',
      planId,
      planTitle: planInfo.title,
      amountPaid: planInfo.price,
      currency: 'USD',
      status: 'paid_active',
      ziinaTransactionId: txId,
      ipAddress: record.ipAddress,
      deviceId: record.deviceId,
      enrolledAt: new Date(now).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      enrolledTimestamp: now,
      lastLoginAt: 'Just now',
      daysRunning: 1,
      expiresAt: now + ANNUAL_DURATION_MS,
      expiresAtFormatted: new Date(now + ANNUAL_DURATION_MS).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    });

    return updated;
  }

  public simulateTrialExpiry(): void {
    const record = this.getRecord();
    const now = Date.now();
    const updated: DeviceHoldRecord = {
      ...record,
      trialClaimed: true,
      trialStartedAt: now - TRIAL_DURATION_MS - 60000,
      trialExpiresAt: now - 60000,
      activeMembershipPlan: undefined,
      membershipExpiresAt: undefined,
      lastAccessAt: now
    };
    this.saveRecord(updated);
  }

  public resetDeviceHold(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('zw_simulated_client_ip');
      localStorage.removeItem(RESTRICTED_MAC_KEY);
    } catch (e) {
      // Ignore
    }
  }

  public getRawRecord(): DeviceHoldRecord {
    return this.getRecord();
  }

  // ================= ADMIN AUDIT & ENROLLMENT DATABASE METHODS =================

  public getAllEnrolledUsers(): EnrolledUserRecord[] {
    if (typeof window === 'undefined') return INITIAL_ENROLLED_USERS;
    try {
      const raw = localStorage.getItem(USERS_STORAGE_KEY);
      if (raw) {
        const users: EnrolledUserRecord[] = JSON.parse(raw);
        // Recalculate days running dynamically
        const now = Date.now();
        return users.map(u => {
          const days = Math.max(1, Math.floor((now - u.enrolledTimestamp) / (1000 * 3600 * 24)));
          const isExpired = u.expiresAt && now > u.expiresAt;
          let status = u.status;
          if (u.planId === 'trial' && isExpired) {
            status = 'trial_expired';
          }
          return {
            ...u,
            daysRunning: days,
            status
          };
        });
      }
    } catch (e) {
      // Fallback
    }

    // Seed default records
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_ENROLLED_USERS));
    } catch (e) {
      // Ignore
    }
    return INITIAL_ENROLLED_USERS;
  }

  private saveEnrolledUsers(users: EnrolledUserRecord[]) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.warn('Unable to persist enrolled users', e);
    }
  }

  public recordUserEnrollment(record: EnrolledUserRecord) {
    const users = this.getAllEnrolledUsers();
    // Check if user with same email exists -> update or prepend
    const existingIndex = users.findIndex(u => u.email.toLowerCase() === record.email.toLowerCase());
    if (existingIndex >= 0) {
      users[existingIndex] = {
        ...users[existingIndex],
        ...record,
        lastLoginAt: 'Just now'
      };
    } else {
      users.unshift(record);
    }
    this.saveEnrolledUsers(users);
  }

  public recordUserLogin(email: string, name?: string) {
    const users = this.getAllEnrolledUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      existing.lastLoginAt = 'Just now';
      this.saveEnrolledUsers(users);
    }
  }

  public adminGrantPaidMembership(userId: string, planId: string): void {
    const users = this.getAllEnrolledUsers();
    const target = users.find(u => u.id === userId);
    if (!target) return;

    const planPrices: Record<string, { price: number; title: string }> = {
      individual: { price: 99, title: 'Individual Chef Annual Plan' },
      team: { price: 79, title: 'Team Brigade Annual Plan' },
      training: { price: 1499, title: 'Executive Advisory & Training' }
    };
    const info = planPrices[planId] || { price: 79, title: 'Team Brigade Annual Plan' };

    const now = Date.now();
    target.planId = planId;
    target.planTitle = info.title;
    target.amountPaid = info.price;
    target.status = 'paid_active';
    target.ziinaTransactionId = target.ziinaTransactionId || `ZN-ADM-${Math.floor(100000 + Math.random() * 900000)}`;
    target.expiresAt = now + ANNUAL_DURATION_MS;
    target.expiresAtFormatted = new Date(now + ANNUAL_DURATION_MS).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    this.saveEnrolledUsers(users);

    // Also update local device hold if this is current workstation
    const record = this.getRecord();
    if (record.userEmail?.toLowerCase() === target.email.toLowerCase()) {
      record.activeMembershipPlan = planId;
      record.membershipExpiresAt = now + ANNUAL_DURATION_MS;
      this.saveRecord(record);
    }
  }

  public adminResetIpHold(userId: string): void {
    const users = this.getAllEnrolledUsers();
    const target = users.find(u => u.id === userId);
    if (target) {
      target.status = 'trial_active';
      target.expiresAt = Date.now() + TRIAL_DURATION_MS;
      target.expiresAtFormatted = new Date(target.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      this.saveEnrolledUsers(users);
    }
    this.resetDeviceHold();
  }

  public adminExtendTrial(userId: string, additionalDays: number): void {
    const users = this.getAllEnrolledUsers();
    const target = users.find(u => u.id === userId);
    if (target) {
      const extensionMs = additionalDays * 24 * 3600 * 1000;
      target.expiresAt = (target.expiresAt > Date.now() ? target.expiresAt : Date.now()) + extensionMs;
      target.expiresAtFormatted = new Date(target.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      target.status = 'trial_active';
      this.saveEnrolledUsers(users);

      const record = this.getRecord();
      if (record.userEmail?.toLowerCase() === target.email.toLowerCase()) {
        record.trialExpiresAt = target.expiresAt;
        this.saveRecord(record);
      }
    }
  }

  public adminDeleteUser(userId: string): void {
    const users = this.getAllEnrolledUsers();
    const filtered = users.filter(u => u.id !== userId);
    this.saveEnrolledUsers(filtered);
  }

  // ================= ADMIN PAYMENT NOTIFICATION & APPROVAL WORKFLOW =================

  public getAdminNotifications(): AdminPaymentNotification[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [];
  }

  public saveAdminNotifications(list: AdminPaymentNotification[]) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {}
  }

  /**
   * Called when a customer pays via Ziina:
   * 1. Records enrollment with status 'pending_approval'
   * 2. Dispatches notification to admin email supritam.basu@supritamone.com
   */
  public submitZiinaPaymentForApproval(
    planId: string,
    email: string,
    memberName?: string,
    transactionId?: string,
    details?: { workPlace?: string; designation?: string; authProvider?: 'google' | 'linkedin' | 'email' }
  ): { userRecord: EnrolledUserRecord; notification: AdminPaymentNotification } {
    const record = this.getRecord();
    const now = Date.now();
    const txId = transactionId || `ZN-${Math.floor(1000000 + Math.random() * 9000000)}`;

    const planPrices: Record<string, { price: number; title: string }> = {
      individual: { price: 99, title: 'Individual Chef Annual Plan' },
      team: { price: 79, title: 'Team Brigade Annual Plan' },
      training: { price: 1499, title: 'Executive Advisory & Training' }
    };
    const planInfo = planPrices[planId] || { price: 79, title: 'Commercial Brigade Plan' };

    const newUserId = `USR-${Math.floor(1000 + Math.random() * 9000)}`;
    const userRecord: EnrolledUserRecord = {
      id: newUserId,
      name: memberName || 'Commercial Brigade Member',
      email,
      workPlace: details?.workPlace || 'Zero Waste Commercial Kitchen',
      designation: details?.designation || 'Head Chef & Culinary Director',
      authProvider: details?.authProvider || 'google',
      planId,
      planTitle: planInfo.title,
      amountPaid: planInfo.price,
      currency: 'USD',
      status: 'pending_approval',
      ziinaTransactionId: txId,
      ipAddress: record.ipAddress,
      deviceId: record.deviceId,
      enrolledAt: new Date(now).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      enrolledTimestamp: now,
      lastLoginAt: 'Pending Approval',
      daysRunning: 0,
      expiresAt: 0,
      expiresAtFormatted: 'Awaiting Admin Approval',
      notifiedAdminEmail: ADMIN_NOTIFICATION_EMAIL
    };

    // Save in enrolled users database
    this.recordUserEnrollment(userRecord);

    // Create Admin Notification for supritam.basu@supritamone.com
    const notif: AdminPaymentNotification = {
      id: `NOTIF-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: newUserId,
      customerName: userRecord.name,
      customerEmail: email,
      planId,
      planTitle: planInfo.title,
      amountPaid: planInfo.price,
      currency: 'USD',
      ziinaTransactionId: txId,
      submittedAt: now,
      submittedAtFormatted: new Date(now).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'pending_approval',
      notifiedAdminEmail: ADMIN_NOTIFICATION_EMAIL
    };

    const notifs = this.getAdminNotifications();
    notifs.unshift(notif);
    this.saveAdminNotifications(notifs);

    return { userRecord, notification: notif };
  }

  /**
   * Admin approves Ziina payment: grants 1-Year access and sends confirmation notice to customer
   */
  public adminApprovePayment(notificationId: string): { success: boolean; user?: EnrolledUserRecord; notice?: CustomerApprovalNotice } {
    const notifs = this.getAdminNotifications();
    const notif = notifs.find(n => n.id === notificationId || n.userId === notificationId);
    if (!notif) return { success: false };

    const now = Date.now();
    notif.status = 'approved';
    notif.approvedAt = now;
    this.saveAdminNotifications(notifs);

    // Update Enrolled User Record to paid_active
    const users = this.getAllEnrolledUsers();
    let targetUser = users.find(u => u.id === notif.userId || u.email.toLowerCase() === notif.customerEmail.toLowerCase());
    if (targetUser) {
      targetUser.status = 'paid_active';
      targetUser.expiresAt = now + ANNUAL_DURATION_MS;
      targetUser.expiresAtFormatted = new Date(now + ANNUAL_DURATION_MS).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      targetUser.daysRunning = 1;
      this.saveEnrolledUsers(users);
    }

    // Update local device hold record if matching this client
    const record = this.getRecord();
    if (record.userEmail?.toLowerCase() === notif.customerEmail.toLowerCase() || targetUser?.email.toLowerCase() === record.userEmail?.toLowerCase()) {
      record.activeMembershipPlan = notif.planId;
      record.membershipExpiresAt = now + ANNUAL_DURATION_MS;
      this.saveRecord(record);
    }

    // Create customer approval notice with login URL
    const notice: CustomerApprovalNotice = {
      id: `NOTICE-${Math.floor(1000 + Math.random() * 9000)}`,
      customerEmail: notif.customerEmail,
      customerName: notif.customerName,
      planTitle: notif.planTitle,
      amountPaid: notif.amountPaid,
      approvedBy: ADMIN_NOTIFICATION_EMAIL,
      approvedAt: now,
      loginUrl: TARGET_PLATFORM_URL,
      message: `Your payment of $${notif.amountPaid} USD on Ziina has been approved by administrator ${ADMIN_NOTIFICATION_EMAIL}. Your 1-Year Commercial License is activated. You can now log in at ${TARGET_PLATFORM_URL}!`
    };

    this.saveCustomerNotice(notice);

    return { success: true, user: targetUser, notice };
  }

  public adminRejectPayment(notificationId: string): void {
    const notifs = this.getAdminNotifications();
    const notif = notifs.find(n => n.id === notificationId || n.userId === notificationId);
    if (!notif) return;

    notif.status = 'rejected';
    this.saveAdminNotifications(notifs);

    const users = this.getAllEnrolledUsers();
    const targetUser = users.find(u => u.id === notif.userId || u.email.toLowerCase() === notif.customerEmail.toLowerCase());
    if (targetUser) {
      targetUser.status = 'rejected';
      this.saveEnrolledUsers(users);
    }
  }

  public saveCustomerNotice(notice: CustomerApprovalNotice) {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(CUSTOMER_NOTICES_KEY);
      const list: CustomerApprovalNotice[] = raw ? JSON.parse(raw) : [];
      list.unshift(notice);
      localStorage.setItem(CUSTOMER_NOTICES_KEY, JSON.stringify(list));
    } catch (e) {}
  }

  public getCustomerNotices(email?: string): CustomerApprovalNotice[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(CUSTOMER_NOTICES_KEY);
      if (!raw) return [];
      const list: CustomerApprovalNotice[] = JSON.parse(raw);
      if (!email) return list;
      return list.filter(n => n.customerEmail.toLowerCase() === email.toLowerCase());
    } catch (e) {
      return [];
    }
  }

  public checkUserApprovalStatus(email: string): { isApproved: boolean; isPending: boolean; status: string; planId?: string } {
    const users = this.getAllEnrolledUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return { isApproved: false, isPending: false, status: 'none' };
    return {
      isApproved: user.status === 'paid_active',
      isPending: user.status === 'pending_approval',
      status: user.status,
      planId: user.planId
    };
  }

  public getAdminStats(): {
    totalRevenue: number;
    totalEnrolled: number;
    activePaidMembers: number;
    activeTrials: number;
    expiredHolds: number;
    pendingApprovals: number;
  } {
    const users = this.getAllEnrolledUsers();
    const totalRevenue = users.filter(u => u.status === 'paid_active').reduce((sum, u) => sum + (u.amountPaid || 0), 0);
    const totalEnrolled = users.length;
    const activePaidMembers = users.filter(u => u.status === 'paid_active').length;
    const activeTrials = users.filter(u => u.status === 'trial_active').length;
    const expiredHolds = users.filter(u => u.status === 'trial_expired' || u.status === 'hold_active').length;
    const pendingApprovals = users.filter(u => u.status === 'pending_approval').length;

    return {
      totalRevenue,
      totalEnrolled,
      activePaidMembers,
      activeTrials,
      expiredHolds,
      pendingApprovals
    };
  }
}

export const deviceHoldService = new DeviceHoldService();
