'use client';

import { IconArrowRight, IconCheck, IconMail } from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { getFooterNewsletterCopyParams } from '@/lib/i18n/marketing-copy-params';
import { cn } from '@/lib/utils';

export function Newsletter() {
  const t = useTranslations('footer.newsletter');
  const copy = getFooterNewsletterCopyParams();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setStatus('error');
      return;
    }
    setStatus('loading');

    const subject = encodeURIComponent(t('mailtoSubject'));
    const body = encodeURIComponent(t('mailtoBody', { email }));
    window.location.href = `mailto:concierge@luxe.com?subject=${subject}&body=${body}`;

    setStatus('success');
    setEmail('');
    setTimeout(() => setStatus('idle'), 3500);
  }

  return (
    <div className='border-border/60 from-card via-card to-muted/40 relative min-w-0 overflow-hidden rounded-2xl border bg-linear-to-br p-5 sm:rounded-3xl sm:p-8 md:p-12'>
      <div
        aria-hidden
        className='bg-accent/20 absolute -end-24 -top-24 h-72 w-72 rounded-full blur-3xl'
      />
      <div
        aria-hidden
        className='bg-accent/10 absolute -start-24 -bottom-24 h-72 w-72 rounded-full blur-3xl'
      />
      <div className='relative grid gap-8 md:grid-cols-2 md:items-center'>
        <div className='text-start'>
          <div className='border-border/60 bg-background/60 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium tracking-wide uppercase backdrop-blur'>
            <span className='bg-accent h-1.5 w-1.5 animate-pulse rounded-full' />
            {t('badge')}
          </div>
          <h3 className='mt-4 text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl'>
            {t.rich('title', {
              ...copy,
              highlight: (chunks) => <span className='text-accent'>{chunks}</span>
            })}
          </h3>
          <p className='text-muted-foreground mt-3 max-w-md text-sm md:text-base'>
            {t('description', copy)}
          </p>
        </div>
        <form onSubmit={handleSubmit} className='min-w-0 space-y-3'>
          <div
            className={cn(
              'group bg-background/70 relative flex min-w-0 flex-col gap-2 rounded-2xl border p-2 backdrop-blur transition-all sm:flex-row sm:items-center',
              status === 'error'
                ? 'border-red-500/60 ring-2 ring-red-500/20'
                : 'border-border/60 focus-within:border-accent/60 focus-within:ring-accent/20 focus-within:ring-2'
            )}
          >
            <div className='flex min-w-0 flex-1 items-center gap-2'>
              <IconMail className='text-muted-foreground ms-3 size-5 shrink-0' />
              <input
                type='email'
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === 'error') setStatus('idle');
                }}
                placeholder={t('emailPlaceholder')}
                aria-label={t('emailAriaLabel')}
                className='placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent px-1 py-2 text-sm outline-none'
                dir='ltr'
              />
            </div>
            <button
              type='submit'
              disabled={status === 'loading' || status === 'success'}
              className='bg-foreground text-background inline-flex w-full shrink-0 items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium transition hover:opacity-90 disabled:opacity-60 sm:w-auto'
            >
              {status === 'success' ? (
                <>
                  <IconCheck className='size-4' />
                  {t('subscribed')}
                </>
              ) : status === 'loading' ? (
                <>
                  <span className='border-background/30 border-t-background size-4 animate-spin rounded-full border-2' />
                  {t('joining')}
                </>
              ) : (
                <>
                  {t('subscribe')}
                  <IconArrowRight className='cn-rtl-flip size-4 transition-transform group-focus-within:translate-x-0.5 rtl:group-focus-within:-translate-x-0.5' />
                </>
              )}
            </button>
          </div>
          <p
            className={cn(
              'text-start text-xs',
              status === 'error' ? 'text-red-500' : 'text-muted-foreground'
            )}
          >
            {status === 'error'
              ? t('errorInvalidEmail')
              : status === 'success'
                ? t('successHint')
                : t.rich('idleHint', {
                    link: (chunks) => (
                      <Link href='/register' className='text-accent hover:underline'>
                        {chunks}
                      </Link>
                    )
                  })}
          </p>
        </form>
      </div>
    </div>
  );
}
