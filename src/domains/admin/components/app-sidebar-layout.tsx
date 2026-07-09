'use client';
import { usePathname } from 'next/navigation';
import React from 'react';

import { Sheet, SheetContent } from '@/components/ui/sheet';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  resolveAdminPageLabel,
  useAdminRecentPages
} from '@/domains/admin/hooks/use-admin-recent-pages';
import { useAdminShellStore } from '@/domains/admin/stores/admin-shell-store';
import { useDashboardShortcuts } from '@/domains/admin/useDahboardShortcut';
import { RealtimeProvider } from '@/lib/realtime/realtime-provider';
import { cn } from '@/lib/utils';
import { useGetUserMenuStructure } from '@/services/-user-menu-structure-get';

import { AdminNotificationsSync } from './admin-notifications-sync';
import { AdminSidebar } from './admin-sidebar';
import { AppHeader } from './app-header';
import { SearchSide } from './search-dashboard';

interface AppSidebarLayoutProps {
  children: React.ReactNode;
}

export function AppSidebarLayout({ children }: AppSidebarLayoutProps) {
  const { mobileSidebarOpen, setMobileSidebarOpen } = useAdminShellStore();
  const pathname = usePathname();
  useDashboardShortcuts();
  useAdminRecentPages(resolveAdminPageLabel(pathname));
  const {
    data: { data: sidebar_menu = [] } = {},
    isLoading: isMenuLoading,
    isFetching: isMenuFetching
  } = useGetUserMenuStructure({});
  const showSidebarSkeleton = (isMenuLoading || isMenuFetching) && sidebar_menu.length === 0;
  const isLiveFeed = pathname === '/dashboard/live';
  const isWorkflowCanvas =
    pathname.startsWith('/dashboard/workflows/') && pathname !== '/dashboard/workflows';
  const isFullWidth = isLiveFeed || isWorkflowCanvas;

  return (
    <RealtimeProvider>
      <AdminNotificationsSync />
      <TooltipProvider delayDuration={0}>
        <div className='bg-background dashboard-shell flex h-screen w-full overflow-hidden'>
          {/* Desktop Sidebar */}
          <AdminSidebar
            pathname={pathname}
            groups={sidebar_menu}
            isLoading={showSidebarSkeleton}
            className='hidden md:flex'
          />

          {/* Mobile Sidebar - controlled by store */}
          <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
            <SheetContent side='left' className='dashboard-shell w-72 border-none p-0'>
              <AdminSidebar
                pathname={pathname}
                groups={sidebar_menu}
                isLoading={showSidebarSkeleton}
                onNavigate={() => setMobileSidebarOpen(false)}
              />
            </SheetContent>
          </Sheet>

          <div className='relative flex flex-1 flex-col overflow-hidden'>
            <AppHeader sidebar_menu={sidebar_menu} pathname={pathname} />
            <main className='flex-1 overflow-y-auto scroll-smooth'>
              <div
                className={cn(
                  'min-h-full p-4 md:p-6 lg:p-8',
                  isFullWidth ? 'max-w-none' : 'w-full'
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
