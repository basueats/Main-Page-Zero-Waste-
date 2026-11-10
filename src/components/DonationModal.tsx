import React, { useState } from 'react';
import { CommunityDonationAlert, InventoryItem } from '../types';
import { PARTNER_SHELTERS } from '../data/mockData';
import { X, HeartHandshake, ShieldCheck, Thermometer, MapPin, Clock } from 'lucide-react';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillItem?: InventoryItem | null;
  onBroadcastAlert: (alert: CommunityDonationAlert) => void;
}

export const DonationModal: React.FC<DonationModalProps> = ({
  isOpen,
  onClose,
  prefillItem,
  onBroadcastAlert
}) => {
  if (!isOpen) return null;

  const [itemTitle, setItemTitle] = useState(
    prefillItem ? `${prefillItem.name} (${prefillItem.quantity} ${prefillItem.unit})` : ''
  );
  const [category, setCategory] = useState<string>(prefillItem?.category || 'Prepared Mains');
  const [quantityStr, setQuantityStr] = useState(
    prefillItem ? `${prefillItem.quantity} ${prefillItem.unit}` : ''
  );
  const [kitchenLocation, setKitchenLocation] = useState(
    prefillItem ? `${prefillItem.station} / ${prefillItem.storage}` : 'Central Kitchen - Dock A'
  );
  const [pickupWindow, setPickupWindow] = useState('Within the next 2 hours');
  const [temperatureRequirement, setTemperatureRequirement] = useState<CommunityDonationAlert['temperatureRequirement']>(
    prefillItem?.storage === 'Walk-in Chiller' || prefillItem?.storage === 'Blast Chiller'
      ? 'Chilled (<4°C)'
      : 'Ambient / Room Temp'
  );
  const [matchedShelterName, setMatchedShelterName] = useState(PARTNER_SHELTERS[0].name);
  const [donorChef, setDonorChef] = useState('Head Chef / Brigade Dispatch');
  const [dietaryTags, setDietaryTags] = useState<string[]>(['Nutrient-Rich', 'Safe Chilled Chain']);
  const [customDiet, setCustomDiet] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const availableTags = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Nut-Free', 'Halal-Friendly', 'Untouched Banquet', 'Sealed Containers'];

  const toggleTag = (tag: string) => {
    if (dietaryTags.includes(tag)) {
      setDietaryTags(dietaryTags.filter(t => t !== tag));
    } else {
      setDietaryTags([...dietaryTags, tag]);
    }
  };

  const handleAddCustomDiet = () => {
    if (customDiet.trim() && !dietaryTags.includes(customDiet.trim())) {
      setDietaryTags([...dietaryTags, customDiet.trim()]);
      setCustomDiet('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemTitle.trim() || !quantityStr.trim()) return;

    setSubmitting(true);
    
    let numPortions = 25;
    const matchNum = quantityStr.match(/\d+(\.\d+)?/);
    if (matchNum) {
      const val = parseFloat(matchNum[0]);
      if (quantityStr.includes('kg')) numPortions = Math.round(val * 2.5);
      else if (quantityStr.includes('L')) numPortions = Math.round(val * 3);
      else numPortions = Math.round(val);
    }

    const newAlert: CommunityDonationAlert = {
      id: `don-${Date.now()}`,
      itemTitle: itemTitle.trim(),
      category,
      quantityStr: quantityStr.trim(),
      kitchenLocation: kitchenLocation.trim(),
      pickupWindow: pickupWindow.trim(),
      temperatureRequirement,
      matchedShelterName,
      status: 'broadcasting',
      timestamp: 'Just now',
      donorChef: donorChef.trim() || 'Kitchen Brigade',
      mealsEquivalency: Math.max(10, numPortions),
      dietaryNotes: dietaryTags.length > 0 ? dietaryTags : ['Safe Food Protocol Compliant']
    };

    setTimeout(() => {
      onBroadcastAlert(newAlert);
      setSubmitting(false);
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-neutral-200 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl text-neutral-900 max-h-[95vh] flex flex-col animate-fadeIn">
        {/* Header */}
        <div className="p-6 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center">
              <HeartHandshake className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-heading text-neutral-900">
                Broadcast Community Donation Alert
              </h2>
              <p className="text-xs text-neutral-500">
                Zero waste by Supritamone • Live Food Rescue Dispatch
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-neutral-400 hover:text-black"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-1">
              Rescue Food Item Title *
            </label>
            <input
              type="text"
              required
              value={itemTitle}
              onChange={(e) => setItemTitle(e.target.value)}
              placeholder="e.g., Untouched Banquet Quinoa & Roasted Veg Trays"
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black text-sm focus:outline-none focus:border-black"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black text-sm focus:outline-none focus:border-black"
              >
                <option value="Prepared Mains">Prepared Mains / Entrees</option>
                <option value="Bakery & Grains">Bakery, Bread & Grains</option>
                <option value="Produce Trimmings">Fresh Whole Produce & Veg</option>
                <option value="Dairy & Liquids">Dairy, Soups & Liquids</option>
                <option value="Buffet / Banquet">Buffet Overproduction</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-1">
                Quantity / Weight *
              </label>
              <input
                type="text"
                required
                value={quantityStr}
                onChange={(e) => setQuantityStr(e.target.value)}
                placeholder="e.g. 18.5 kg, 35 portions, 4 pans"
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black text-sm focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-1 flex items-center space-x-1">
                <Thermometer className="w-3.5 h-3.5 text-neutral-600" />
                <span>Safe Holding Temperature *</span>
              </label>
              <select
                value={temperatureRequirement}
                onChange={(e) => setTemperatureRequirement(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black text-sm focus:outline-none focus:border-black"
              >
                <option value="Chilled (<4°C)">Chilled (&lt;4°C in walk-in/blast)</option>
                <option value="Ambient / Room Temp">Ambient / Room Temp (Bakery/Dry)</option>
                <option value="Frozen (<-18°C)">Frozen (&lt;-18°C deep freeze)</option>
                <option value="Hot Held (>63°C)">Hot Held (&gt;63°C ready for pickup)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-1 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-neutral-600" />
                <span>Pickup Time Window *</span>
              </label>
              <input
                type="text"
                required
                value={pickupWindow}
                onChange={(e) => setPickupWindow(e.target.value)}
                placeholder="e.g. Today by 05:00 PM, Next 90 mins"
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black text-sm focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-1">
                Loading Dock / Station
              </label>
              <input
                type="text"
                value={kitchenLocation}
                onChange={(e) => setKitchenLocation(e.target.value)}
                placeholder="e.g., Dock B / Pastry Walk-In"
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black text-sm focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-1">
                Target Shelter / Broadcast
              </label>
              <select
                value={matchedShelterName}
                onChange={(e) => setMatchedShelterName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black text-sm focus:outline-none focus:border-black"
              >
                <option value="All Nearby Verified Rescue Partners (Broadcast)">⚡ Broadcast to All 4 Partner Shelters</option>
                {PARTNER_SHELTERS.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name} ({s.distance})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Allergen specs */}
          <div>
            <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">
              Allergen & Quality Specs
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {availableTags.map((tag) => {
                const isSelected = dietaryTags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-black text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:text-black'
                    }`}
                  >
                    {isSelected ? `✓ ${tag}` : `+ ${tag}`}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-start space-x-2 text-xs text-emerald-900">
            <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Good Samaritan Food Donation Act Protection:</strong> Kitchen certifies wholesome safe handling prior to handoff.
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-200 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-600 hover:text-black"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-black hover:bg-neutral-800 text-white shadow-md flex items-center space-x-2"
            >
              <HeartHandshake className="w-4 h-4 text-emerald-400" />
              <span>{submitting ? 'Broadcasting...' : 'Broadcast Rescue Alert'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
