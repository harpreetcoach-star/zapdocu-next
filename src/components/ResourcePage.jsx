
export default function ResourcePage({ title, description, children }) {
  return (
    <>
      <section className="mx-auto max-w-5xl space-y-8 px-4 py-12 sm:px-6 sm:py-16">
        <header className="space-y-3">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">{title}</h1>
          <p className="max-w-3xl leading-relaxed text-slate-400">{description}</p>
        </header>
        <div className="space-y-6 leading-relaxed text-slate-300">{children}</div>
      </section>
    </>
  );
}
