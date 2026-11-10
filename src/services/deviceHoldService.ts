/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
  chefName?: string;
  paidTransactionId?: string;
  lastAccessAt: number;
}

const STORAGE_KEY = 'zw_device_network_hold_v1';
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
    // Uses cached IP or simulated public kitchen IP
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
        const parsed = JSON.parse(raw);
        return parsed;
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

  /**
   * Has active paid 1-year membership?
   */
  public hasActivePaidMembership(): boolean {
    const record = this.getRecord();
    if (record.activeMembershipPlan && record.membershipExpiresAt) {
      return Date.now() < record.membershipExpiresAt;
    }
    return false;
  }

  /**
   * Is the 3-day trial currently active and not expired?
   */
  public isTrialActive(): boolean {
    const record = this.getRecord();
    if (this.hasActivePaidMembership()) return false;
    if (record.trialClaimed && record.trialExpiresAt) {
      return Date.now() < record.trialExpiresAt;
    }
    return false;
  }

  /**
   * Is this device / IP in hold because trial expired or was already claimed?
   */
  public isDeviceOrIpHeld(): boolean {
    if (this.hasActivePaidMembership()) return false;
    const record = this.getRecord();
    if (!record.trialClaimed) return false;
    // If trial was claimed and either trial has expired or trial is ended
    if (record.trialExpiresAt && Date.now() >= record.trialExpiresAt) {
      return true;
    }
    return false;
  }

  /**
   * Can this device / IP claim the 0 USD 3-day free trial?
   * Only allowed once per device / MAC / IP!
   */
  public canClaimTrial(): boolean {
    if (this.hasActivePaidMembership()) return false;
    const record = this.getRecord();
    return !record.trialClaimed;
  }

  /**
   * Returns precise time remaining on the 3-day trial
   */
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
   * Activate 0 USD 3-Day Free Trial
   * Locks the device and IP into the hold registry
   */
  public activateTrial(email: string, chefName?: string): DeviceHoldRecord {
    const record = this.getRecord();
    const now = Date.now();
    const updated: DeviceHoldRecord = {
      ...record,
      trialClaimed: true,
      trialStartedAt: now,
      trialExpiresAt: now + TRIAL_DURATION_MS,
      userEmail: email,
      chefName: chefName || record.chefName,
      lastAccessAt: now
    };
    this.saveRecord(updated);
    return updated;
  }

  /**
   * Activate 1-Year Paid Access after paying $79, $99, or $1499 via Ziina
   */
  public activatePaidMembership(
    planId: string,
    email: string,
    chefName?: string,
    transactionId?: string
  ): DeviceHoldRecord {
    const record = this.getRecord();
    const now = Date.now();
    const updated: DeviceHoldRecord = {
      ...record,
      activeMembershipPlan: planId,
      membershipExpiresAt: now + ANNUAL_DURATION_MS,
      userEmail: email,
      chefName: chefName || record.chefName,
      paidTransactionId: transactionId || `ZIINA-${Math.floor(100000 + Math.random() * 900000)}`,
      lastAccessAt: now
    };
    this.saveRecord(updated);
    return updated;
  }

  /**
   * Simulate trial expiration for testing the IP/Device hold modal
   */
  public simulateTrialExpiry(): void {
    const record = this.getRecord();
    const now = Date.now();
    const updated: DeviceHoldRecord = {
      ...record,
      trialClaimed: true,
      trialStartedAt: now - TRIAL_DURATION_MS - 60000,
      trialExpiresAt: now - 60000, // Expired 1 minute ago
      activeMembershipPlan: undefined,
      membershipExpiresAt: undefined,
      lastAccessAt: now
    };
    this.saveRecord(updated);
  }

  /**
   * Reset device hold (for testing clean onboarding)
   */
  public resetDeviceHold(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('zw_simulated_client_ip');
    } catch (e) {
      // Ignore
    }
  }

  public getRawRecord(): DeviceHoldRecord {
    return this.getRecord();
  }
}

export const deviceHoldService = new DeviceHoldService();
