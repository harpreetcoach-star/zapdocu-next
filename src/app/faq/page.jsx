import ResourcePage from '@/components/ResourcePage';
import { ChevronDown } from 'lucide-react';

export const metadata = {
  title: 'PDF Tool FAQ: Privacy, File Limits & Processing | ZapDocu',
  description: 'Learn how ZapDocu processes PDF files in your browser, what the daily file limit means, how AES-256 protection works and what to expect from large files.',
  alternates: { canonical: 'https://zapdocu.com/faq' },
};

const questions = [
  {
    question: 'Are my documents uploaded to ZapDocu?',
    answer: 'Selected documents are processed locally in your browser; the processing tools do not upload them to a ZapDocu document server. Your browser still downloads the website and its code, and some tools load processing libraries from a CDN. Those resource requests are separate from your document.',
  },
  {
    question: 'How does a browser-based PDF tool work?',
    answer: 'Choose a tool, select a file and follow its on-screen steps. The browser reads the selected file, performs the supported operation in local memory, then creates a result for you to download. Some tools need to load a processing library before they are ready, so an internet connection may be needed.',
  },
  {
    question: 'Is there a daily file limit?',
    answer: 'The current free tier allows up to 50 file operations per day. The usage counter is stored in your browser, so it is local to that browser and device. The number of files counted can depend on the operation—for example, merging several files uses several file operations.',
  },
  {
    question: 'Is there a maximum PDF file size?',
    answer: 'ZapDocu does not set one universal per-file size cap. Processing is limited by the memory and capabilities available to your browser and device. Large files, high-resolution pages or multiple simultaneous files may fail on lower-memory devices; try fewer or smaller files if that happens.',
  },
  {
    question: 'Does Protect PDF require a password to open the result?',
    answer: 'Yes. Protect PDF applies AES-256 PDF encryption and asks you to set an open password. Encryption requires a secure browser context such as HTTPS or localhost. Keep the password safe: ZapDocu cannot recover it for you.',
  },
  {
    question: 'Can I protect a PDF that is already encrypted?',
    answer: 'No. The protection tool rejects already-encrypted input rather than encrypting it a second time. If you are authorized to edit the document, unlock it first and then apply a new open password.',
  },
  {
    question: 'Will PDF compression preserve searchable text and forms?',
    answer: 'The compression tool renders PDF pages as images to reduce file size. Searchable text, form fields, links and other interactive features may not survive. Keep the original and inspect the compressed file before sharing it.',
  },
  {
    question: 'Can ZapDocu recover a forgotten PDF password?',
    answer: 'No. Store your password securely and keep an original copy of important documents. Password recovery is not available.',
  },
  {
    question: 'Can I use ZapDocu completely offline?',
    answer: 'Offline use is not guaranteed. The website and any required processing libraries must be available to your browser; some tools load libraries on demand. Open the tool while connected before relying on it offline.',
  },
];

export default function FAQPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };

  return (
    <ResourcePage title="PDF tool FAQ" description="Understand how ZapDocu handles your files, daily usage and common PDF workflows before you get started.">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <div className="divide-y divide-slate-800 rounded-2xl border border-slate-800 bg-slate-900/50 px-5 sm:px-7">
        {questions.map(({ question, answer }, index) => (
          <details key={question} className="group py-5 first:pt-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-white marker:text-cyan-400 hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400 [&::-webkit-details-marker]:hidden">
              <span>
                <span className="mr-3 text-xs font-bold tracking-widest text-cyan-500">{String(index + 1).padStart(2, '0')}</span>
                {question}
              </span>
              <ChevronDown aria-hidden="true" className="h-4 w-4 shrink-0 text-cyan-400 transition-transform group-open:rotate-180" />
            </summary>
            <p className="max-w-3xl pl-9 pt-3 text-sm leading-relaxed text-slate-400">{answer}</p>
          </details>
        ))}
      </div>
    </ResourcePage>
  );
}
