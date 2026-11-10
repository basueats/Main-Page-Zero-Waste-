import React, { useState } from 'react';
import { InventoryItem } from '../types';
import { UPCYCLED_RECIPES } from '../data/mockData';
import { X, Plus, Sparkles } from 'lucide-react';

interface AddInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: InventoryItem) => void;
}

export const AddInventoryModal: React.FC<AddInventoryModalProps> = ({
  isOpen,
  onClose,
  onAddItem
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [category, setCategory] = useState<InventoryItem['category']>('Produce Trimmings');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState<InventoryItem['unit']>('kg');
  const [station, setStation] = useState<InventoryItem['station']>('Prep Station');
  const [storage, setStorage] = useState<InventoryItem['storage']>('Walk-in Chiller');
  const [shelfLifeHours, setShelfLifeHours] = useState('24');
  const [status, setStatus] = useState<InventoryItem['status']>('optimal');
  const [estimatedCost, setEstimatedCost] = useState('45');

  const matchedRecipe = UPCYCLED_RECIPES.find(r => 
    name.toLowerCase().includes('bread') || 
    name.toLowerCase().includes('stalk') || 
    name.toLowerCase().includes('broccoli') || 
    name.toLowerCase().includes('citrus') || 
    name.toLowerCase().includes('peel') || 
    name.toLowerCase().includes('herb') || 
    name.toLowerCase().includes('skin') || 
    name.toLowerCase().includes('milk')
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !quantity) return;

    const newItem: InventoryItem = {
      id: `inv-${Date.now()}`,
      name: name.trim(),
      category,
      quantity: parseFloat(quantity) || 5,
      unit,
      station,
      storage,
      dateLogged: 'Today, Just now',
      shelfLifeHoursRemaining: parseInt(shelfLifeHours) || 24,
      status,
      upcyclePotentialRecipeId: matchedRecipe ? matchedRecipe.id : undefined,
      estimatedCostValue: parseFloat(estimatedCost) || 30
    };

    onAddItem(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-neutral-200 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl text-neutral-900 max-h-[95vh] flex flex-col animate-fadeIn">
        {/* Header */}
        <div className="p-6 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-heading text-neutral-900">
                Log Kitchen Stock & Trim
              </h2>
              <p className="text-xs text-neutral-500">
                Zero waste by Supritamone • Station Freshness Tracker
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
              Item Description *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Leek Greens & Roasted Onion Skins"
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black text-sm focus:outline-none focus:border-black"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black text-sm focus:outline-none focus:border-black"
              >
                <option value="Produce Trimmings">Produce Trimmings & Stems</option>
                <option value="Bakery & Grains">Bakery, Bread & Grains</option>
                <option value="Prepared Mains">Prepared Mains & Banquet</option>
                <option value="Dairy & Liquids">Dairy & Liquids</option>
                <option value="Citrus & Fruits">Citrus & Fruits</option>
                <option value="Herbs & Aromatics">Herbs & Aromatics</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="12.5"
                  className="w-full px-3 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black text-sm focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-1">
                  Unit
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as any)}
                  className="w-full px-2 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black text-sm focus:outline-none focus:border-black"
                >
                  <option value="kg">kg</option>
                  <option value="L">L</option>
                  <option value="portions">portions</option>
                  <option value="trays">trays</option>
                  <option value="bunches">bunches</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-1">
                Kitchen Station
              </label>
              <select
                value={station}
                onChange={(e) => setStation(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black text-sm focus:outline-none focus:border-black"
              >
                <option value="Prep Station">Prep Station</option>
                <option value="Cold Larder">Cold Larder</option>
                <option value="Hot Line">Hot Line</option>
                <option value="Pastry & Bakery">Pastry & Bakery</option>
                <option value="Buffet / Banquet">Buffet / Banquet</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-1">
                Storage Method
              </label>
              <select
                value={storage}
                onChange={(e) => setStorage(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black text-sm focus:outline-none focus:border-black"
              >
                <option value="Walk-in Chiller">Walk-in Chiller (&lt;4°C)</option>
                <option value="Deep Freeze">Deep Freeze (&lt;-18°C)</option>
                <option value="Ambient Dry Store">Ambient Dry Store</option>
                <option value="Blast Chiller">Blast Chiller</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-1">
                Hours Left
              </label>
              <input
                type="number"
                value={shelfLifeHours}
                onChange={(e) => setShelfLifeHours(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black text-sm focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-2 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black text-sm focus:outline-none focus:border-black"
              >
                <option value="optimal">Optimal</option>
                <option value="use_soon">Use Soon</option>
                <option value="zero_waste_critical">Critical (&lt;12h)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-1">
                Cost ($)
              </label>
              <input
                type="number"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black text-sm focus:outline-none focus:border-black"
              />
            </div>
          </div>

          {matchedRecipe && (
            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center space-x-2 text-xs text-emerald-900">
              <Sparkles className="w-4 h-4 text-emerald-700 flex-shrink-0" />
              <div>
                <strong>Suggested Upcycle Formula:</strong> {matchedRecipe.title} (+${matchedRecipe.costSavingsPerKg}/kg margin).
              </div>
            </div>
          )}

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
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-black text-white hover:bg-neutral-800"
            >
              Log to Station
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
