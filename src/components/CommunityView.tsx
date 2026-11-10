import React from 'react';
import { PARTNER_SHELTERS } from '../data/mockData';
import { HeartHandshake, ShieldCheck, Truck, Clock, CheckCircle2 } from 'lucide-react';

interface CommunityViewProps {
  onOpenBroadcastDonation: () => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({ onOpenBroadcastDonation }) => {
  return (
    <div className="min-h-screen bg-[#fafbfc] py-12 px-4 sm:px-6 lg:px-8 text-neutral-900">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            FOOD RESCUE NETWORK
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-neutral-900 tracking-tight">
            Connecting Kitchen Excess with Local Pantries & Shelters
          </h1>
          <p className="text-sm text-neutral-600 leading-relaxed">
            When kitchen prep or banquet overproduction cannot be upcycled internally, our live donation alert protocol dispatches safe, temperature-controlled meals directly to local non-profits within minutes.
          </p>
        </div>

        {/* Hero Callout Banner */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2">
            <span className="text-xs font-bold font-mono text-blue-700 uppercase">
              Live Commercial Integration
            </span>
            <h2 className="text-2xl font-bold font-heading text-neutral-900">
              Have banquet trays or bakery zero waste items ready right now?
            </h2>
            <p className="text-xs text-neutral-500 max-w-xl">
              Broadcast an alert to 4 verified shelters within 5km. Refrigerated transport and volunteer drivers are coordinated automatically.
            </p>
          </div>
          <button
            onClick={onOpenBroadcastDonation}
            className="px-6 py-3.5 rounded-xl text-xs font-bold bg-black text-white hover:bg-neutral-800 shadow-md flex items-center space-x-2 whitespace-nowrap active:scale-95"
          >
            <HeartHandshake className="w-4 h-4 text-emerald-400" />
            <span>Broadcast Rescue Alert Now</span>
          </button>
        </div>

        {/* Verified Partner Shelters */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-neutral-900">
                Local Partner Shelters & Kitchens
              </h2>
              <p className="text-xs text-neutral-500">Inspected & cold-chain verified for immediate pickup</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PARTNER_SHELTERS.map((s) => (
              <div key={s.id} className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-4 hover:border-black transition-all shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-neutral-900">{s.name}</h3>
                    <p className="text-xs text-neutral-500">{s.organizationType}</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-700 px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200">
                    {s.distance} away
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-neutral-50 p-3 rounded-xl border border-neutral-200/80">
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase font-bold">Capacity</span>
                    <p className="text-neutral-900 font-bold">{s.capacityPerDay}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase font-bold">Coordinator</span>
                    <p className="text-neutral-900 font-bold truncate">{s.contactPerson}</p>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-neutral-500 uppercase font-bold">Priority Needs:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {s.urgentNeeds.map((need, i) => (
                      <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-neutral-100 text-neutral-700">
                        {need}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <span className="text-neutral-500 flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1 text-black" />
                    {s.pickupAvailability}
                  </span>
                  <button
                    onClick={onOpenBroadcastDonation}
                    className="text-black font-bold hover:underline"
                  >
                    Direct Dispatch →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FOOD SAFETY & LEGAL COMPLIANCE */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-8 space-y-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading text-neutral-900">
                Food Safety SOPs & Donor Protection
              </h3>
              <p className="text-xs text-neutral-500">
                Zero waste by Supritamone ensures all kitchen food rescue donations adhere to strict regulatory hygiene
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-neutral-600">
            <div className="bg-neutral-50 p-5 rounded-2xl space-y-2 border border-neutral-200/80">
              <h4 className="text-sm font-bold text-neutral-900 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Good Samaritan Liability</span>
              </h4>
              <p className="leading-relaxed">
                Hotels and culinary operations donating wholesome unserved food in good faith are shielded from civil and criminal liability under established food donation statutes.
              </p>
            </div>

            <div className="bg-neutral-50 p-5 rounded-2xl space-y-2 border border-neutral-200/80">
              <h4 className="text-sm font-bold text-neutral-900 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Cold-Chain Validation</span>
              </h4>
              <p className="leading-relaxed">
                All cooked donations must be blast-chilled to below 4°C within 90 minutes of service, sealed in food-grade cambros, and date-stamped prior to handoff.
              </p>
            </div>

            <div className="bg-neutral-50 p-5 rounded-2xl space-y-2 border border-neutral-200/80">
              <h4 className="text-sm font-bold text-neutral-900 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Tax & CSR Receipts</span>
              </h4>
              <p className="leading-relaxed">
                Every completed donation generates an automated tax deduction certificate and carbon offset manifest for corporate ESG and sustainability board reporting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
