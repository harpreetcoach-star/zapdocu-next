export const metadata = {
  title: 'Privacy Policy | ZapDocu',
  description: 'ZapDocu privacy policy. Learn how our 100% client-side, browser RAM architecture guarantees your documents never leave your device.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-extrabold text-white">Privacy Policy</h1>
        <p className="text-sm text-slate-400">Last updated: October 2026</p>

        <section className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <h2 className="text-lg font-semibold text-white pt-4">1. Zero Cloud Uploads & Client-Side Processing</h2>
          <p>
            ZapDocu is built as a 100% client-side platform. All document processing, merging, splitting, compressing, and conversions happen entirely within your browser&apos;s local memory (RAM). Your files are never uploaded to our servers, stored in databases, or viewed by third parties.
          </p>

          <h2 className="text-lg font-semibold text-white pt-4">2. Data Collection</h2>
          <p>
            We do not collect or retain copies of your documents. For subscription management and payments, we use Stripe, which securely processes billing details according to their own strict privacy standards.
          </p>

          <h2 className="text-lg font-semibold text-white pt-4">3. Local Storage</h2>
          <p>
            We may use local browser storage strictly to track your daily free-tier usage limits locally on your device hardware.
          </p>
        </section>
      </div>
    </main>
  );
}