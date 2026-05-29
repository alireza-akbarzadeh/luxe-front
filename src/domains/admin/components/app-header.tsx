import {
  IconBrandZapier,
  IconLayoutGrid,
  IconMenu,
  IconMenuOrder,
  IconMusic,
  IconPlus,
  IconSearch,
  IconUsers
} from '@tabler/icons-react';
import Link from 'next/link';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

import { useDashboardStore } from '../admin.store';
import { useDashboardShortcuts } from '../useDahboardShortcut';
import { DashboardBreadcrumbs } from './dashboard-breadcrumbs';
import { NotificationCenter } from './notificaiton-center';
import { UserProfile } from './user-profile';

interface AppHeaderProps {
  pathname: string;
}

export function AppHeader({ pathname }: AppHeaderProps) {
  const [isScrolled, setIsScrolled] = React.useState(false);

  useDashboardShortcuts();

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
        'sticky top-0 z-20 flex h-14 shrink-0 items-center gap-4 px-4 transition-all duration-300 md:px-6',
        isScrolled
          ? 'bg-card/90 border-b shadow-sm backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
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

      <div className='flex min-w-0 flex-1 items-center gap-4'>
        <div className='text-muted-foreground bg-muted/20 border-border/40 hidden items-center gap-2 rounded-full border px-3 py-1 text-sm lg:flex'>
          <IconBrandZapier className='text-primary h-3.5 w-3.5 animate-pulse' />
          <DashboardBreadcrumbs pathname={pathname} />
          <div className='group hidden cursor-help items-center gap-4 rounded-full border border-emerald-500/10 bg-emerald-500/5 px-3 py-1 transition-all hover:bg-emerald-500/10 xl:flex'>
            <div className='flex items-center gap-1.5'>
              <div className='relative flex h-2 w-2'>
                <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75'></span>
                <span className='relative inline-flex h-2 w-2 rounded-full bg-emerald-500'></span>
              </div>
              <span className='text-[10px] font-bold tracking-wider text-emerald-600/80 uppercase'>
                Systems Nominal
              </span>
            </div>
            <div className='h-3 w-px bg-emerald-500/20' />
            <span className='font-mono text-[10px] text-emerald-600/70'>99.9% Uptime</span>
          </div>
        </div>

        <div className='group ml-auto max-w-md flex-1 md:ml-0'>
          <Button
            variant='outline'
            className={cn(
              'text-muted-foreground relative h-10 w-full justify-start rounded-xl text-sm transition-all duration-300',
              'bg-muted/40 hover:bg-muted/60 ring-border/50 group-hover:ring-primary/30 border-none shadow-inner ring-1'
            )}
            // Uses Store Action
            onClick={() => setSearchOpen(true)}
          >
            <IconSearch className='group-hover:text-primary mr-2 h-4 w-4 shrink-0 transition-colors' />
            <span className='hidden font-medium lg:inline'>Search Command...</span>
            <span className='lg:hidden'>Search...</span>

            <div className='bg-background pointer-events-none absolute top-2 right-2 hidden h-6 items-center gap-1 rounded-lg border px-2 font-mono text-[10px] font-bold shadow-sm select-none sm:flex'>
              <span className='text-[12px]'>⌘</span>K
            </div>
          </Button>
        </div>
      </div>

      <div className='ml-auto flex items-center gap-1.5'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              className='hover:bg-primary/10 hover:text-primary hidden h-9 gap-2 rounded-xl px-3 transition-all sm:flex'
            >
              <IconPlus className='h-4 w-4' />
              <span className='text-xs font-bold tracking-wider uppercase'>Create</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align='end'
            className='border-border/40 bg-popover/95 w-56 rounded-2xl p-2 shadow-2xl backdrop-blur-md'
          >
            <DropdownMenuLabel className='text-muted-foreground px-3 py-2 text-[10px] font-bold tracking-widest uppercase'>
              Quick Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator className='opacity-50' />
            <DropdownMenuItem
              asChild
              className='flex cursor-pointer items-center gap-3 rounded-xl p-2.5'
            >
              <Link href='/dashboard/movies/create'>
                <div className='rounded-lg bg-blue-500/10 p-2'>
                  <IconMenuOrder className='h-4 w-4 text-blue-500' />
                </div>
                <div className='flex flex-col'>
                  <span className='text-sm font-medium'>New Movie</span>
                  <span className='text-muted-foreground font-mono text-[10px]'>N</span>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              className='flex cursor-pointer items-center gap-3 rounded-xl p-2.5'
            >
              <Link href='/dashboard/music/create'>
                <div className='rounded-lg bg-blue-500/10 p-2'>
                  <IconMusic className='h-4 w-4 text-pink-500' />
                </div>
                <div className='flex flex-col'>
                  <span className='text-sm font-medium'>New Music</span>
                  <span className='text-muted-foreground font-mono text-[10px]'>N</span>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              className='flex cursor-pointer items-center gap-3 rounded-xl p-2.5'
            >
              <Link href='/dashboard/series/create'>
                <div className='rounded-lg bg-purple-500/10 p-2'>
                  <IconLayoutGrid className='h-4 w-4 text-purple-500' />
                </div>
                <div className='flex flex-col'>
                  <span className='text-sm font-medium'>New Series</span>
                  <span className='text-muted-foreground font-mono text-[10px]'>S</span>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              className='flex cursor-pointer items-center gap-3 rounded-xl p-2.5'
            >
              <Link href='/dashboard/users/create'>
                <div className='rounded-lg bg-emerald-500/10 p-2'>
                  <IconUsers className='h-4 w-4 text-emerald-500' />
                </div>
                <div className='flex flex-col'>
                  <span className='text-sm font-medium'>New Staff</span>
                  <span className='text-muted-foreground font-mono text-[10px]'>U</span>
                </div>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className='bg-border/40 mx-2 hidden h-6 w-px sm:block' />
        <NotificationCenter />
        <UserProfile variant='header' />
      </div>
    </header>
  );
}
