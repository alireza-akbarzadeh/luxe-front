'use client';

import {
  IconAlertTriangle,
  IconBuildingStore,
  IconCalendarPlus,
  IconEye,
  IconTool
} from '@tabler/icons-react';
import type { ReactNode } from 'react';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger
} from '@/components/ui/context-menu';
import type { CalendarQuickAction } from '@/domains/store-calendar/types/store-calendar.types';

interface CalendarDayContextMenuProps {
  date: string;
  children: ReactNode;
  onAction: (date: string, action: CalendarQuickAction) => void;
}

/** Right-click quick actions for a calendar day cell. */
export function CalendarDayContextMenu({ date, children, onAction }: CalendarDayContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className='w-56'>
        <ContextMenuItem className='gap-2' onSelect={() => onAction(date, 'add-holiday')}>
          <IconCalendarPlus className='size-4' />
          Add Holiday
        </ContextMenuItem>
        <ContextMenuItem className='gap-2' onSelect={() => onAction(date, 'vendor-closed')}>
          <IconBuildingStore className='size-4' />
          Vendor Closed
        </ContextMenuItem>
        <ContextMenuItem className='gap-2' onSelect={() => onAction(date, 'special-working')}>
          <IconAlertTriangle className='size-4' />
          Special Working
        </ContextMenuItem>
        <ContextMenuItem className='gap-2' onSelect={() => onAction(date, 'maintenance')}>
          <IconTool className='size-4' />
          Maintenance
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem className='gap-2' onSelect={() => onAction(date, 'view-details')}>
          <IconEye className='size-4' />
          View Day Details
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
