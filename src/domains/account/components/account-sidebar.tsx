'use client';

import { IconLogout } from '@tabler/icons-react';
import { motion } from 'framer-motion';

import { logoutAction } from '~/src/actions/auth.actions';
import { clearClientAccessToken } from '~/src/lib/auth/auth-token-client';

import { menuItems } from '../data';
import { useSidebarTab } from '../hooks/useSidebarTab';

export function AccountSidebar() {
  const { activeTab, setActiveTab } = useSidebarTab();

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className='sticky top-24 self-start space-y-2'
    >
      {menuItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors ${
              activeTab === item.id ? 'bg-accent text-accent-foreground' : 'hover:bg-muted'
            }`}
          >
            <Icon className='h-5 w-5' />
            {item.label}
          </button>
        );
      })}

      <hr className='border-border my-4' />

      <button
        onClick={() => {
          clearClientAccessToken();
          void logoutAction();
        }}
        className='flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950/20'
      >
        <IconLogout className='h-5 w-5' />
        Sign out
      </button>
    </motion.aside>
  );
}
