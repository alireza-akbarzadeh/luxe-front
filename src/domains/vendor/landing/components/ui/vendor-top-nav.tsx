'use client';

import { Flex } from '@/components/ui/flex';
import { useVendorPanelStore } from '@/domains/vendor/panel/stores/vendor-panel-store';
import type { UserPayload } from '@/lib/auth/auth-server';

import { TopNavCalendarMenu } from './top-nav/top-nav-calendar-menu';
import { TopNavIconCluster } from './top-nav/top-nav-icon-cluster';
import { TopNavQuickActions } from './top-nav/top-nav-quick-actions';
import { TopNavSearch } from './top-nav/top-nav-search';
import { TopNavSidebarControls } from './top-nav/top-nav-sidebar-controls';
import { TopNavStoreSwitcher } from './top-nav/top-nav-store-switcher';
import { TopNavUserMenu } from './top-nav/top-nav-user-menu';

interface VendorTopNavProps {
  user: UserPayload;
  onOpenMobileNav: () => void;
}

export function VendorTopNav({ user, onOpenMobileNav }: VendorTopNavProps) {
  const setCommandOpen = useVendorPanelStore((s) => s.setCommandOpen);

  const isOnline = true;

  return (
    <header className='border-border/60 bg-background/80 sticky top-0 z-20 shrink-0 border-b shadow-[0_1px_0_0_rgba(0,0,0,0.02)] backdrop-blur-xl'>
      <Flex
        direction='row'
        align='center'
        spacing={2}
        fullWidth
        className='h-14 px-3 md:h-16 md:gap-3 md:px-4'
      >
        <TopNavSidebarControls onOpenMobileNav={onOpenMobileNav} />

        <TopNavSearch onOpen={() => setCommandOpen(true)} />

        <Flex direction='row' align='center' spacing={2} shrink className='ms-auto'>
          <TopNavCalendarMenu />
          <TopNavStoreSwitcher />
          <TopNavQuickActions />
          <TopNavIconCluster />
          <TopNavUserMenu user={user} isOnline={isOnline} />
        </Flex>
      </Flex>
    </header>
  );
}
