/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NavigationPage, InventoryItem, CommunityDonationAlert, UpcycledRecipe, ChefUserProfile } from './types';
import { INITIAL_INVENTORY_ITEMS, INITIAL_DONATION_ALERTS } from './data/mockData';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { ProblemSolutionSection } from './components/ProblemSolutionSection';
import { FAQSection } from './components/FAQSection';
import { DashboardView } from './components/DashboardView';
import { AppRecipesView } from './components/AppRecipesView';
import { TrainingView } from './components/TrainingView';
import { ConsultingView } from './components/ConsultingView';
import { BookView } from './components/BookView';
import { CommunityView } from './components/CommunityView';
import { AboutView } from './components/AboutView';
import { RecipeModal } from './components/RecipeModal';
import { DonationModal } from './components/DonationModal';
import { AddInventoryModal } from './components/AddInventoryModal';
import { ContactModal } from './components/ContactModal';
import { PaymentAuthModal } from './components/PaymentAuthModal';
import { TrialExpiredHoldModal } from './components/TrialExpiredHoldModal';
import { AdminView } from './components/AdminView';
import { deviceHoldService } from './services/deviceHoldService';

export default function App() {
  const [currentPage, setCurrentPage] = useState<NavigationPage>('home');
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(INITIAL_INVENTORY_ITEMS);
  const [donationAlerts, setDonationAlerts] = useState<CommunityDonationAlert[]>(INITIAL_DONATION_ALERTS);

  // Modals state
  const [activeRecipe, setActiveRecipe] = useState<UpcycledRecipe | null>(null);
  const [donationModalOpen, setDonationModalOpen] = useState(false);
  const [prefillDonationItem, setPrefillDonationItem] = useState<InventoryItem | null>(null);
  const [addInventoryModalOpen, setAddInventoryModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactTopic, setContactTopic] = useState('Commercial Kitchen Food Waste Audit');

  // Customer Authentication & Payment Plan Flow State
  const [currentUser, setCurrentUser] = useState<ChefUserProfile | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<string>('trial');
  const [trialExpiredModalOpen, setTrialExpiredModalOpen] = useState(false);

  // Check device hold & trial status on initial load
  // Check device hold, trial status, and URL payment returns on initial load
  React.useEffect(() => {
    // 1. Check for Ziina return query parameters (?paid=true or ?payment=success)
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const isPaidParam = urlParams.get('paid') === 'true' || urlParams.get('payment') === 'success';
      const planParam = urlParams.get('plan') || localStorage.getItem('zw_pending_paid_plan') || 'individual';
      
      if (isPaidParam) {
        const storedEmail = localStorage.getItem('zw_pending_paid_email') || 'basueats@gmail.com';
        const storedName = localStorage.getItem('zw_pending_paid_name') || 'Basu Eats';
        const record = deviceHoldService.activatePaidMembership(planParam, storedEmail, storedName);
        
        // Clean query string
        window.history.replaceState({}, document.title, window.location.pathname);
        
        setCurrentUser({
          firstName: storedName.split(' ')[0] || 'Basu',
          lastName: storedName.split(' ')[1] || 'Eats',
          workPlace: 'Zero Waste Commercial Kitchen',
          designation: 'Culinary Director',
          workEmail: storedEmail,
          isAuthenticated: true,
          selectedPlanId: planParam,
          planStatus: planParam === 'team' ? 'team_active' : (planParam === 'training' ? 'training_active' : 'pro_active'),
          membershipExpiresAt: record.membershipExpiresAt,
          clientIp: deviceHoldService.getDeviceInfo().ipAddress,
          deviceId: deviceHoldService.getDeviceInfo().deviceId,
          isIpHeld: false
        });
        setTrialExpiredModalOpen(false);
        setPaymentModalOpen(false);
        setCurrentPage('home');
        return;
      }
    }

    const checkAccessStatus = () => {
      const isPaid = deviceHoldService.hasActivePaidMembership();
      const isTrial = deviceHoldService.isTrialActive();
      const isHeld = deviceHoldService.isDeviceOrIpHeld();
      const record = deviceHoldService.getRawRecord();
      const deviceInfo = deviceHoldService.getDeviceInfo();

      if (isPaid) {
        setCurrentUser({
          firstName: record.memberName?.split(' ')[0] || 'Culinary',
          lastName: record.memberName?.split(' ')[1] || 'Director',
          workPlace: 'Zero Waste Commercial Kitchen',
          designation: 'Certified Culinary Director',
          workEmail: record.userEmail || 'member@kitchen.org',
          isAuthenticated: true,
          selectedPlanId: record.activeMembershipPlan,
          planStatus: record.activeMembershipPlan === 'team' ? 'team_active' : (
            record.activeMembershipPlan === 'training' ? 'training_active' : 'pro_active'
          ),
          membershipExpiresAt: record.membershipExpiresAt,
          clientIp: deviceInfo.ipAddress,
          deviceId: deviceInfo.deviceId,
          isIpHeld: false
        });
        setTrialExpiredModalOpen(false);
      } else if (isTrial) {
        const remaining = deviceHoldService.getTrialTimeRemaining();
        setCurrentUser({
          firstName: record.memberName?.split(' ')[0] || 'Basu',
          lastName: record.memberName?.split(' ')[1] || 'Eats',
          workPlace: 'Commercial Brigade Station',
          designation: 'Kitchen Professional',
          workEmail: record.userEmail || 'basueats@gmail.com',
          isAuthenticated: true,
          selectedPlanId: 'trial',
          planStatus: 'trial_active',
          trialDaysLeft: remaining.days,
          trialHoursLeft: remaining.hours,
          trialExpiresAt: record.trialExpiresAt,
          clientIp: deviceInfo.ipAddress,
          deviceId: deviceInfo.deviceId,
          isIpHeld: false
        });
        setTrialExpiredModalOpen(false);
      } else if (isHeld) {
        // Strict 3-day hold: access revoked, device locked
        setCurrentUser(null);
        setTrialExpiredModalOpen(true);
      }
    };

    checkAccessStatus();

    // Check periodically so when 3 days expire, access is revoked immediately
    const interval = setInterval(checkAccessStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  // Count active alerts
  const activeAlertsCount = donationAlerts.filter(
    (a) => a.status === 'broadcasting' || a.status === 'claimed' || a.status === 'in_transit'
  ).length;

  // Handlers for Inventory
  const handleAddInventory = (newItem: InventoryItem) => {
    setInventoryItems([newItem, ...inventoryItems]);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setInventoryItems(
      inventoryItems.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(0, parseFloat((item.quantity + delta).toFixed(1)));
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const handleDeleteInventory = (id: string) => {
    setInventoryItems(inventoryItems.filter((item) => item.id !== id));
  };

  // Handlers for Donation Alerts
  const handleOpenBroadcastDonation = (prefillItem?: InventoryItem) => {
    setPrefillDonationItem(prefillItem || null);
    setDonationModalOpen(true);
  };

  const handleBroadcastAlert = (newAlert: CommunityDonationAlert) => {
    setDonationAlerts([newAlert, ...donationAlerts]);
    if (prefillDonationItem) {
      setInventoryItems(
        inventoryItems.map((item) =>
          item.id === prefillDonationItem.id ? { ...item, status: 'donated' } : item
        )
      );
    }
  };

  const handleAdvanceAlertStatus = (alertId: string) => {
    setDonationAlerts(
      donationAlerts.map((alert) => {
        if (alert.id === alertId) {
          let nextStatus: CommunityDonationAlert['status'] = 'claimed';
          if (alert.status === 'broadcasting') nextStatus = 'claimed';
          else if (alert.status === 'claimed') nextStatus = 'in_transit';
          else if (alert.status === 'in_transit') nextStatus = 'delivered';
          return { ...alert, status: nextStatus };
        }
        return alert;
      })
    );
  };

  // Booking modal trigger
  const handleOpenBooking = (topic?: string) => {
    if (topic) setContactTopic(topic);
    setContactModalOpen(true);
  };

  // Payment Plan / Customer Auth modal triggers
  const handleOpenPaymentAuth = (planId?: string) => {
    setSelectedPlanForPayment(planId || 'trial');
    setPaymentModalOpen(true);
  };

  const handleLoginSuccess = (updatedUser: ChefUserProfile) => {
    setCurrentUser(updatedUser);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col antialiased selection:bg-black selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        activeDonationAlertsCount={activeAlertsCount}
        onOpenBooking={() => handleOpenBooking()}
        currentUser={currentUser}
        onOpenPaymentAuth={handleOpenPaymentAuth}
        onLogout={handleLogout}
      />

      {/* Main Page View Content */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomeView
            onNavigate={setCurrentPage}
            onOpenRecipe={(recipe) => setActiveRecipe(recipe)}
            onOpenBooking={() => handleOpenBooking()}
            onOpenPaymentAuth={handleOpenPaymentAuth}
            currentUser={currentUser}
          />
        )}

        {currentPage === 'problem-solution' && (
          <div className="py-6">
            <ProblemSolutionSection
              onGoToDashboard={() => setCurrentPage('dashboard')}
              onGoToRecipes={() => setCurrentPage('recipes')}
            />
          </div>
        )}

        {currentPage === 'dashboard' && (
          <DashboardView
            inventoryItems={inventoryItems}
            donationAlerts={donationAlerts}
            onOpenAddInventory={() => setAddInventoryModalOpen(true)}
            onOpenBroadcastDonation={handleOpenBroadcastDonation}
            onOpenRecipe={(recipe) => setActiveRecipe(recipe)}
            onUpdateInventoryItemQuantity={handleUpdateQuantity}
            onDeleteInventoryItem={handleDeleteInventory}
            onAdvanceAlertStatus={handleAdvanceAlertStatus}
          />
        )}

        {currentPage === 'recipes' && (
          <AppRecipesView
            onOpenRecipe={(recipe) => setActiveRecipe(recipe)}
            onOpenAddInventory={() => setAddInventoryModalOpen(true)}
          />
        )}

        {currentPage === 'training' && (
          <TrainingView 
            onOpenBooking={() => handleOpenBooking('4-Week Brigade Training Bootcamp')} 
            onOpenPaymentAuth={handleOpenPaymentAuth}
          />
        )}

        {currentPage === 'faq' && (
          <div className="py-8">
            <FAQSection onContactClick={() => handleOpenBooking('FAQ Inquiry')} />
          </div>
        )}

        {currentPage === 'consulting' && (
          <ConsultingView onOpenBooking={() => handleOpenBooking('Commercial Kitchen Food Waste Audit')} />
        )}

        {currentPage === 'book' && <BookView />}

        {currentPage === 'community' && (
          <CommunityView onOpenBroadcastDonation={() => handleOpenBroadcastDonation()} />
        )}

        {currentPage === 'about' && (
          <AboutView onOpenBooking={() => handleOpenBooking()} />
        )}

        {currentPage === 'admin' && (
          <AdminView 
            onNavigate={setCurrentPage} 
            onActivateTrialTest={(user) => {
              setCurrentUser(user);
              setTrialExpiredModalOpen(false);
              setPaymentModalOpen(false);
              setCurrentPage('home');
            }}
            onSimulateExpiryTest={() => {
              setCurrentUser(null);
              setTrialExpiredModalOpen(true);
            }}
          />
        )}

        {currentPage === 'contact' && (
          <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 bg-[#fafbfc]">
            <div className="max-w-md w-full bg-white border border-neutral-200 rounded-3xl p-8 text-center space-y-4 shadow-sm">
              <h2 className="text-2xl font-bold font-heading text-neutral-900">Get in Touch</h2>
              <p className="text-xs text-neutral-600">
                Connect directly with the Zero waste by Supritamone culinary advisory team.
              </p>
              <button
                onClick={() => handleOpenBooking()}
                className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-black hover:bg-neutral-800 text-white shadow-md cursor-pointer"
              >
                Open Booking Form
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={setCurrentPage}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* Modals */}
      <RecipeModal
        recipe={activeRecipe}
        onClose={() => setActiveRecipe(null)}
      />

      <DonationModal
        isOpen={donationModalOpen}
        onClose={() => {
          setDonationModalOpen(false);
          setPrefillDonationItem(null);
        }}
        prefillItem={prefillDonationItem}
        onBroadcastAlert={handleBroadcastAlert}
      />

      <AddInventoryModal
        isOpen={addInventoryModalOpen}
        onClose={() => setAddInventoryModalOpen(false)}
        onAddItem={handleAddInventory}
      />

      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        defaultTopic={contactTopic}
      />

      <PaymentAuthModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        initialPlanId={selectedPlanForPayment}
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
        onOpenDashboard={() => setCurrentPage('dashboard')}
        onRedirectHome={() => setCurrentPage('home')}
        onOpenAdminPortal={() => setCurrentPage('admin')}
      />

      <TrialExpiredHoldModal
        isOpen={trialExpiredModalOpen}
        onClose={() => setTrialExpiredModalOpen(false)}
        currentUser={currentUser}
        onMembershipActivated={(updatedUser) => {
          setCurrentUser(updatedUser);
          setTrialExpiredModalOpen(false);
        }}
        onRedirectHome={() => setCurrentPage('home')}
      />
    </div>
  );
}
