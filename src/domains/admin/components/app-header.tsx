import { IconBrandZapier, IconMenu, IconMoon, IconSearch } from '@tabler/icons-react';
import { useTheme } from 'next-themes';
import * as React from 'react';

import { Button } from '@/components/ui/button';
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

  const { setTheme, theme } = useTheme();
  const nextTheme = theme === 'light' ? 'dark' : 'light';

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
        'sticky top-0 z-20 flex h-18 shrink-0 items-center gap-4 border-b px-4 transition-all duration-300 md:px-6',
        isScrolled ? 'bg-card/90 border-b shadow-sm backdrop-blur-xl' : 'bg-card border-b'
      )}
    >
      {/* Mobile Menu Toggle - Uses Store Action */}
      <Button
        variant='ghost'
        size='icon'
        className='hover:bg-accent/50 md:hidden'
        onClick={() => setMobileSidebarOpen(true)}
      >
        <IconMenu className='h-5 w-5' />
      </Button>
      <div className='text-muted-foreground bg-muted/20 border-border/40 hidden items-center gap-2 rounded-full border p-3 text-sm lg:flex'>
        {theme === 'dark' ? (
          <IconBrandZapier
            onClick={() => setTheme(nextTheme)}
            className='text-primary h-4 w-4 animate-pulse'
          />
        ) : (
          <IconMoon
            onClick={() => setTheme(nextTheme)}
            className='text-primary h-4 w-4 animate-pulse'
          />
        )}
      </div>
      <DashboardBreadcrumbs sidebar_menu={sidebar_menu} pathname={pathname} />
      <div className='flex min-w-0 flex-1 items-center gap-4'>
        <div className='group ml-auto max-w-xs flex-1 md:ml-0'>
          <Button
            variant='outline'
            className={cn(
              'text-muted-foreground relative h-9 w-full justify-start rounded-xl text-sm transition-all duration-300',
              'bg-muted/40 hover:bg-muted/60 ring-border/50 group-hover:ring-primary/30 border-none shadow-inner ring-1'
            )}
            // Uses Store Action
            onClick={() => setSearchOpen(true)}
          >
            <IconSearch className='group-hover:text-primary mr-2 h-4 w-4 shrink-0 transition-colors' />
            <span className='hidden font-medium lg:inline'>Search Command...</span>
            <span className='lg:hidden'>Search...</span>

            <div className='bg-background pointer-events-none absolute top-1.5 right-2 hidden h-6 items-center gap-1 rounded-lg border px-2 font-mono text-[10px] font-bold shadow-sm select-none sm:flex'>
              <span className='text-[12px]'>⌘</span>K
            </div>
          </Button>
        </div>
      </div>
      <HeaderActions />
    </header>
  );
}
