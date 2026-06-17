'use client';
import { usePathname } from 'next/navigation';
import React from 'react';

import { Sheet, SheetContent } from '@/components/ui/sheet';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useDashboardShortcuts } from '@/domains/admin/useDahboardShortcut';
import { RealtimeProvider } from '@/lib/realtime/realtime-provider';
import { cn } from '@/lib/utils';
import { useGetUserMenuStructure } from '@/services/-user-menu-structure-get';

import { useDashboardStore } from '../admin.store';
import { AdminNotificationsSync } from './admin-notifications-sync';
import { AdminSidebar } from './admin-sidebar';
import { AppHeader } from './app-header';
import { SearchSide } from './search-dashboard';

interface AppSidebarLayoutProps {
  children: React.ReactNode;
}

export function AppSidebarLayout({ children }: AppSidebarLayoutProps) {
  const { mobileSidebarOpen, setMobileSidebarOpen } = useDashboardStore();
  const pathname = usePathname();
  useDashboardShortcuts();
  const { data: { data: sidebar_menu = [] } = {} } = useGetUserMenuStructure({});
  const isLiveFeed = pathname === '/dashboard/live';
  const isWorkflowCanvas =
    pathname.startsWith('/dashboard/workflows/') && pathname !== '/dashboard/workflows';
  const isFullWidth = isLiveFeed || isWorkflowCanvas;

  return (
    <RealtimeProvider>
      <AdminNotificationsSync />
      <TooltipProvider delayDuration={0}>
        <div className='bg-background flex h-screen w-full overflow-hidden'>
          {/* Desktop Sidebar */}
          <AdminSidebar pathname={pathname} groups={sidebar_menu} className='hidden md:flex' />

          {/* Mobile Sidebar - controlled by store */}
          <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
            <SheetContent side='left' className='w-72 border-none p-0'>
              <AdminSidebar pathname={pathname} groups={sidebar_menu} />
            </SheetContent>
          </Sheet>

          <div className='relative flex min-w-0 flex-1 flex-col overflow-hidden'>
            <AppHeader sidebar_menu={sidebar_menu} pathname={pathname} />
            <main className='flex-1 overflow-y-auto scroll-smooth p-px'>
              <div
                className={cn(
                  'bg-card min-h-full',
                  isFullWidth ? 'max-w-none p-4' : 'container mx-auto max-w-400 p-2'
                )}
              >
                {children}
              </div>
            </main>
          </div>

          <SearchSide data={sidebar_menu} />
        </div>
      </TooltipProvider>
    </RealtimeProvider>
  );
}
