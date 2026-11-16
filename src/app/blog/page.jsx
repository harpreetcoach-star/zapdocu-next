import Link from 'next/link';
import ResourcePage from '@/components/ResourcePage';

export const metadata = {
  title: 'PDF Articles & Document Workflows | ZapDocu',
  description: 'Practical advice on organizing PDF documents, choosing compression settings and protecting files with passwords.',
  alternates: { canonical: 'https://zapdocu.com/blog' },
};

export default function ArticlesPage() {
  return (
    <ResourcePage title="Articles & document workflows" description="Practical reading to help you choose the right PDF workflow.">
      <article className="space-y-3">
        <h2 className="text-xl font-semibold text-white">Organize pages before combining documents</h2>
        <p>Check page order and orientation before sharing a combined document. Merge the source files, then use the rearrange tool to put pages in order and remove duplicates. Keep a copy of the original files so you can return to them later.</p>
        <Link href="/tools/merge-pdf" className="text-cyan-400 underline underline-offset-4 hover:text-cyan-200">Open Merge PDF</Link>
      </article>
      <article className="space-y-3">
        <h2 className="text-xl font-semibold text-white">Understand the tradeoffs of PDF compression</h2>
        <p>ZapDocu compresses PDFs by rendering their pages as images. This can reduce file size, but searchable text, editable forms and other interactive content may be lost. Try the recommended setting first and inspect the downloaded document before replacing your original.</p>
        <Link href="/tools/compress-pdf" className="text-cyan-400 underline underline-offset-4 hover:text-cyan-200">Explore PDF compression</Link>
      </article>
      <article className="space-y-3">
        <h2 className="text-xl font-semibold text-white">Use an open password for confidential PDFs</h2>
        <p>Password encryption requires the recipient to enter a password before opening the document. Choose a strong password, share it separately from the file, and test the downloaded PDF in the reader your recipient uses. Printing and copying restrictions depend on reader support.</p>
        <Link href="/tools/protect-pdf" className="text-cyan-400 underline underline-offset-4 hover:text-cyan-200">Protect a PDF</Link>
      </article>
    </ResourcePage>
  );
}
