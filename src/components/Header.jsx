'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  // The homepage has its own navigation with tool-selection callbacks.
  if (pathname === '/') return null;

  return (
    <header className="sticky top-0 z-50 shrink-0 border-b border-slate-800 bg-slate-950">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="ZapDocu home"
          className="group flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-lg shadow-cyan-500/20 transition-transform group-hover:scale-105">
            <Zap className="h-5 w-5 fill-white text-white" />
          </span>
          <span className="text-2xl font-extrabold tracking-tighter text-white">
            Zap<span className="text-cyan-400">Docu</span>
          </span>
        </Link>

        <nav aria-label="Page navigation" className="flex items-center gap-3 sm:gap-6">
          <Link
            href="/#tools"
            className="rounded-lg px-2 py-2 text-sm font-semibold text-slate-300 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
          >
            All tools
          </Link>
          <Link
            href="/guides"
            className="hidden rounded-lg px-2 py-2 text-sm text-slate-400 transition-colors hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 sm:inline-flex"
          >
            Guides
          </Link>
          <Link
            href="/faq"
            className="hidden rounded-lg px-2 py-2 text-sm text-slate-400 transition-colors hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 sm:inline-flex"
          >
            FAQ
          </Link>
        </nav>
      </div>
    </header>
  );
}
