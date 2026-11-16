import Link from 'next/link';
import ResourcePage from '@/components/ResourcePage';

export const metadata = {
  title: 'Security & Privacy Whitepaper | ZapDocu',
  description: 'How ZapDocu processes documents locally, protects PDFs with passwords, and handles browser dependencies and limitations.',
  alternates: { canonical: 'https://zapdocu.com/security' },
};

export default function SecurityPage() {
  return (
    <ResourcePage title="Security & privacy whitepaper" description="An overview of the document-processing model and its practical boundaries. This document describes the implementation; it is not an independent security certification.">
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">Local document processing</h2>
        <p>ZapDocu processes selected files in the browser using JavaScript, browser memory and, where needed, canvas rendering. Document operations do not require uploading the file to a processing server. Downloaded results are created locally as browser files.</p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">Application and library downloads</h2>
        <p>Your browser connects to the website to download application code and assets. Some tools also load processing libraries from a third-party CDN. Those requests are distinct from document processing. Network providers may receive ordinary request information, such as your IP address, and on-demand libraries require connectivity.</p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">PDF password encryption</h2>
        <p>Protect PDF uses AES-256 standard PDF encryption, revision 6, with a password required to open the output. Encryption uses Web Crypto on HTTPS or localhost. A randomly generated owner password separates permission settings from the open password. Printing and copying restrictions rely on reader behavior and should not be treated as a guarantee against extraction by someone who can open the file.</p>
        <p>Passwords are not sent to a document-processing server or saved by the protection tool. Keep your password safe: ZapDocu does not provide password recovery. Existing encrypted inputs are rejected to avoid encrypting ciphertext a second time.</p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">Device storage and usage limits</h2>
        <p>The application stores daily usage counters in browser local storage. Files you download remain wherever your browser saves them. Local processing does not provide secure erasure of browser memory, downloads or operating-system caches.</p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">Practical limits</h2>
        <p>Use a trusted device, an updated browser and a secure connection. Browser extensions, compromised devices or modified application code can affect confidentiality. Keep original files and verify output before sharing it; transformations may change document features, and rewriting a signed PDF can invalidate its digital signature.</p>
        <Link href="/privacy" className="text-cyan-400 underline underline-offset-4 hover:text-cyan-200">Read the Privacy Policy</Link>
      </section>
    </ResourcePage>
  );
}
