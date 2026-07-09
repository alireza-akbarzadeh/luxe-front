'use client';

import type { ReactNode } from 'react';
import { cloneElement, isValidElement } from 'react';

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ADMIN_SHELL_DRAWER_MAX_WIDTH } from '@/domains/admin/lib/admin-shell-breakpoints';
import { useMediaDevices } from '@/hooks/useMediaDevices';
import { cn } from '@/lib/utils';

interface AdminShellPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: ReactNode;
  title?: ReactNode;
  children: ReactNode;
  /** Desktop surface when wider than drawer breakpoint. */
  desktopSurface?: 'popover' | 'dropdown';
  contentClassName?: string;
  popoverClassName?: string;
  dropdownClassName?: string;
  align?: 'start' | 'center' | 'end';
}

/**
 * Responsive admin shell overlay — bottom drawer on mobile/tablet,
 * popover or dropdown on desktop (same pattern as storefront AppDialog).
 */
export function AdminShellPanel({
  open,
  onOpenChange,
  trigger,
  title,
  children,
  desktopSurface = 'popover',
  contentClassName,
  popoverClassName,
  dropdownClassName,
  align = 'end'
}: AdminShellPanelProps) {
  const { width } = useMediaDevices();
  const useDrawerShell = width == null || width <= ADMIN_SHELL_DRAWER_MAX_WIDTH;

  if (useDrawerShell) {
    const drawerTrigger = isValidElement<{ onClick?: (event: React.MouseEvent) => void }>(trigger)
      ? cloneElement(trigger, {
          onClick: (event) => {
            trigger.props.onClick?.(event);
            if (!event.defaultPrevented) {
              onOpenChange(true);
            }
          }
        })
      : trigger;

    return (
      <>
        {drawerTrigger}
        <Drawer open={open} onOpenChange={onOpenChange} shouldScaleBackground={false}>
          <DrawerContent
            showHandle
            radius='xl'
            className={cn('max-h-[min(88vh,720px)]', contentClassName)}
          >
            {title ? (
              <DrawerHeader className='shrink-0 px-4 pt-1 pb-2 text-start'>
                <DrawerTitle className='text-base font-semibold'>{title}</DrawerTitle>
              </DrawerHeader>
            ) : null}
            <div className='flex min-h-0 flex-1 flex-col overflow-hidden'>{children}</div>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  if (desktopSurface === 'dropdown') {
    return (
      <DropdownMenu open={open} onOpenChange={onOpenChange}>
        <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
        <DropdownMenuContent align={align} className={cn('p-0', dropdownClassName)}>
          {children}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        align={align}
        className={cn(
          'border-border/60 w-[min(100vw-2rem,24rem)] overflow-hidden rounded-2xl p-0 shadow-xl',
          popoverClassName
        )}
      >
        {children}
      </PopoverContent>
    </Popover>
  );
}
