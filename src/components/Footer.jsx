'use client';

import React from 'react';
import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800/50">
        
        {/* Column 1: Brand & Privacy Guarantee */}
        <div className="space-y-4 md:col-span-1">
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

        {/* Column 2: PDF Suite (Tools 1-9) */}
        <div className="space-y-3">
          <h3 className="text-white font-semibold text-sm tracking-wider uppercase">PDF Suite</h3>
          <ul className="space-y-2 text-xs">
            <li><Link href="/tools/merge-pdf" className="hover:text-white transition-colors">Merge PDF</Link></li>
            <li><Link href="/tools/split-pdf" className="hover:text-white transition-colors">Split PDF</Link></li>
            <li><Link href="/tools/rearrange-pdf" className="hover:text-white transition-colors">Rearrange PDF</Link></li>
            <li><Link href="/tools/rotate-pdf" className="hover:text-white transition-colors">Rotate PDF</Link></li>
            <li><Link href="/tools/extract-pages" className="hover:text-white transition-colors">Extract Pages</Link></li>
            <li><Link href="/tools/watermark-pdf" className="hover:text-white transition-colors">Watermark PDF</Link></li>
            <li><Link href="/tools/compress-pdf" className="hover:text-white transition-colors">Compress PDF</Link></li>
            <li><Link href="/tools/pdf-to-word" className="hover:text-white transition-colors">PDF to Word</Link></li>
            <li><Link href="/tools/word-to-pdf" className="hover:text-white transition-colors">Word to PDF</Link></li>
          </ul>
        </div>

        {/* Column 3: Conversions & Image/Security Tools (Tools 10-18) */}
        <div className="space-y-3">
          <h3 className="text-white font-semibold text-sm tracking-wider uppercase">Conversions & Security</h3>
          <ul className="space-y-2 text-xs">
            <li><Link href="/tools/excel-to-pdf" className="hover:text-white transition-colors">Excel to PDF</Link></li>
            <li><Link href="/tools/pdf-to-jpg" className="hover:text-white transition-colors">PDF to JPG</Link></li>
            <li><Link href="/tools/jpg-to-pdf" className="hover:text-white transition-colors">JPG to PDF</Link></li>
            <li><Link href="/tools/heic-to-jpg" className="hover:text-white transition-colors">HEIC to JPG</Link></li>
            <li><Link href="/tools/add-page-numbers" className="hover:text-white transition-colors">Add Page Numbers</Link></li>
            <li><Link href="/tools/protect-pdf" className="hover:text-white transition-colors">Protect PDF</Link></li>
            <li><Link href="/tools/unlock-pdf" className="hover:text-white transition-colors">Unlock PDF</Link></li>
            <li><Link href="/tools/image-resizer" className="hover:text-white transition-colors">Image Resizer</Link></li>
            <li><Link href="/tools/webp-converter" className="hover:text-white transition-colors">WEBP Converter</Link></li>
          </ul>
        </div>

        {/* Column 4: Connect & Socials */}
        <div className="space-y-3">
          <h3 className="text-white font-semibold text-sm tracking-wider uppercase">Connect</h3>
          <div className="flex items-center gap-3 text-slate-400 pt-1">
            
            {/* X / Twitter */}
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="ZapDocu on X" className="bg-slate-900 border border-slate-800 p-2 rounded-lg hover:text-white hover:border-slate-700 transition-all">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>

            {/* LinkedIn */}
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="ZapDocu on LinkedIn" className="bg-slate-900 border border-slate-800 p-2 rounded-lg hover:text-white hover:border-slate-700 transition-all">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
            </a>

            {/* YouTube */}
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="ZapDocu on YouTube" className="bg-slate-900 border border-slate-800 p-2 rounded-lg hover:text-white hover:border-slate-700 transition-all">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>

          </div>
          <p className="text-[11px] text-slate-500 pt-2">
            Privacy-first SaaS platform.
          </p>
        </div>

      </div>

      {/* Bottom Bar: Copyright & Legal Links */}
      <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>© 2026 ZapDocu.com • Powered by ZapDocu SecureClient™ Engine • Secured by Stripe & Cloudflare.</p>
        
        <div className="flex items-center gap-6">
          <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-slate-300 transition-colors">Stripe Terms</Link>
        </div>
      </div>
    </footer>
  );
}