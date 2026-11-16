import Link from 'next/link';

export default function ResourcePage({ title, description, children }) {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8">
      <Link href="/" className="text-sm text-cyan-400 underline underline-offset-4 hover:text-cyan-200">Back to ZapDocu tools</Link>
      <header className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold text-white">{title}</h1>
        <p className="text-slate-400 leading-relaxed">{description}</p>
      </header>
      <div className="space-y-6 text-slate-300 leading-relaxed">{children}</div>
    </section>
  );
}
