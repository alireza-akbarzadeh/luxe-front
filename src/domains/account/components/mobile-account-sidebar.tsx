'use client';

import { IconLogout } from '@tabler/icons-react';

import { logoutAction } from '@/actions/auth.actions';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { clearClientAccessToken } from '@/lib/auth/auth-token-client';

import { menuItems } from '../data';
import { useSidebarTab } from '../hooks/useSidebarTab';

export function MobileAccountSidebar() {
  const { activeTab, handleTabChange } = useSidebarTab();

  return (
    <div className='space-y-3 lg:hidden'>
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className='bg-muted/50 h-auto w-full justify-start gap-1 overflow-x-auto p-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <TabsTrigger
                key={item.id}
                value={item.id}
                className='data-[state=active]:bg-background shrink-0 gap-1.5 px-3 py-2 text-xs sm:text-sm'
              >
                <Icon className='h-4 w-4' />
                <span className='whitespace-nowrap'>{item.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      <button
        type='button'
        onClick={() => {
          clearClientAccessToken();
          void logoutAction();
        }}
        className='text-muted-foreground hover:text-destructive flex w-full items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-2.5 text-sm transition-colors'
      >
        <IconLogout className='h-4 w-4' />
        Sign out
      </button>
    </div>
  );
}
