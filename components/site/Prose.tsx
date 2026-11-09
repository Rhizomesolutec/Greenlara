export function Prose({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  children: React.ReactNode;
}) {
  return (
    <article className="container-page py-14 md:py-20">
      <p className="text-xs tracking-[0.2em] text-muted uppercase">{eyebrow}</p>
      <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-tight md:text-6xl">{title}</h1>
      {lede ? <p className="mt-5 max-w-2xl text-base leading-7 text-muted">{lede}</p> : null}
      <div className="mt-10 max-w-3xl space-y-4 text-base leading-7 text-forest/90">{children}</div>
    </article>
  );
}
