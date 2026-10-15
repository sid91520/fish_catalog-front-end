export function PageHero({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-10 pt-16 sm:pt-20">
      <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">{eyebrow}</p>
      <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">{title}</h1>
      {children && <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">{children}</p>}
    </section>
  );
}
