'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

import { AccountHeader } from './components/account-header';
import { AccountSidebar } from './components/account-sidebar';
import { AccountAddresses } from './containers/account-addresses';
import { AccountOrder } from './containers/account-order';
import { AccountOverview } from './containers/account-overview';
import { AccountPayment } from './containers/account-payment';
import { AccountSetting } from './containers/account-settings';
import { AccountWishlist } from './containers/account-wishlist';
import { useSidebarTab } from './hooks/useSidebarTab';

export function AccountDomain() {
  const { activeTab } = useSidebarTab();

  type Account = Record<typeof activeTab, ReactNode>;

  const accountTabs: Account = {
    overview: <AccountOverview />,
    orders: <AccountOrder />,
    wishlist: <AccountWishlist />,
    addresses: <AccountAddresses />,
    payment: <AccountPayment />,
    settings: <AccountSetting />
  };

  return (
    <div className='pt-24 pb-16'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Page Header */}
        <AccountHeader />
        {/* Desktop Layout */}
        <div className='hidden gap-8 lg:grid lg:grid-cols-[250px_1fr]'>
          {/* Sidebar */}
          <AccountSidebar />
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {accountTabs[activeTab]}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
