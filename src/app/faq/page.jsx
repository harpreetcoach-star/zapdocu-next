import ResourcePage from '@/components/ResourcePage';

export const metadata = {
  title: 'Frequently Asked Questions | ZapDocu',
  description: 'Answers about local PDF processing, browser requirements, password protection and PDF compression in ZapDocu.',
  alternates: { canonical: 'https://zapdocu.com/faq' },
};

const questions = [
  ['Are my documents uploaded?', 'The tools process selected documents locally in your browser. The website downloads application code and some processing libraries, but document processing does not require uploading your files.'],
  ['Can I use ZapDocu offline?', 'Load the website and required processing libraries while connected first. Some tools load libraries on demand, so a fully offline workflow is not guaranteed.'],
  ['Does Protect PDF require a password to open the result?', 'Yes. Protect PDF applies AES-256 encryption with an open password. Use HTTPS or localhost so browser encryption is available. Already-encrypted PDFs must have their existing protection removed before they can be protected again.'],
  ['Can ZapDocu recover a forgotten PDF password?', 'No. Keep your password in a safe place and retain an original copy of the document if you need one.'],
  ['Will compression keep searchable text and forms?', 'The compression tool renders PDF pages as images. Searchable text, form fields and interactive content may not survive. Keep the original and check the result before sharing it.'],
  ['Why might a large file fail to process?', 'Processing uses your device’s available browser memory. Large documents or high-resolution pages may exceed that memory, especially on mobile devices. Try a smaller document or a device with more available memory.'],
];

export default function FAQPage() {
  return (
    <ResourcePage title="Frequently asked questions" description="Answers to common questions about working with documents in ZapDocu.">
      <div className="divide-y divide-slate-800">
        {questions.map(([question, answer]) => (
          <details key={question} className="py-5 first:pt-0">
            <summary className="cursor-pointer font-semibold text-white hover:text-cyan-300">{question}</summary>
            <p className="pt-3 text-slate-400">{answer}</p>
          </details>
        ))}
      </div>
    </ResourcePage>
  );
}
