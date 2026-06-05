import { IconAlertCircle, IconArrowLeft, IconQuestionMark, IconRefresh } from '@tabler/icons-react';
import Link from 'next/link';

type Props = {
  code?: string;
  badge?: string;
  title?: string;
  description?: string;
  primary?: { label: string; onClick?: () => void; href?: string };
  secondary?: { label: string; href: string };
  meta?: { label: string; value: string }[];
  tone?: 'neutral' | 'warn' | 'danger';
};

const toneRing: Record<NonNullable<Props['tone']>, string> = {
  neutral: 'bg-muted text-muted-foreground border-muted-foreground/10',
  warn: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  danger: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
};

export function AdminErrorState({
  code = '404',
  badge = 'Resource Not Found',
  title = 'Object or Route Missing',
  description = 'The administrative asset you are attempting to access does not exist, has been permanently migrated, or you lack the required database permissions to read it.',
  primary,
  secondary,
  meta,
  tone = 'warn'
}: Props) {
  const finalPrimary = primary ?? {
    label: 'Return to Dashboard',
    href: '/dashboard'
  };

  return (
    <div className='mx-auto w-full max-w-5xl px-4 py-8 md:py-12'>
      <div className='grid gap-6 md:grid-cols-[1.4fr_1fr]'>
        {/* Main Content Card */}
        <div className='border-border bg-card relative overflow-hidden rounded-2xl border p-8 shadow-xs md:p-10'>
          {/* Subtle design background accent to signal a missing file/route */}
          <div className='text-foreground pointer-events-none absolute top-0 right-0 translate-x-4 -translate-y-4 opacity-[0.02] dark:opacity-[0.03]'>
            <IconQuestionMark size={280} />
          </div>

          <span
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide uppercase ${toneRing[tone]}`}
          >
            <span className='h-1.5 w-1.5 animate-pulse rounded-full bg-current' /> {badge}
          </span>

          <div className='mt-8 flex items-baseline gap-4'>
            <span className='text-foreground font-mono text-7xl font-black tracking-tighter select-none md:text-8xl'>
              {code}
            </span>
            <div className='flex flex-col'>
              <span className='text-muted-foreground text-[10px] font-semibold tracking-widest uppercase'>
                HTTP Status
              </span>
              <span className='text-foreground/60 text-xs font-medium'>Entity Not Discovered</span>
            </div>
          </div>

          <h1 className='text-foreground mt-6 text-2xl font-bold tracking-tight md:text-3xl'>
            {title}
          </h1>
          <p className='text-muted-foreground mt-3 max-w-xl text-sm leading-relaxed'>
            {description}
          </p>

          <div className='mt-8 flex flex-wrap gap-3'>
            {finalPrimary.href ? (
              <Link
                href={finalPrimary.href}
                className='bg-foreground text-background inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98]'
              >
                <IconArrowLeft className='size-4' />
                {finalPrimary.label}
              </Link>
            ) : (
              <button
                onClick={finalPrimary.onClick}
                className='bg-foreground text-background inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98]'
              >
                <IconArrowLeft className='size-4' />
                {finalPrimary.label}
              </button>
            )}

            {secondary ? (
              <a
                href={secondary.href}
                className='border-border bg-background text-foreground hover:bg-muted transitionactive:scale-[0.98] inline-flex items-center justify-center rounded-xl border px-5 py-2.5 text-sm font-semibold'
              >
                {secondary.label}
              </a>
            ) : (
              <button
                onClick={() => window.location.reload()}
                className='border-border bg-background text-foreground hover:bg-muted/60 inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-semibold transition active:scale-[0.98]'
              >
                <IconRefresh className='size-3.5' />
                Retry Request
              </button>
            )}
          </div>
        </div>

        {/* Diagnostics Sidebar */}
        <div className='border-border bg-muted/30 flex flex-col justify-between rounded-2xl border p-6 backdrop-blur-xs'>
          <div>
            <div className='flex items-center gap-2'>
              <IconAlertCircle className='text-muted-foreground size-4' />
              <h3 className='text-muted-foreground text-xs font-bold tracking-widest uppercase'>
                System Diagnostics
              </h3>
            </div>

            <dl className='divide-border border-border mt-5 divide-y border-y text-sm'>
              {(
                meta ?? [
                  {
                    label: 'Request Path',
                    value:
                      typeof window !== 'undefined'
                        ? window.location.pathname
                        : '/dashboard/unknown'
                  },
                  { label: 'Active Node', value: 'cluster-edge-04' },
                  { label: 'Environment', value: 'production' },
                  {
                    label: 'Timestamp',
                    value: new Date().toISOString().replace('T', ' ').slice(0, 19)
                  }
                ]
              ).map((m) => (
                <div key={m.label} className='flex items-center justify-between py-3'>
                  <dt className='text-muted-foreground text-xs font-medium'>{m.label}</dt>
                  <dd
                    className='text-foreground max-w-45 truncate font-mono text-xs select-all'
                    title={m.value}
                  >
                    {m.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className='border-border/50 mt-8 flex items-center justify-between border-t pt-4'>
            <a
              href='#runbooks'
              className='text-muted-foreground hover:text-foreground text-xs font-semibold underline-offset-4 transition-colors hover:underline'
            >
              Consult missing route runbook →
            </a>
            <span className='bg-muted text-muted-foreground border-border/40 rounded border px-1.5 py-0.5 font-mono text-[10px]'>
              SYS_404
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
