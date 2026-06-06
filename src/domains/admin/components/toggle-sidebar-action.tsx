import { IconLayoutSidebarLeftCollapse, IconLayoutSidebarRightCollapse } from '@tabler/icons-react';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useDashboardStore } from '@/domains/admin/admin.store';
import { cn } from '@/lib/utils';

export function ToggleSidebarAction() {
  const isSidebarCollapsed = useDashboardStore((store) => store.isSidebarCollapsed);
  const setSidebarCollapsed = useDashboardStore((store) => store.setSidebarCollapsed);

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <button
          className={cn('cursor-pointer')}
          onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
        >
          {/* Swapped these so the icon matches what action will happen */}
          {isSidebarCollapsed ? (
            <IconLayoutSidebarRightCollapse className='h-5 w-5' />
          ) : (
            <IconLayoutSidebarLeftCollapse className='h-5 w-5' />
          )}
        </button>
      </TooltipTrigger>
      {/* Swapped the text strings so they make logical sense to the admin */}
      <TooltipContent
        side='right'
        sideOffset={12}
        className='z-50 text-xs font-bold tracking-wider uppercase'
      >
        {isSidebarCollapsed ? 'Open Sidebar' : 'Close Sidebar'}
      </TooltipContent>
    </Tooltip>
  );
}
