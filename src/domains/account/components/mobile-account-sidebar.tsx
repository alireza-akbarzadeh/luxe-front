'use client';

import { Tabs, TabsList, TabsTrigger } from '~/src/components/ui/tabs';

import { menuItems } from '../data';
import { useSidebarTab } from '../hooks/useSidebarTab';

export function AccountSidebar() {
  const { activeTab, handleTabChange } = useSidebarTab();

  return (
    <div className='lg:hidden'>
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className='flex w-full overflow-x-auto'>
          {menuItems.slice(0, 4).map((item) => (
            <TabsTrigger key={item.id} value={item.id} className='flex-1'>
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
