'use client';
import { usePathname } from 'next/navigation';
import React from 'react';

import { Sheet, SheetContent } from '@/components/ui/sheet';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useGetUserMenuStructure } from '@/services/-user-menu-structure-get';

import { useDashboardStore } from '../admin.store';
import { AdminSidebar } from './admin-sidebar';
import { AppHeader } from './app-header';
import { SearchSide } from './search-dashboard';

interface AppSidebarLayoutProps {
  children: React.ReactNode;
}

export function AppSidebarLayout({ children }: AppSidebarLayoutProps) {
  const { mobileSidebarOpen, setMobileSidebarOpen } = useDashboardStore();
  const pathname = usePathname();
  const { data: { data: sidebar_menu = [] } = {} } = useGetUserMenuStructure({});
  return (
    <TooltipProvider delayDuration={0}>
      <div className='bg-background flex h-screen w-full overflow-hidden'>
        {/* Desktop Sidebar */}
        <AdminSidebar pathname={pathname} groups={sidebar_menu} className='hidden md:flex' />

        {/* Mobile Sidebar - controlled by store */}
        <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
          <SheetContent side='left' className='w-72 border-none p-0'>
            <AdminSidebar pathname={pathname} groups={sidebar_menu} isMobile />
          </SheetContent>
        </Sheet>

        <div className='relative flex min-w-0 flex-1 flex-col overflow-hidden'>
          <AppHeader sidebar_menu={sidebar_menu} pathname={pathname} />

          <main className='bg-muted/20 flex-1 overflow-y-auto scroll-smooth'>
            <div className='container mx-auto min-h-full max-w-400 p-2 md:p-5'>{children}</div>
          </main>
        </div>

        <SearchSide data={sidebar_menu} />
      </div>
    </TooltipProvider>
  );
}
