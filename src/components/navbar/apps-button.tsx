'use client';

import { IconDeviceMobile } from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { navbarActionButtonClassName } from '@/components/navbar/navbar-action-button';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function AppsButton() {
  const t = useTranslations('nav');

  return (
    <Button
      asChild
      variant='ghost'
      size='icon'
      className={cn(navbarActionButtonClassName)}
      aria-label={t('apps')}
    >
      <Link href='/apps'>
        <IconDeviceMobile className='size-5' stroke={1.75} />
      </Link>
    </Button>
  );
}
