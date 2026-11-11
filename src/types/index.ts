export type NavigationPage = 
  | 'home' 
  | 'problem-solution'
  | 'dashboard' 
  | 'recipes' 
  | 'training' 
  | 'faq'
  | 'consulting' 
  | 'book' 
  | 'community' 
  | 'about' 
  | 'contact'
  | 'admin';

export interface EnrolledUserRecord {
  id: string;
  name: string;
  email: string;
  workPlace: string;
  designation: string;
  authProvider: 'google' | 'linkedin' | 'email';
  planId: string;
  planTitle: string;
  amountPaid: number;
  currency: string;
  status: 'trial_active' | 'trial_expired' | 'paid_active' | 'hold_active' | 'pending_approval' | 'rejected';
  ziinaTransactionId?: string;
  ipAddress: string;
  deviceId: string;
  enrolledAt: string;
  enrolledTimestamp: number;
  lastLoginAt: string;
  daysRunning: number;
  expiresAt: number;
  expiresAtFormatted: string;
  notifiedAdminEmail?: string;
}

export interface AdminPaymentNotification {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  planId: string;
  planTitle: string;
  amountPaid: number;
  currency: string;
  ziinaTransactionId: string;
  submittedAt: number;
  submittedAtFormatted: string;
  status: 'pending_approval' | 'approved' | 'rejected';
  notifiedAdminEmail: string; // supritam.basu@supritamone.com
  approvedAt?: number;
}

export interface CustomerApprovalNotice {
  id: string;
  customerEmail: string;
  customerName: string;
  planTitle: string;
  amountPaid: number;
  approvedBy: string; // supritam.basu@supritamone.com
  approvedAt: number;
  loginUrl: string; // https://zerowasteacademy.supritamone.com/
  message: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Produce Trimmings' | 'Bakery & Grains' | 'Dairy & Liquids' | 'Prepared Mains' | 'Herbs & Aromatics' | 'Citrus & Fruits';
  quantity: number;
  unit: 'kg' | 'L' | 'trays' | 'portions' | 'bunches';
  station: 'Cold Larder' | 'Hot Line' | 'Pastry & Bakery' | 'Prep Station' | 'Buffet / Banquet';
  storage: 'Walk-in Chiller' | 'Deep Freeze' | 'Ambient Dry Store' | 'Blast Chiller';
  dateLogged: string;
  shelfLifeHoursRemaining: number;
  status: 'optimal' | 'use_soon' | 'zero_waste_critical' | 'donated';
  upcyclePotentialRecipeId?: string;
  estimatedCostValue: number; // in USD
}

export interface ChefUserProfile {
  firstName: string;
  lastName: string;
  workPlace: string;
  designation: string;
  workEmail: string;
  isAuthenticated: boolean;
  authProvider?: 'google' | 'linkedin' | 'email';
  avatarUrl?: string;
  selectedPlanId?: string;
  trialDaysLeft?: number;
  trialHoursLeft?: number;
  trialExpiresAt?: number;
  membershipExpiresAt?: number;
  isIpHeld?: boolean;
  clientIp?: string;
  deviceId?: string;
  planStatus?: 'trial_active' | 'trial_expired' | 'pro_active' | 'team_active' | 'training_active' | 'pending_approval' | 'none';
}

export interface CommunityDonationAlert {
  id: string;
  itemTitle: string;
  category: string;
  quantityStr: string;
  kitchenLocation: string;
  pickupWindow: string;
  temperatureRequirement: 'Chilled (<4°C)' | 'Frozen (<-18°C)' | 'Ambient / Room Temp' | 'Hot Held (>63°C)';
  matchedShelterName: string;
  status: 'broadcasting' | 'claimed' | 'in_transit' | 'delivered';
  timestamp: string;
  donorChef: string;
  mealsEquivalency: number;
  dietaryNotes: string[];
}

export interface UpcycledRecipe {
  id: string;
  title: string;
  zeroWasteHeroIngredient: string;
  category: 'Sauces & Stocks' | 'Ferments & Pickles' | 'Bakery & Pastry' | 'Crisps & Powders' | 'Condiments & Pastes' | 'Entrees';
  prepTime: string;
  difficulty: 'Professional' | 'Intermediate' | 'Essential Brigade';
  station: string;
  wasteReductionRate: string; // e.g. "95% scrap conversion"
  costSavingsPerKg: number;
  co2OffsetKg: number;
  description: string;
  ingredients: { item: string; amount: string; isZeroWaste?: boolean }[];
  steps: string[];
  chefTip: string;
  image: string;
  tags: string[];
}

export interface TrainingCourse {
  id: string;
  title: string;
  format: 'Hybrid Masterclass' | 'On-Site Kitchen Audit' | 'Digital Brigade Certification' | 'Executive F&B Advisory';
  duration: string;
  targetAudience: string;
  description: string;
  modules: { title: string; duration: string; topics: string[] }[];
  keyOutcomes: string[];
  priceNote: string;
  highlight?: boolean;
}

export interface PartnerShelter {
  id: string;
  name: string;
  organizationType: 'Food Bank' | 'Emergency Shelter' | 'Community Kitchen' | 'Youth Nutrition Centre';
  distance: string;
  capacityPerDay: string;
  contactPerson: string;
  urgentNeeds: string[];
  pickupAvailability: string;
  verifiedStatus: boolean;
}

export interface PricingPlan {
  id: string;
  title: string;
  price: string;
  numericPrice?: number;
  cadence: string;
  badge?: string;
  description: string;
  features: string[];
  buttonText: string;
  highlighted?: boolean;
  isTrial?: boolean;
  ziinaPayUrl?: string;
}
