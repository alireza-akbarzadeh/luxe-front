'use client';

import { IconMenu, IconSearch } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import ThemeToggle from '@/components/ui/theme-toggle';
import { HeaderActions } from '@/domains/admin/components/header-action';
import { UserProfile } from '@/domains/admin/components/user-profile';
import { HeaderOverflowMenu } from '@/domains/admin/sections/header-overflow-menu';
import {
  HeaderPeriodControl,
  HeaderPeriodControlWide
} from '@/domains/admin/sections/header-period-control';
import { useAdminShellStore } from '@/domains/admin/stores/admin-shell-store';
import { cn } from '@/lib/utils';
import type { DtoMenuGroupResponse } from '@/services/-user-menu-structure-get.schemas';

interface AppHeaderProps {
  pathname: string;
  sidebar_menu: DtoMenuGroupResponse[];
}

export function AppHeader({ pathname: _pathname, sidebar_menu: _sidebarMenu }: AppHeaderProps) {
  const t = useTranslations('adminShell.header');
  const setMobileSidebarOpen = useAdminShellStore((state) => state.setMobileSidebarOpen);
  const setSearchOpen = useAdminShellStore((state) => state.setSearchOpen);

  return (
    <header className='dashboard-topnav sticky top-0 z-20 flex h-14 shrink-0 items-center gap-1 border-b px-2 sm:gap-2 sm:px-3 md:h-16 md:px-4'>
      <Button
        variant='ghost'
        size='icon'
        className='h-9 w-9 shrink-0 rounded-xl md:hidden'
        aria-label={t('openMenu')}
        onClick={() => setMobileSidebarOpen(true)}
      >
        <IconMenu className='h-5 w-5' />
      </Button>

      <Button
        variant='ghost'
        size='icon'
        className='h-9 w-9 shrink-0 rounded-xl md:hidden'
        aria-label={t('search')}
        onClick={() => setSearchOpen(true)}
      >
        <IconSearch className='size-5' />
      </Button>

      <Flex grow className='hidden min-w-0 md:flex'>
        <button
          type='button'
          onClick={() => setSearchOpen(true)}
          className={cn(
            'dashboard-search flex h-9 w-full max-w-md items-center gap-2 px-3 text-sm transition-colors lg:max-w-xl',
            'focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:outline-none'
          )}
        >
          <IconSearch className='size-4 shrink-0' />
          <span className='truncate'>{t('searchPlaceholder')}</span>
          <kbd className='bg-background/60 text-muted-foreground ms-auto hidden rounded-md border px-1.5 py-0.5 text-[10px] font-medium lg:inline'>
            ⌘K
          </kbd>
        </button>
      </Flex>

      <Flex direction='row' align='center' shrink className='ms-auto gap-1 sm:gap-2'>
        <HeaderPeriodControl />
        <HeaderPeriodControlWide />

        <HeaderActions />

        <ThemeToggle
          variant='ghost'
          className='hidden h-8 w-8 rounded-lg md:inline-flex lg:h-9 lg:w-9'
        />

        <HeaderOverflowMenu />

        <UserProfile variant='header' />
      </Flex>
    </header>
  );
}
