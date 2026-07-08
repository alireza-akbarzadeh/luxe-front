'use client';

import { IconMessage } from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { LanguageSwitcher } from '@/components/i18n/language-switcher';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import ThemeToggle from '@/components/ui/theme-toggle';

import { iconButtonClass } from '../constants';
import { TopNavNotifications } from './top-nav-notifications';

export function TopNavIconCluster() {
  const t = useTranslations('vendor.panel.topNav');

  return (
    <Flex
      direction='row'
      align='center'
      spacing={0.5}
      className='dashboard-icon-cluster p-0.5'
    >
      <TopNavNotifications />

      <Button variant='ghost' size='icon' className={iconButtonClass} asChild>
        <Link href='/vendor/panel/messages' aria-label={t('messages')}>
          <IconMessage className='size-[18px]' />
        </Link>
      </Button>

      <LanguageSwitcher className={iconButtonClass} />

      <ThemeToggle variant='ghost' className={iconButtonClass} />
    </Flex>
  );
}
