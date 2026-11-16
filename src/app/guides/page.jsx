import Link from 'next/link';
import ResourcePage from '@/components/ResourcePage';

export const metadata = {
  title: 'PDF Guides: Merge, Extract & Protect Documents | ZapDocu',
  description: 'Step-by-step guides for merging PDF files, extracting pages and adding a password with ZapDocu.',
  alternates: { canonical: 'https://zapdocu.com/guides' },
};

const guides = [
  { title: 'Merge PDF files', href: '/tools/merge-pdf', steps: ['Select the PDF files you want to combine.', 'Use the ordering controls to arrange the files.', 'Run the merge, download the result and check the page order.'] },
  { title: 'Extract selected pages', href: '/tools/extract-pages', steps: ['Choose your source PDF and wait for the page previews.', 'Select the pages you want to keep.', 'Extract and download the new PDF, then check that it contains the intended pages.'] },
  { title: 'Add a PDF open password', href: '/tools/protect-pdf', steps: ['Choose an unencrypted PDF.', 'Enter and confirm your password, then select Encrypt & Protect PDF.', 'Download the protected document and reopen it to check the password prompt. Keep the password somewhere safe.'] },
];

export default function GuidesPage() {
  return (
    <ResourcePage title="PDF guides" description="Follow these short workflows to organize and protect your documents in your browser.">
      {guides.map(guide => (
        <section key={guide.href} className="space-y-3">
          <h2 className="text-xl font-semibold text-white">{guide.title}</h2>
          <ol className="list-decimal pl-6 space-y-2">{guide.steps.map(step => <li key={step}>{step}</li>)}</ol>
          <Link href={guide.href} className="inline-block text-cyan-400 underline underline-offset-4 hover:text-cyan-200">Open tool</Link>
        </section>
      ))}
    </ResourcePage>
  );
}
