import { IconSparkles } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/** Floating vendor AI assistant entry point — matches storefront FAB styling. */
export function VendorAssistantFab({
  onClick,
  className
}: {
  onClick: () => void;
  className?: string;
}) {
  const t = useTranslations('vendorAssistant');

  return (
    <Button
      type='button'
      onClick={onClick}
      className={cn(
        'bg-gold hover:bg-gold/90 fixed right-10 bottom-[calc(1.5rem+env(safe-area-inset-bottom))] z-40 gap-2 rounded-full px-5 shadow-lg',
        className
      )}
    >
      <IconSparkles className='size-5' />
      <span className='hidden sm:inline'>{t('fab')}</span>
      <span className='sr-only sm:hidden'>{t('fab')}</span>
    </Button>
  );
}
