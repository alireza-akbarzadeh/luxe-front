'use client';

import { IconGlobe, IconRotateClockwise2 } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { SiteMenuList } from '@/domains/menus/components/site-menu-list';
import { getGetNavMenusQueryKey } from '@/services/-nav-menus-get';

export function SiteMenuDomain() {
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    void queryClient.invalidateQueries({ queryKey: getGetNavMenusQueryKey() });
  };

  return (
    <div className='bg-background min-h-screen'>
      <div className='bg-card/80 sticky top-0 z-20 border-b backdrop-blur-sm'>
        <div className='mx-auto max-w-400 px-6 py-5'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='bg-primary/10 flex h-9 w-9 items-center justify-center rounded-xl'>
                <IconGlobe className='text-primary h-4.5 w-4.5' />
              </div>
              <div>
                <h1 className='text-xl font-black tracking-tight'>Site Menu</h1>
                <p className='text-muted-foreground text-[10px] font-bold tracking-widest uppercase'>
                  Storefront navigation
                </p>
              </div>
            </div>
            <Button
              variant='outline'
              size='sm'
              className='h-9 gap-2 rounded-xl text-[10px] font-bold uppercase'
              onClick={handleRefresh}
            >
              <IconRotateClockwise2 className='h-3.5 w-3.5' /> Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className='mx-auto max-w-400 px-6 py-8'>
        <SiteMenuList />
      </div>
    </div>
  );
}
