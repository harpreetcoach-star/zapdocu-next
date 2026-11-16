
export const metadata = {
  title: 'Terms of Service | ZapDocu',
  description: 'Review ZapDocu terms of service, user usage guidelines, and subscription policies.',
};

export default function TermsPage() {
  return (
    <>
      <section className="min-h-screen bg-slate-950 px-4 py-16 text-slate-100 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-6">
          <h1 className="text-3xl font-extrabold text-white">Terms of Service</h1>
          <p className="text-sm text-slate-400">Last updated: October 2026</p>

          <section className="space-y-4 text-sm leading-relaxed text-slate-300">
            <h2 className="pt-4 text-lg font-semibold text-white">1. Acceptance of Terms</h2>
            <p>
              By accessing or using ZapDocu, you agree to be bound by these terms. If you do not agree, please do not use our client-side document tools.
            </p>

            <h2 className="pt-4 text-lg font-semibold text-white">2. Pro Subscriptions & Payments</h2>
            <p>
              ZapDocu Pro subscriptions are billed on a recurring monthly basis (US$4.99/mo) via Stripe. You can cancel your subscription at any time through your billing portal link.
            </p>

            <h2 className="pt-4 text-lg font-semibold text-white">3. User Responsibility</h2>
            <p>
              Because tools operate locally in your browser, you are solely responsible for keeping backup copies of your important files and documents.
            </p>
          </section>
        </div>
      </section>
    </>
  );
}