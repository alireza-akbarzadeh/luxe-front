'use client';

import { IconMenu, IconSearch } from '@tabler/icons-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ui/theme-toggle';
import { HeaderActions } from '@/domains/admin/components/header-action';
import { cn } from '@/lib/utils';
import type { DtoMenuGroupResponse } from '@/services/-user-menu-structure-get.schemas';

import { useDashboardStore } from '../admin.store';
import { DashboardBreadcrumbs } from './dashboard-breadcrumbs';

interface AppHeaderProps {
  pathname: string;
  sidebar_menu: DtoMenuGroupResponse[];
}

export function AppHeader({ pathname, sidebar_menu }: AppHeaderProps) {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const setMobileSidebarOpen = useDashboardStore((state) => state.setMobileSidebarOpen);
  const setSearchOpen = useDashboardStore((state) => state.setSearchOpen);

  return (
    <header
      className={cn(
        'sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-border/60 px-3 transition-all duration-300 md:gap-4 md:px-5',
        isScrolled
          ? 'bg-card/85 shadow-sm backdrop-blur-xl supports-[backdrop-filter]:bg-card/70'
          : 'bg-card/95'
      )}
    >
      <Button
        variant='ghost'
        size='icon'
        className='h-10 w-10 rounded-xl hover:bg-accent/60 md:hidden'
        aria-label='Open navigation menu'
        onClick={() => setMobileSidebarOpen(true)}
      >
        <IconMenu className='h-5 w-5' />
      </Button>

      <div className='hidden items-center gap-2 lg:flex'>
        <ThemeToggle />
        <div className='bg-border/50 hidden h-5 w-px sm:block' />
      </div>

      <DashboardBreadcrumbs sidebar_menu={sidebar_menu} pathname={pathname} />

      <div className='flex min-w-0 flex-1 items-center justify-end gap-3'>
        <div className='hidden max-w-sm flex-1 md:block lg:max-w-md'>
          <Button
            variant='outline'
            className={cn(
              'text-muted-foreground group relative h-10 w-full justify-start rounded-xl text-sm',
              'bg-muted/30 hover:bg-muted/50 border-border/40 border shadow-none'
            )}
            onClick={() => setSearchOpen(true)}
          >
            <IconSearch className='group-hover:text-primary mr-2 h-4 w-4 shrink-0 transition-colors' />
            <span className='hidden font-medium lg:inline'>Search commands…</span>
            <span className='lg:hidden'>Search…</span>
            <kbd className='bg-background text-muted-foreground pointer-events-none absolute top-1/2 right-2 hidden h-6 -translate-y-1/2 items-center gap-0.5 rounded-md border px-1.5 font-mono text-[10px] font-semibold sm:inline-flex'>
              <span>⌘</span>K
            </kbd>
          </Button>
        </div>

        <HeaderActions />
      </div>
    </header>
  );
}
