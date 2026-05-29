'use client';
import { usePathname } from 'next/navigation';

import { Sheet, SheetContent } from '@/components/ui/sheet';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useUser } from '~/src/hooks/useUser';

import { useDashboardStore } from '../admin.store';
import { dashboard_SIDEBAR } from '../data';
import { AdminSidebar } from './admin-sidebar';
import { AppHeader } from './app-header';
import { SearchSide } from './search-dashboard';

interface AppSidebarLayoutProps {
  children: React.ReactNode;
}

export function AppSidebarLayout({ children }: AppSidebarLayoutProps) {
  const { mobileSidebarOpen, setMobileSidebarOpen } = useDashboardStore(); // destructure both state and action
  const { user } = useUser();
  const pathname = usePathname();

  // Filter sidebar based on user permissions (if any)
  const filteredSidebar = dashboard_SIDEBAR
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        if (!item.permission) return true;
        return user?.role === 'admin' || item.permission === user?.role;
      })
    }))
    .filter((group) => group.items.length > 0);

  return (
    <TooltipProvider delayDuration={0}>
      <div className='bg-background flex h-screen w-full overflow-hidden'>
        {/* Desktop Sidebar */}
        <AdminSidebar pathname={pathname} groups={filteredSidebar} className='hidden md:flex' />

        {/* Mobile Sidebar - controlled by store */}
        <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
          <SheetContent side='left' className='w-72 border-none p-0'>
            <AdminSidebar pathname={pathname} groups={filteredSidebar} isMobile />
          </SheetContent>
        </Sheet>

        <div className='relative flex min-w-0 flex-1 flex-col overflow-hidden'>
          <AppHeader pathname={pathname} />

          <main className='bg-muted/20 flex-1 overflow-y-auto scroll-smooth'>
            <div className='container mx-auto min-h-full max-w-400 p-4 md:p-8'>{children}</div>
          </main>
        </div>

        <SearchSide data={filteredSidebar} />
      </div>
    </TooltipProvider>
  );
}
