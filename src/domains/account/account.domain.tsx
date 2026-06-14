'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

import { RealtimeProvider } from '@/lib/realtime/realtime-provider';

import { AccountHeader } from './components/account-header';
import { AccountNotificationsSync } from './components/account-notifications-sync';
import { AccountSidebar } from './components/account-sidebar';
import { MobileAccountSidebar } from './components/mobile-account-sidebar';
import { AccountAddresses } from './containers/account-addresses';
import { AccountNotifications } from './containers/account-notifications';
import { AccountOrder } from './containers/account-order';
import { AccountOverview } from './containers/account-overview';
import { AccountPayment } from './containers/account-payment';
import { AccountSetting } from './containers/account-settings';
import { AccountWishlist } from './containers/account-wishlist';
import { useSidebarTab } from './hooks/useSidebarTab';

function AccountTabContent({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      {children}
    </motion.div>
  );
}

export function AccountDomain() {
  const { activeTab } = useSidebarTab();

  type Account = Record<typeof activeTab, ReactNode>;

  const accountTabs: Account = {
    overview: <AccountOverview />,
    orders: <AccountOrder />,
    wishlist: <AccountWishlist />,
    addresses: <AccountAddresses />,
    payment: <AccountPayment />,
    notifications: <AccountNotifications />,
    settings: <AccountSetting />
  };

  const activeContent = accountTabs[activeTab];

  return (
    <RealtimeProvider>
      <AccountNotificationsSync />
      <div className='pt-20 pb-12 sm:pt-24 sm:pb-16'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <AccountHeader />

          <div className='space-y-6 lg:hidden'>
            <MobileAccountSidebar />
            <AccountTabContent>{activeContent}</AccountTabContent>
          </div>

          <div className='hidden gap-8 lg:grid lg:grid-cols-[250px_1fr]'>
            <AccountSidebar />
            <AccountTabContent>{activeContent}</AccountTabContent>
          </div>
        </div>
      </div>
    </RealtimeProvider>
  );
}
