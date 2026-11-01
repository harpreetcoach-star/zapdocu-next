'use client';

import React from 'react';
import Link from 'next/link';

export default function Navbar({ onOpenPaywall, onSelectTool }) {
  return (
    <header className="bg-slate-950/80 backdrop-blur-sm border-b border-slate-800/80 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center group cursor-pointer">
          <img 
            src="/Logo.png" 
            alt="ZapDocu Logo" 
            className="h-8 w-auto object-contain group-hover:scale-105 transition-transform" 
          />
        </Link>
        
        <div className="flex items-center gap-6">
          <button 
            onClick={() => onSelectTool('merge-pdf')}
            className="text-sm text-slate-300 hover:text-white transition-colors hidden sm:block"
          >
            PDF Tools
          </button>
          <button 
            onClick={() => onSelectTool('image-resizer')}
            className="text-sm text-slate-300 hover:text-white transition-colors hidden sm:block"
          >
            Image Tools
          </button>
          <button 
            onClick={onOpenPaywall}
            className="text-sm text-slate-300 hover:text-white transition-colors"
          >
            Pricing & Pro
          </button>
          <a 
            href="https://buy.stripe.com/28E5kwfMC88Y4pqfba9bO00"
            className="text-xs px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-full font-semibold shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-cyan-500 transition-all transform hover:scale-105 no-underline block"
          >
            Upgrade to Pro
          </a>
        </div>
      </nav>
    </header>
  );
}