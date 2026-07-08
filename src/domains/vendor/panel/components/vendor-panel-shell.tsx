'use client';

import { Sheet, SheetContent } from '@/components/ui/sheet';
import { VendorCommandPalette } from '@/domains/vendor/panel/components/layout/vendor-command-palette';
import { VendorSidebar } from '@/domains/vendor/panel/components/layout/vendor-sidebar';
import { VendorRealtimeSync } from '@/domains/vendor/panel/components/vendor-realtime-sync';
import { VendorStoresHydrator } from '@/domains/vendor/panel/components/vendor-stores-hydrator';
import { useVendorShortcuts } from '@/domains/vendor/panel/hooks/use-vendor-shortcuts';
import { useVendorPanelStore } from '@/domains/vendor/panel/stores/vendor-panel-store';
import type { UserPayload } from '@/lib/auth/auth-server';
import { RealtimeProvider } from '@/lib/realtime/realtime-provider';
import { VendorTopNav } from '~/src/domains/vendor/landing/components/ui/vendor-top-nav';

interface VendorPanelShellProps {
  children: React.ReactNode;
  user: UserPayload;
}

export function VendorPanelShell({ children, user }: VendorPanelShellProps) {
  useVendorShortcuts();

  const mobileSidebarOpen = useVendorPanelStore((s) => s.mobileSidebarOpen);
  const setMobileSidebarOpen = useVendorPanelStore((s) => s.setMobileSidebarOpen);
  const activeStoreName = useVendorPanelStore((s) => s.activeStoreName);

  return (
    <RealtimeProvider>
      <VendorRealtimeSync user={user} />
      <div className='dashboard-shell flex h-screen w-full overflow-hidden'>
        <VendorStoresHydrator />
        <VendorSidebar className='hidden md:flex' />

        <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
          <SheetContent side='left' className='dashboard-shell w-[272px] border-none p-0'>
            <VendorSidebar onNavigate={() => setMobileSidebarOpen(false)} />
          </SheetContent>
        </Sheet>

        <div className='flex min-w-0 flex-1 flex-col overflow-hidden'>
          <VendorTopNav user={user} onOpenMobileNav={() => setMobileSidebarOpen(true)} />

          <div className='hidden border-b border-white/8 px-4 py-2 md:block lg:px-6'>
            <p className='text-muted-foreground text-xs'>
              Managing <span className='text-foreground font-medium'>{activeStoreName}</span>
            </p>
          </div>

          <main className='flex-1 overflow-y-auto p-4 md:p-6 lg:p-8'>{children}</main>
        </div>

        <VendorCommandPalette />
      </div>
    </RealtimeProvider>
  );
}
