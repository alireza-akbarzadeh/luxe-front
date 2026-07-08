'use client';

import { IconCalendar, IconChevronDown, IconMenu, IconSearch } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Flex } from '@/components/ui/flex';
import ThemeToggle from '@/components/ui/theme-toggle';
import { HeaderActions } from '@/domains/admin/components/header-action';
import { UserProfile } from '@/domains/admin/components/user-profile';
import {
  dashboardPeriodLabel,
  dashboardPeriods,
  useDashboardPeriod
} from '@/domains/dashboard/hooks/use-dashboard-period';
import { cn } from '@/lib/utils';
import type { DtoMenuGroupResponse } from '@/services/-user-menu-structure-get.schemas';

import { useDashboardStore } from '../admin.store';

interface AppHeaderProps {
  pathname: string;
  sidebar_menu: DtoMenuGroupResponse[];
}

export function AppHeader({ pathname: _pathname, sidebar_menu: _sidebarMenu }: AppHeaderProps) {
  const [period, setPeriod] = useDashboardPeriod();
  const setMobileSidebarOpen = useDashboardStore((state) => state.setMobileSidebarOpen);
  const setSearchOpen = useDashboardStore((state) => state.setSearchOpen);

  return (
    <header className='dashboard-topnav sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b px-3 md:h-16 md:gap-3 md:px-4'>
      <Button
        variant='ghost'
        size='icon'
        className='h-9 w-9 rounded-xl md:hidden'
        aria-label='Open navigation menu'
        onClick={() => setMobileSidebarOpen(true)}
      >
        <IconMenu className='h-5 w-5' />
      </Button>

      <Flex grow className='min-w-0'>
        <button
          type='button'
          onClick={() => setSearchOpen(true)}
          className={cn(
            'dashboard-search flex h-9 w-full items-center gap-2 px-3 text-sm transition-colors',
            'focus-visible:ring-emerald-500/40 focus-visible:ring-2 focus-visible:outline-none md:max-w-xl'
          )}
        >
          <IconSearch className='size-4 shrink-0' />
          <span className='truncate'>Search orders, products, customers…</span>
          <kbd className='bg-background/60 text-muted-foreground ms-auto hidden rounded-md border px-1.5 py-0.5 text-[10px] font-medium md:inline'>
            ⌘K
          </kbd>
        </button>
      </Flex>

      <Flex direction='row' align='center' spacing={2} shrink className='ms-auto'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size='sm'
              variant='outline'
              className='hidden h-9 gap-1 rounded-xl border-white/10 bg-transparent sm:inline-flex'
            >
              <IconCalendar className='size-4 shrink-0' />
              <span className='hidden md:inline'>{dashboardPeriodLabel(period)}</span>
              <IconChevronDown className='size-3 shrink-0 opacity-60' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-44'>
            {dashboardPeriods.map((option) => (
              <DropdownMenuItem key={option} onClick={() => setPeriod(option)}>
                {dashboardPeriodLabel(option)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <HeaderActions />

        <div className='dashboard-icon-cluster hidden items-center gap-0.5 p-0.5 sm:flex'>
          <ThemeToggle variant='ghost' className='h-8 w-8 rounded-lg' />
        </div>

        <UserProfile variant='header' />
      </Flex>
    </header>
  );
}
