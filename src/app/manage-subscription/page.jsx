import Link from 'next/link';
import { ArrowUpRight, CreditCard, FileText, Layers, ShieldCheck, CircleCheck } from 'lucide-react';

export const metadata = {
  title: 'Manage Your ZapDocu Subscription | ZapDocu',
  description: 'Access the secure Stripe billing portal to manage your ZapDocu subscription, payment methods and invoices.',
  alternates: { canonical: 'https://zapdocu.com/manage-subscription' },
};

const portalFeatures = [
  { title: 'Update Payment Methods', description: 'Add or change credit cards securely.', icon: CreditCard },
  { title: 'Modify or Upgrade Plans', description: 'Seamlessly switch tiers.', icon: Layers },
  { title: 'Cancel Anytime', description: 'Direct, friction-free cancellation.', icon: CircleCheck },
  { title: 'View & Download Invoices', description: 'Access past billing receipts.', icon: FileText },
];

export default function ManageSubscriptionPage() {
  return (
    <section className="bg-[#0B0F19] px-4 py-12 text-slate-100 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-10">
        <div className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center shadow-xl sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#635BFF]/15 text-indigo-300">
            <ShieldCheck aria-hidden="true" className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Manage Your ZapDocu Subscription</h1>
          <p className="mx-auto max-w-xl leading-relaxed text-slate-300">
            ZapDocu uses Stripe&apos;s secure, passwordless customer portal. Simply enter your email address to instantly receive a secure sign-in link.
          </p>
          <a
            href="https://billing.stripe.com/p/login/28E5kwfMC88Y4pqfba9bO00"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#635BFF] px-5 py-3.5 font-semibold text-white transition-colors hover:bg-[#533AFD] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-300 sm:w-auto"
          >
            Open Stripe Billing Portal
            <ArrowUpRight aria-hidden="true" className="h-5 w-5 shrink-0" />
          </a>
          <p className="text-xs leading-relaxed text-slate-400">Opens securely on Stripe in a new tab. Use the email address associated with your subscription.</p>
        </div>

        <section aria-labelledby="portal-features" className="space-y-5">
          <h2 id="portal-features" className="text-center text-xl font-semibold text-white">Your billing, under your control</h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {portalFeatures.map(({ title, description, icon: Icon }) => (
              <li key={title} className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-5">
                <Icon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-indigo-300" />
                <div className="space-y-1">
                  <h3 className="font-semibold text-white">{title}</h3>
                  <p className="text-sm leading-relaxed text-slate-400">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <p className="text-center text-sm leading-relaxed text-slate-400">
          Need help or have questions about your billing? Visit our{' '}
          <Link href="/faq" className="text-cyan-400 underline underline-offset-4 hover:text-cyan-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400">FAQ &amp; Help Center</Link>.
        </p>
      </div>
    </section>
  );
}
