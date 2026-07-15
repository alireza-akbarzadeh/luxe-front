'use client';

import { IconMail } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Input } from '@/components/ui/input';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { usePostNewslettersSubscribe } from '@/services/-newsletters-subscribe-post';

interface BlogNewsletterCtaProps {
  /** e.g. 'home' or 'footer' — tags where the signup came from. */
  source?: 'home' | 'footer';
  /** Compact card for sidebars vs full-width band. */
  variant?: 'band' | 'compact';
  className?: string;
}

/** Newsletter signup band/card shown on the blog homepage and article pages. */
export function BlogNewsletterCta({
  source = 'home',
  variant = 'band',
  className
}: BlogNewsletterCtaProps) {
  const t = useTranslations('weblog.newsletter');
  const [email, setEmail] = useState('');
  const subscribe = usePostNewslettersSubscribe();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const value = email.trim();
    if (!value) return;

    subscribe.mutate(
      { data: { email: value, source } },
      {
        onSuccess: () => {
          toast.success(t('success'));
          setEmail('');
        },
        onError: () => toast.error(t('error'))
      }
    );
  };

  const isCompact = variant === 'compact';

  return (
    <section className={cn(isCompact ? '' : 'py-6', className)}>
      <div
        className={cn(
          'from-accent/10 via-card to-card relative overflow-hidden border bg-gradient-to-br shadow-sm',
          isCompact ? 'rounded-2xl p-5' : 'rounded-3xl p-8 md:p-12'
        )}
      >
        <Flex
          direction='column'
          align={isCompact ? 'start' : 'center'}
          gap={isCompact ? 3 : 4}
          className={cn(!isCompact && 'mx-auto max-w-xl text-center')}
        >
          <span className='bg-accent/15 text-accent flex size-10 items-center justify-center rounded-full'>
            <IconMail className='size-5' />
          </span>
          <Typography.H2
            className={cn('font-display', isCompact ? 'text-lg' : 'text-2xl md:text-3xl')}
          >
            {t('title')}
          </Typography.H2>
          <Typography.Muted className={cn(isCompact && 'text-sm')}>
            {t('description')}
          </Typography.Muted>

          <form
            onSubmit={handleSubmit}
            className={cn('mt-1 flex w-full flex-col gap-2', !isCompact && 'max-w-md sm:flex-row')}
          >
            <Input
              type='email'
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={t('placeholder')}
              aria-label={t('emailLabel')}
              className={cn('h-11 flex-1', isCompact ? 'rounded-xl' : 'rounded-full')}
            />
            <Button
              type='submit'
              disabled={subscribe.isPending}
              className={cn('h-11 px-6', isCompact ? 'w-full rounded-xl' : 'rounded-full')}
            >
              {subscribe.isPending ? t('submitting') : t('subscribe')}
            </Button>
          </form>

          {isCompact ? (
            <Typography.Muted className='text-xs'>{t('disclaimer')}</Typography.Muted>
          ) : null}
        </Flex>
      </div>
    </section>
  );
}
