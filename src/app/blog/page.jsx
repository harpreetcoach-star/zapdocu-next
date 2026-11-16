import Link from 'next/link';
import ResourcePage from '@/components/ResourcePage';

export const metadata = {
  title: 'PDF Insights & Document Processing Articles | ZapDocu',
  description: 'Explore upcoming articles on private, client-side PDF processing, document organization, compression tradeoffs and password security.',
  alternates: { canonical: 'https://zapdocu.com/blog' },
};

const articles = [
  {
    category: 'Privacy & processing',
    title: 'What “client-side PDF processing” means for your files',
    excerpt: 'A practical look at how browser-based tools process documents locally, which network requests still happen, and what privacy boundaries to understand.',
    readTime: '5 min read',
  },
  {
    category: 'Document workflows',
    title: 'A better workflow for combining and organizing PDFs',
    excerpt: 'Learn how to plan file order, check page orientation, remove duplicate pages and verify a merged document before sharing it.',
    readTime: '4 min read',
  },
  {
    category: 'PDF compression',
    title: 'PDF compression: file size, image quality and searchable text',
    excerpt: 'Understand the tradeoffs of image-based compression, when to keep the original and how to inspect a smaller PDF before replacing a source file.',
    readTime: '6 min read',
  },
  {
    category: 'Password security',
    title: 'Using AES-256 PDF passwords safely',
    excerpt: 'What an open password does, how to choose and share one safely, and why password recovery and reader permissions have important limits.',
    readTime: '5 min read',
  },
];

export default function ArticlesPage() {
  return (
    <ResourcePage title="ZapDocu insights" description="Ideas and practical guidance for working with documents in your browser. Our upcoming articles focus on privacy-aware PDF workflows, clear compression tradeoffs and safer document sharing.">
      <section aria-labelledby="upcoming-articles">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">From the ZapDocu team</p>
            <h2 id="upcoming-articles" className="mt-2 text-2xl font-bold text-white">Upcoming articles</h2>
          </div>
          <p className="text-sm text-slate-500">New guides and explainers are in the works.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {articles.map(article => (
            <article key={article.title} className="flex min-h-56 flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">{article.category}</span>
                <span className="rounded-full border border-slate-700 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Coming soon</span>
              </div>
              <h3 className="text-lg font-semibold leading-snug text-white">{article.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">{article.excerpt}</p>
              <p className="mt-5 border-t border-slate-800 pt-4 text-xs text-slate-500">{article.readTime}</p>
            </article>
          ))}
        </div>
      </section>
      <aside className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-white">Need a tool now?</h2>
        <p className="mt-2 text-sm text-slate-400">Browse the PDF workflows while these articles are being prepared.</p>
        <Link href="/#tools" className="mt-4 inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400">
          Browse all tools <span aria-hidden="true" className="ml-2">→</span>
        </Link>
      </aside>
    </ResourcePage>
  );
}
