import React, { useState } from 'react';
import { InventoryItem, CommunityDonationAlert, UpcycledRecipe } from '../types';
import { PARTNER_SHELTERS, UPCYCLED_RECIPES } from '../data/mockData';
import {
  LayoutDashboard,
  HeartHandshake,
  Plus,
  Bell,
  Search,
  Filter,
  AlertTriangle,
  Clock,
  Sparkles,
  TrendingDown,
  DollarSign,
  Leaf,
  CheckCircle2,
  Truck,
  ArrowRight,
  ShieldCheck,
  Thermometer,
  Download,
  ChefHat
} from 'lucide-react';

interface DashboardViewProps {
  inventoryItems: InventoryItem[];
  donationAlerts: CommunityDonationAlert[];
  onOpenAddInventory: () => void;
  onOpenBroadcastDonation: (prefillItem?: InventoryItem) => void;
  onOpenRecipe: (recipe: UpcycledRecipe) => void;
  onUpdateInventoryItemQuantity: (id: string, delta: number) => void;
  onDeleteInventoryItem: (id: string) => void;
  onAdvanceAlertStatus: (alertId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  inventoryItems,
  donationAlerts,
  onOpenAddInventory,
  onOpenBroadcastDonation,
  onOpenRecipe,
  onUpdateInventoryItemQuantity,
  onDeleteInventoryItem,
  onAdvanceAlertStatus
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'alerts' | 'analytics'>('inventory');
  const [selectedStation, setSelectedStation] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [manifestNotification, setManifestNotification] = useState(false);

  // Filter inventory
  const filteredItems = inventoryItems.filter(item => {
    const matchesStation = selectedStation === 'All' || item.station === selectedStation;
    const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.storage.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStation && matchesStatus && matchesSearch;
  });

  // Calculate metrics
  const totalVolumeKg = inventoryItems.reduce((acc, curr) => {
    if (curr.unit === 'kg' || curr.unit === 'L') return acc + curr.quantity;
    return acc + curr.quantity * 0.4;
  }, 0);

  const criticalItemsCount = inventoryItems.filter(i => i.status === 'zero_waste_critical').length;
  const totalSavedValue = inventoryItems.reduce((acc, curr) => acc + curr.estimatedCostValue, 0) + 1420;
  const totalMealsDonated = donationAlerts.reduce((acc, curr) => acc + curr.mealsEquivalency, 0);

  const handleDownloadManifest = () => {
    setManifestNotification(true);
    setTimeout(() => setManifestNotification(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] py-10 px-4 sm:px-6 lg:px-8 text-neutral-900">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header & Sub-nav */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 pb-6 bg-white p-6 rounded-2xl shadow-sm">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                STATION INTELLIGENCE
              </span>
              <span className="text-xs text-neutral-500">Zero waste by Supritamone</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-neutral-900 mt-1">
              Station Inventory & Donation Alert Suite
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500">
              Live tracking for kitchen scrap, expiration buffers, and 1-click community rescue alerts
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center flex-wrap gap-2.5">
            <button
              onClick={onOpenAddInventory}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-all flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Log Stock & Trim</span>
            </button>
            <button
              onClick={() => onOpenBroadcastDonation()}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-black hover:bg-neutral-800 text-white transition-all flex items-center space-x-1.5 shadow-sm active:scale-95"
            >
              <HeartHandshake className="w-4 h-4 text-emerald-400" />
              <span>Broadcast Donation Alert</span>
            </button>
          </div>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Active Stock</span>
              <div className="p-2 rounded-lg bg-neutral-100 text-neutral-800">
                <LayoutDashboard className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-bold font-heading text-neutral-900 font-mono">
                {totalVolumeKg.toFixed(1)}
              </span>
              <span className="text-xs text-neutral-500">kg monitored</span>
            </div>
            <p className="text-[11px] text-emerald-700 font-medium">8 kitchen stations logged</p>
          </div>

          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Critical Excess</span>
              <div className="p-2 rounded-lg bg-red-50 text-red-600">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-bold font-heading text-red-600 font-mono">
                {criticalItemsCount}
              </span>
              <span className="text-xs text-neutral-500">items &lt; 12h</span>
            </div>
            <p className="text-[11px] text-red-600">Action required: Upcycle or Rescue</p>
          </div>

          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Value Saved</span>
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-bold font-heading text-neutral-900 font-mono">
                ${totalSavedValue.toLocaleString()}
              </span>
              <span className="text-xs text-neutral-500">this month</span>
            </div>
            <p className="text-[11px] text-emerald-700 font-medium">382 kg CO2e diverted</p>
          </div>

          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Meals Rescued</span>
              <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
                <HeartHandshake className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-bold font-heading text-blue-700 font-mono">
                {totalMealsDonated}
              </span>
              <span className="text-xs text-neutral-500">meals donated</span>
            </div>
            <p className="text-[11px] text-blue-600 font-medium">4 verified partner shelters</p>
          </div>
        </div>

        {/* Manifest Download Notification Toast */}
        {manifestNotification && (
          <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl flex items-center justify-between text-xs text-emerald-900 animate-fadeIn shadow-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span className="font-medium">Donation Manifest & Tax Certificate compiled! Downloaded as zero_waste_supritamone_manifest.pdf</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-mono">Verified Good Samaritan Chain</span>
          </div>
        )}

        {/* Tab Selection */}
        <div className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 pt-3 rounded-t-2xl shadow-sm">
          <div className="flex space-x-6">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`pb-3 text-sm font-bold transition-all relative flex items-center space-x-2 ${
                activeTab === 'inventory' ? 'text-black' : 'text-neutral-500 hover:text-black'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Station Inventory Tracker ({inventoryItems.length})</span>
              {activeTab === 'inventory' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('alerts')}
              className={`pb-3 text-sm font-bold transition-all relative flex items-center space-x-2 ${
                activeTab === 'alerts' ? 'text-black' : 'text-neutral-500 hover:text-black'
              }`}
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Community Donation Alerts</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white">
                {donationAlerts.filter(a => a.status !== 'delivered').length} active
              </span>
              {activeTab === 'alerts' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`pb-3 text-sm font-bold transition-all relative flex items-center space-x-2 ${
                activeTab === 'analytics' ? 'text-black' : 'text-neutral-500 hover:text-black'
              }`}
            >
              <TrendingDown className="w-4 h-4" />
              <span>Waste Diversion Analytics</span>
              {activeTab === 'analytics' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
              )}
            </button>
          </div>

          <button
            onClick={handleDownloadManifest}
            className="hidden sm:flex items-center space-x-1.5 text-xs text-neutral-600 hover:text-black py-1.5 px-3 rounded-lg border border-neutral-200 bg-neutral-50"
          >
            <Download className="w-3.5 h-3.5 text-black" />
            <span>Export Manifest</span>
          </button>
        </div>

        {/* TAB 1: INVENTORY TRACKER */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search trimmings or station..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-black placeholder-neutral-400 focus:outline-none focus:border-black"
                />
              </div>

              {/* Station Filter */}
              <div className="flex items-center flex-wrap gap-1.5 w-full md:w-auto">
                {['All', 'Prep Station', 'Cold Larder', 'Hot Line', 'Pastry & Bakery', 'Buffet / Banquet'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setSelectedStation(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedStation === st
                        ? 'bg-black text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:text-black'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs font-medium text-black focus:outline-none focus:border-black"
              >
                <option value="All">All Freshness Levels</option>
                <option value="zero_waste_critical">🚨 Critical Zero Waste (&lt;12h)</option>
                <option value="use_soon">⚠️ Use Soon (&lt;24h)</option>
                <option value="optimal">✅ Optimal</option>
              </select>
            </div>

            {/* Inventory Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredItems.map((item) => {
                const matchedRecipe = item.upcyclePotentialRecipeId
                  ? UPCYCLED_RECIPES.find(r => r.id === item.upcyclePotentialRecipeId)
                  : null;

                const isCritical = item.status === 'zero_waste_critical';
                const isUseSoon = item.status === 'use_soon';

                return (
                  <div
                    key={item.id}
                    className={`bg-white rounded-2xl border p-5 shadow-sm transition-all flex flex-col justify-between space-y-4 hover:border-black ${
                      isCritical
                        ? 'border-red-300 ring-1 ring-red-200'
                        : isUseSoon
                        ? 'border-amber-300'
                        : 'border-neutral-200'
                    }`}
                  >
                    <div>
                      {/* Top status */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                          {item.station}
                        </span>

                        {isCritical ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">
                            <AlertTriangle className="w-3 h-3 mr-1" /> CRITICAL &lt;12H
                          </span>
                        ) : isUseSoon ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                            <Clock className="w-3 h-3 mr-1" /> USE SOON &lt;24H
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> OPTIMAL
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-neutral-900 leading-snug">
                        {item.name}
                      </h3>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        {item.storage} • Category: {item.category}
                      </p>

                      {/* Quantity & Adjustment */}
                      <div className="mt-4 bg-neutral-50 p-3 rounded-xl border border-neutral-200/80">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="text-neutral-500 font-medium">Batch Weight:</span>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => onUpdateInventoryItemQuantity(item.id, -1)}
                              className="w-5 h-5 rounded bg-white border border-neutral-300 text-black hover:bg-neutral-100 flex items-center justify-center font-bold"
                            >
                              -
                            </button>
                            <span className="font-mono font-bold text-neutral-900 text-sm">
                              {item.quantity} {item.unit}
                            </span>
                            <button
                              onClick={() => onUpdateInventoryItemQuantity(item.id, 1)}
                              className="w-5 h-5 rounded bg-white border border-neutral-300 text-black hover:bg-neutral-100 flex items-center justify-center font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Freshness Bar */}
                        <div className="space-y-1 mt-2">
                          <div className="flex justify-between text-[10px]">
                            <span className="text-neutral-500">Freshness Window:</span>
                            <span className={isCritical ? "text-red-600 font-bold" : "text-neutral-700"}>
                              {item.shelfLifeHoursRemaining}h remaining
                            </span>
                          </div>
                          <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                isCritical ? 'bg-red-500 w-[20%]' : isUseSoon ? 'bg-amber-500 w-[55%]' : 'bg-emerald-500 w-[90%]'
                              }`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Upcycle Recipe Match */}
                      {matchedRecipe && (
                        <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-center justify-between text-xs">
                          <div className="truncate pr-2">
                            <p className="text-[10px] text-emerald-800 font-bold uppercase">Upcycle Formula</p>
                            <p className="text-neutral-900 font-bold text-xs truncate">{matchedRecipe.title}</p>
                          </div>
                          <button
                            onClick={() => onOpenRecipe(matchedRecipe)}
                            className="px-2.5 py-1 rounded bg-black hover:bg-neutral-800 text-white text-[10px] font-bold whitespace-nowrap"
                          >
                            View
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                      <button
                        onClick={() => onDeleteInventoryItem(item.id)}
                        className="text-[11px] text-neutral-400 hover:text-black"
                      >
                        Mark Used
                      </button>

                      <button
                        onClick={() => onOpenBroadcastDonation(item)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-neutral-900 hover:bg-neutral-800 text-white flex items-center space-x-1"
                      >
                        <HeartHandshake className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Rescue / Donate</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: COMMUNITY DONATION ALERTS */}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
              <div>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 mb-1">
                  <Truck className="w-3 h-3 mr-1" /> FOOD RESCUE DISPATCH NETWORK
                </span>
                <h2 className="text-xl font-bold font-heading text-neutral-900">
                  Active Community Zero Waste Broadcasts
                </h2>
                <p className="text-xs text-neutral-500 max-w-xl">
                  Broadcast excess banquet trays or fresh produce directly to local shelters with temperature-monitored cold chain verification.
                </p>
              </div>
              <button
                onClick={() => onOpenBroadcastDonation()}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-black text-white hover:bg-neutral-800 shadow-sm flex items-center space-x-1.5 whitespace-nowrap"
              >
                <HeartHandshake className="w-4 h-4 text-emerald-400" />
                <span>+ Broadcast New Batch</span>
              </button>
            </div>

            {/* Donation Alerts Feed */}
            <div className="space-y-4">
              {donationAlerts.map((alert) => {
                const isBroadcasting = alert.status === 'broadcasting';
                const isClaimed = alert.status === 'claimed';
                const isInTransit = alert.status === 'in_transit';
                const isDelivered = alert.status === 'delivered';

                return (
                  <div
                    key={alert.id}
                    className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm space-y-4 hover:border-black transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-bold text-neutral-900">{alert.itemTitle}</h3>
                          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                            {alert.quantityStr}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500">
                          Logged by {alert.donorChef} • {alert.timestamp}
                        </p>
                      </div>

                      {/* Status Badges & Advance button */}
                      <div className="flex items-center space-x-2">
                        {isBroadcasting && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                            📡 Broadcasting to Shelters
                          </span>
                        )}
                        {isClaimed && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                            🤝 Claimed by Shelter
                          </span>
                        )}
                        {isInTransit && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
                            🚚 Driver In Transit
                          </span>
                        )}
                        {isDelivered && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                            ✓ Delivered & Served
                          </span>
                        )}

                        {!isDelivered && (
                          <button
                            onClick={() => onAdvanceAlertStatus(alert.id)}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-neutral-100 hover:bg-neutral-200 text-black border border-neutral-200"
                          >
                            Advance Status →
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-neutral-50 p-3.5 rounded-xl border border-neutral-200/70">
                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase font-bold">Partner</span>
                        <p className="text-neutral-900 font-semibold truncate">{alert.matchedShelterName}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase font-bold">Pickup Window</span>
                        <p className="text-neutral-900 font-semibold truncate">{alert.pickupWindow}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase font-bold">Temp Spec</span>
                        <p className="text-neutral-900 font-semibold truncate">{alert.temperatureRequirement}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase font-bold">Meal Impact</span>
                        <p className="text-blue-700 font-bold font-mono">~{alert.mealsEquivalency} portions</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Verified Partner Shelters Directory */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-4 shadow-sm">
              <h3 className="text-base font-bold font-heading text-neutral-900">
                Verified Food Rescue Partners (5km Radius)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PARTNER_SHELTERS.map((s) => (
                  <div key={s.id} className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-neutral-900">{s.name}</h4>
                      <span className="text-[11px] font-mono font-bold text-emerald-700">{s.distance}</span>
                    </div>
                    <p className="text-xs text-neutral-600">
                      {s.organizationType} • Daily capacity: <strong className="text-neutral-900">{s.capacityPerDay}</strong>
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      Coordinator: {s.contactPerson}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: WASTE DIVERSION ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <h2 className="text-xl font-bold font-heading text-neutral-900">
              Commercial Kitchen Waste Diversion Breakdown
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-neutral-800">Vegetable Trimmings & Stems</span>
                  <span className="font-mono font-bold text-emerald-700">92% Upcycled</span>
                </div>
                <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[92%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-neutral-800">Day-Old Bread & Bakery</span>
                  <span className="font-mono font-bold text-emerald-700">98% Upcycled into Miso / Crusts</span>
                </div>
                <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[98%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-neutral-800">Banquet & Buffet Overproduction</span>
                  <span className="font-mono font-bold text-blue-700">85% Donated to Community Shelters</span>
                </div>
                <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full w-[85%]" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
