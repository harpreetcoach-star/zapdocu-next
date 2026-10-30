'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-slate-950/80 backdrop-blur-sm border-b border-slate-800/80 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          {/* Make sure your official logo is saved as public/logo.png */}
          <Image 
            src="/logo.png" 
            alt="ZapDocu Logo" 
            width={36} 
            height={36} 
            className="object-contain"
            priority 
          />
          <span className="font-extrabold text-2xl tracking-tighter text-white">
            Zap<span className="text-cyan-400 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-cyan-500">Docu</span>
          </span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Link href="/#pricing" className="text-sm text-slate-300 hover:text-white transition-colors">
            Pricing
          </Link>
          <button 
            onClick={() => {
              window.location.href = 'https://buy.stripe.com/28E5kwfMC88Y4pqfba9bO00';
            }}
            className="text-xs px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-full font-semibold shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-cyan-500 transition-all transform hover:scale-105 cursor-pointer"
          >
            Upgrade to Pro
          </button>
        </div>
      </nav>
    </header>
  );
}