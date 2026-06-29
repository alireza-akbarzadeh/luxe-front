'use client';

import { IconArrowLeft } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type AuthBackButtonProps = {
  /** Used when there is no browser history (e.g. direct link). */
  fallbackHref?: string;
  className?: string;
};

/** Fixed top-start back control: arrow-only on mobile, « Back on sm+. */
export function AuthBackButton({ fallbackHref = '/', className }: AuthBackButtonProps) {
  const router = useRouter();
  const t = useTranslations('auth');

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
      return;
    }
    router.push(fallbackHref);
  };

  return (
    <Button
      type='button'
      variant='ghost'
      onClick={handleBack}
      aria-label={t('back')}
      className={cn(
        'border-border/60 bg-background/80 hover:bg-muted absolute start-3 top-3 z-30 h-11 w-11 rounded-full border shadow-sm backdrop-blur-sm sm:start-6 sm:top-6 sm:h-auto sm:w-auto sm:rounded-md sm:border-0 sm:bg-transparent sm:px-2 sm:py-2 sm:shadow-none sm:backdrop-blur-none',
        className
      )}
    >
      <IconArrowLeft className='cn-rtl-flip text-foreground h-6 w-6 sm:h-4 sm:w-4' stroke={2} />
      <span className='text-foreground hidden text-sm font-medium sm:inline'>{t('back')}</span>
    </Button>
  );
}
