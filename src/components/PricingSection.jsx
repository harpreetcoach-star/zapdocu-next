'use client';

import React from 'react';
import { Check, Sparkles, Zap, Shield, Lock } from 'lucide-react';

export default function PricingSection({ onSelectPlan }) {
  // Direct Stripe Payment Link handler
  const handleUpgrade = () => {
    const stripePaymentUrl = 'https://buy.stripe.com/28E5kwfMC88Y4pqfba9bO00';
    
    if (stripePaymentUrl && stripePaymentUrl.includes('buy.stripe.com')) {
      window.location.href = stripePaymentUrl; // Redirects user straight to your Stripe checkout page
    } else {
      alert('Stripe Payment Link is not configured yet.');
    }
  };

  return (
    <section id="pricing" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Simple, Transparent Pricing</h2>
        <p className="mt-4 text-slate-400">Choose the right tier for your document workflows. Always client-side secure.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Tier */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 flex flex-col justify-between shadow-xl">
          <div>
            <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 mb-4">Free Tier</div>
            <h3 className="text-2xl font-bold text-white">Basic Tools</h3>
            <p className="text-slate-400 text-sm mt-2">Perfect for quick, everyday PDF and image adjustments.</p>
            <div className="my-6">
              <span className="text-4xl font-extrabold text-white">$0</span>
              <span className="text-slate-400 ml-2">/ forever</span>
            </div>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Standard PDF & Image Tools</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> 100% Client-Side Privacy</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Ad-supported experience</li>
            </ul>
          </div>
          <button 
            onClick={() => onSelectPlan ? onSelectPlan('free') : (window.location.href = '/')}
            className="mt-8 w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            Get Started Free
          </button>
        </div>

        {/* Pro Tier */}
        <div className="bg-gradient-to-b from-indigo-950/40 to-slate-900/60 border-2 border-indigo-500/50 rounded-2xl p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-gradient-to-l from-indigo-600 to-cyan-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl">Popular</div>
          <div>
            <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 mb-4 border border-indigo-500/30">Pro Pass</div>
            <h3 className="text-2xl font-bold text-white">ZapDocu Pro</h3>
            <p className="text-slate-400 text-sm mt-2">Unlimited power-tools with zero ads and advanced batch processing.</p>
            <div className="my-6">
              <span className="text-4xl font-extrabold text-white">$4.99</span>
              <span className="text-slate-400 ml-2">/ month</span>
            </div>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-400" /> Zero Advertisements</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-400" /> Batch Processing & Conversion</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-400" /> Priority In-Browser Rendering</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-400" /> Unlimited File Sizes</li>
            </ul>
          </div>
          <div>
            <button 
              onClick={() => {
                if (onSelectPlan) onSelectPlan('pro');
                handleUpgrade();
              }}
              className="mt-8 w-full bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-medium py-2.5 rounded-xl shadow-lg shadow-indigo-500/25 transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Upgrade to Pro</span>
            </button>
            <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>Secure checkout via Stripe • Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}