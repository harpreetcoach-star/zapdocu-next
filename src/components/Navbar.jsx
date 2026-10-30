'use client';

import React from 'react';
import Image from 'next/image';
import { Sparkles, Lock } from 'lucide-react';

export default function Navbar({ onOpenPaywall, onSelectTool }) {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-800">
      {/* Increased header height from h-16 to h-20 for a bigger logo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Larger custom logo graphic */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectTool('rotate-pdf')}>
          <Image 
            src="/logo.png" 
            alt="ZapDocu Logo" 
            width={220} 
            height={70} 
            className="h-14 w-auto object-contain" 
            priority 
          />
          <span className="hidden sm:inline-block ml-2 text-[10px] uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-full font-semibold">100% Client-Side</span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button onClick={() => onSelectTool('rotate-pdf')} className="hover:text-indigo-400 transition-colors cursor-pointer">PDF Tools</button>
          <button onClick={() => onSelectTool('image-tools')} className="hover:text-indigo-400 transition-colors cursor-pointer">Image Tools</button>
          <a href="#pricing" className="hover:text-indigo-400 transition-colors">Pricing & Pro</a>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Files never leave your device</span>
          </div>
          <button 
            onClick={onOpenPaywall}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-medium px-4 py-2.5 rounded-xl text-sm shadow-lg shadow-indigo-500/25 transition-all transform active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Upgrade Pro</span>
          </button>
        </div>
      </div>
    </header>
  );
}