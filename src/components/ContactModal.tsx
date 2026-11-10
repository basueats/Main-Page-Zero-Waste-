import React, { useState } from 'react';
import { X, ChefHat, Building, Users, CheckCircle, ArrowRight } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTopic?: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  defaultTopic = 'Commercial Kitchen Food Waste Audit'
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [property, setProperty] = useState('');
  const [service, setService] = useState(defaultTopic);
  const [teamSize, setTeamSize] = useState('15 - 35 chefs');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2500);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-neutral-200 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl text-neutral-900 max-h-[95vh] flex flex-col animate-fadeIn">
        {/* Header */}
        <div className="p-6 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-heading text-neutral-900">
                Contact & Culinary Advisory
              </h2>
              <p className="text-xs text-neutral-500">
                Zero waste by Supritamone • Commercial Culinary Advisory
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

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-heading text-neutral-900">
              Inquiry Received
            </h3>
            <p className="text-xs text-neutral-600 max-w-sm mx-auto leading-relaxed">
              Thank you, {name || 'Chef'}. Our culinary team will review your specifications and contact you within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Full Name"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black text-xs focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-1">
                  Work / F&B Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="director@hotelgroup.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black text-xs focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-1 flex items-center space-x-1">
                <Building className="w-3.5 h-3.5 text-neutral-500" />
                <span>Restaurant / Hotel / Hospitality Group *</span>
              </label>
              <input
                type="text"
                required
                value={property}
                onChange={(e) => setProperty(e.target.value)}
                placeholder="e.g., Grand Hyatt Singapore or The Botanical Bistro"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black text-xs focus:outline-none focus:border-black"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-1">
                  Requested Option
                </label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black text-xs focus:outline-none focus:border-black"
                >
                  <option value="3-Day Free Trial ($0/3 days)">3-Day Free Trial ($0 / 3 days)</option>
                  <option value="Individual Plan ($99/yr)">Individual Plan ($99/yr)</option>
                  <option value="Team Plan ($79/chef/yr)">Team Plan ($79/chef/yr)</option>
                  <option value="Training Advisory ($1,499/yr)">Training Advisory ($1,499/yr)</option>
                  <option value="Commercial Kitchen Food Waste Audit">On-Site Kitchen Audit</option>
                  <option value="Keynote / Masterclass Speaking">Keynote / Masterclass</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-1 flex items-center space-x-1">
                  <Users className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Kitchen Brigade Size</span>
                </label>
                <select
                  value={teamSize}
                  onChange={(e) => setTeamSize(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black text-xs focus:outline-none focus:border-black"
                >
                  <option value="1 - 5 chefs (Boutique)">1 - 5 chefs</option>
                  <option value="5 - 20 chefs (Standard Brigade)">5 - 20 chefs</option>
                  <option value="20 - 50 chefs (Hotel / Multi-outlet)">20 - 50 chefs</option>
                  <option value="50+ chefs (Enterprise / Chain)">50+ chefs</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-1">
                Kitchen Challenges or Goals
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g., We have high prep scrap and buffet overproduction..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black text-xs focus:outline-none focus:border-black"
              />
            </div>

            <div className="pt-2 border-t border-neutral-200 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-600 hover:text-black"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-black text-white hover:bg-neutral-800 transition-all flex items-center space-x-1.5"
              >
                <span>Submit Inquiry</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
