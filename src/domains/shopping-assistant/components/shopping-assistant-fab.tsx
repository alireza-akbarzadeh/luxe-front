import { IconSparkles } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { cn } from '@/hooks/useContextFactory';

/** Floating site-wide entry point for the shopping assistant. */
export function ShoppingAssistantFab({
  onClick,
  className
}: {
  onClick: () => void;
  className?: string;
}) {
  const t = useTranslations('shoppingAssistant');

  return (
    <Button
      type='button'
      onClick={onClick}
      className={cn(
        'bg-gold hover:bg-gold/90 fixed inset-s-6 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-40 gap-2 rounded-full px-5 shadow-lg lg:bottom-6',
        className
      )}
    >
      <IconSparkles className='size-5' />
      <span className='hidden sm:inline'>{t('fab')}</span>
      <span className='sr-only sm:hidden'>{t('fab')}</span>
    </Button>
  );
}
