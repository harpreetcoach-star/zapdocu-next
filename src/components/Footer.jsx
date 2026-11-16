'use client';

import React from 'react';
import Link from 'next/link';
import { Zap } from 'lucide-react';
import FooterLink from './FooterLink';
import FooterLinkColumn from './FooterLinkColumn';
import { footerColumns, connectLegalLinks, developerCredit } from '@/data/footerData';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-x-8 gap-y-10 pb-12 border-b border-slate-800/50">
        
        {/* Column 1: Brand & Privacy Guarantee */}
        <div className="space-y-4 sm:col-span-2 xl:col-span-1">
          <Link href="/" className="flex flex-col items-start gap-2.5 group w-fit cursor-pointer">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="font-extrabold text-2xl tracking-tighter text-white">
                Zap<span className="text-cyan-400">Docu</span>
              </span>
            </div>
            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider shadow-sm">
              100% Client-Side
            </span>
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed">
            ZapDocu operates entirely in-browser. Your confidential files are never uploaded to any remote server or third party.
          </p>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
            <span>🔒</span> SSL Encrypted Client Processing
          </div>
        </div>

        {footerColumns.map(column => <FooterLinkColumn key={column.id} column={column} />)}

        {/* Column 5: Connect & Socials */}
        <div className="space-y-3">
          <h3 className="text-white font-semibold text-sm tracking-wider uppercase">Connect</h3>
          <div className="flex flex-wrap items-center gap-3 text-slate-400 pt-1">
            
            {connectLegalLinks.connect.map(item => (
              <FooterLink key={item.href} item={item} className="bg-slate-900 border border-slate-800 p-2 rounded-lg hover:text-white hover:border-slate-700">
                {item.iconPath ? <svg aria-hidden="true" viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d={item.iconPath} /></svg> : item.label}
              </FooterLink>
            ))}

          </div>
          <p className="text-[11px] text-slate-500 pt-2">
            Privacy-first SaaS platform.
          </p>
        </div>

      </div>

      {/* Bottom Bar: Copyright & Legal Links */}
      <div className="max-w-7xl mx-auto pt-6 flex flex-col lg:flex-row items-center lg:items-start justify-between gap-x-12 gap-y-6 text-xs text-slate-400">
        <div className="min-w-0 space-y-2 text-center lg:text-left leading-relaxed">
          <p className="font-medium text-slate-300">© 2026 ZapDocu.com</p>
          <div className="flex flex-wrap justify-center lg:justify-start gap-x-4 gap-y-1">
            <span>Powered by ZapDocu SecureClient™ Engine</span>
            <span>Secured by Stripe &amp; Cloudflare</span>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-center lg:items-end gap-2 leading-relaxed">
          <nav aria-label="Legal" className="flex flex-wrap items-center justify-center lg:justify-end gap-x-6 gap-y-2">
            {connectLegalLinks.legal.map(item => <FooterLink key={item.href} item={item} className="whitespace-nowrap hover:text-cyan-300" />)}
          </nav>
          <p className="whitespace-nowrap">
            Engineered by{' '}
            <FooterLink item={developerCredit} className="font-semibold text-cyan-400 underline underline-offset-4 hover:text-cyan-200" />
          </p>
        </div>
      </div>
    </footer>
  );
}
