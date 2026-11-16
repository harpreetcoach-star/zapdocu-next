import Link from 'next/link';
import ResourcePage from '@/components/ResourcePage';

export const metadata = {
  title: 'PDF Guides: Merge, Extract & Protect Documents | ZapDocu',
  description: 'Step-by-step guides for merging PDF files, extracting pages and adding a password with ZapDocu.',
  alternates: { canonical: 'https://zapdocu.com/guides' },
};

const guides = [
  {
    category: 'Combine documents',
    title: 'How to merge PDF files',
    description: 'Combine several documents into one PDF while keeping the files in their original order.',
    href: '/tools/merge-pdf',
    steps: ['Open Merge PDF and select the files to combine.', 'Arrange the file order using the on-screen controls.', 'Merge, download the new PDF and check its page order.'],
  },
  {
    category: 'PDF security',
    title: 'How to protect a PDF with AES-256',
    description: 'Add an open password to an unencrypted PDF using browser-based AES-256 encryption.',
    href: '/tools/protect-pdf',
    steps: ['Open Protect PDF and choose an unencrypted PDF.', 'Enter and confirm a strong open password you can store safely.', 'Select Encrypt & Protect PDF, download the result and test its password prompt.'],
  },
  {
    category: 'Extract pages',
    title: 'How to extract selected PDF pages',
    description: 'Create a new PDF containing only the pages you need to share or archive.',
    href: '/tools/extract-pages',
    steps: ['Select a PDF and wait for the page previews to load.', 'Choose the pages to include in the new document.', 'Extract, download and verify the resulting page selection.'],
  },
];

export default function GuidesPage() {
  return (
    <ResourcePage title="PDF guides and tutorials" description="Step-by-step tutorials for common document workflows. Follow the checklist, then open the matching tool to process your files in your browser.">
      <div className="grid gap-5 md:grid-cols-2">
        {guides.map((guide, index) => (
          <article key={guide.href} className="flex flex-col gap-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">{guide.category} <span className="text-slate-600">/ {String(index + 1).padStart(2, '0')}</span></p>
              <h2 className="text-xl font-semibold text-white">{guide.title}</h2>
              <p className="text-sm leading-relaxed text-slate-400">{guide.description}</p>
            </div>
            <ol className="flex-1 list-decimal space-y-2 pl-5 text-sm text-slate-300 marker:font-semibold marker:text-cyan-500">
              {guide.steps.map(step => <li key={step} className="pl-1">{step}</li>)}
            </ol>
            <Link
              href={guide.href}
              className="inline-flex w-fit items-center rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-300 transition-colors hover:border-cyan-400/60 hover:bg-cyan-500/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
            >
              Open tool <span aria-hidden="true" className="ml-2">→</span>
            </Link>
          </article>
        ))}
      </div>
    </ResourcePage>
  );
}
