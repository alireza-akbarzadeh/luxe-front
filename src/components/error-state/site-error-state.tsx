import Link from 'next/link';

type StateProps = {
  code: string;
  eyebrow: string;
  title: string;
  description: string;
  primary: { label: string; onClick?: () => void; href?: string };
  secondary?: { label: string; href: string };
  accent?: string;
};

export function SiteErrorState({
  code,
  eyebrow,
  title,
  description,
  primary,
  secondary,
  accent = 'from-orange-200/40 via-rose-200/30 to-amber-100/40'
}: StateProps) {
  return (
    <section className='relative mx-auto w-full max-w-3xl py-16'>
      {/* soft background glow */}
      <div
        className={`pointer-events-none absolute inset-x-0 -top-10 -z-10 mx-auto h-64 w-[90%] rounded-[3rem] bg-linear-to-br ${accent} opacity-70 blur-3xl`}
      />

      <div className='border-border/60 bg-card/80 rounded-3xl border p-8 shadow-sm backdrop-blur md:p-14'>
        {/* Eyebrow */}
        <p className='text-muted-foreground text-xs font-semibold tracking-[0.25em] uppercase'>
          {eyebrow}
        </p>

        {/* Code + Title */}
        <div className='mt-6 flex flex-col gap-3'>
          <h1 className='text-foreground font-serif text-[clamp(3.5rem,12vw,7rem)] leading-none font-light tracking-tight'>
            {code}
          </h1>

          <h2 className='text-foreground text-xl font-semibold tracking-tight md:text-2xl'>
            {title}
          </h2>

          <p className='text-muted-foreground max-w-lg text-sm leading-relaxed md:text-base'>
            {description}
          </p>
        </div>

        {/* Primary actions */}
        <div className='mt-8 flex flex-wrap gap-3'>
          {primary.href ? (
            <Link
              href={primary.href}
              className='bg-foreground text-background inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition hover:opacity-90'
            >
              {primary.label}
            </Link>
          ) : (
            <button
              onClick={primary.onClick}
              className='bg-foreground text-background inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition hover:opacity-90'
            >
              {primary.label}
            </button>
          )}

          {secondary && (
            <Link
              href={secondary.href}
              className='border-border bg-background text-foreground hover:bg-muted inline-flex items-center justify-center rounded-full border px-6 py-3 text-sm font-medium transition'
            >
              {secondary.label}
            </Link>
          )}
        </div>

        {/* Recovery section */}
        <div className='mt-10 border-t pt-6'>
          <p className='text-muted-foreground mb-3 text-xs tracking-widest uppercase'>
            Quick recovery
          </p>

          <div className='grid gap-2 sm:grid-cols-3'>
            {[
              { label: 'New arrivals', href: '/shop?sortBy=newest&showOnlyNew=true' },
              { label: 'Best sellers', href: '/store?rating=4.5' },
              { label: 'Contact support', href: '/help' }
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className='group hover:bg-muted flex items-center justify-between rounded-xl px-3 py-2 text-sm transition'
              >
                <span>{item.label}</span>
                <span className='opacity-0 transition group-hover:opacity-100'>→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
