import type React from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  NestedDrawer
} from '@/components/ui/drawer';
import { cn } from '@/lib/utils';

import { useMediaDevices } from '../hooks/useMediaDevices';
import { type AppDialogSize, getAppDialogClasses } from './app-dialog.sizes';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from './ui/sheet';

/** Match sticky PDP/checkout bars — drawer below this width, dialog above. */
const DRAWER_MAX_WIDTH = 1024;

/** Above cart/wishlist sheets (`z-[100]` / `z-[101]`). */
const STACKED_OVERLAY_CLASS = 'z-[110]';
const STACKED_CONTENT_CLASS = 'z-[111]';

interface AppDialogProps {
  trigger?: React.ReactNode;
  children: React.ReactNode;
  title?: string | React.ReactNode;
  description?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Desktop only — mobile always renders as a drawer. Omit for centered dialog. */
  component?: 'sheet';
  /** Vaul nested drawer — stacks on an open parent drawer (mobile only). */
  nested?: boolean;
  /**
   * Raise overlay/content above open Sheets (cart/wishlist drawers use z-[100]).
   * Use when this dialog can open while a sheet is visible.
   */
  stacked?: boolean;
  /** Always use the centered dialog shell (skip mobile drawer). Admin forms. */
  preferDialog?: boolean;
  /** Extra classes for the dimming overlay. */
  overlayClassName?: string;
  /** Extra bottom padding for mobile tab bars. Default true on root drawers. */
  tabBarPadding?: boolean;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  size?: AppDialogSize;
  side?: 'bottom' | 'top' | 'right' | 'left' | undefined;
}

export function AppDialog(props: AppDialogProps) {
  const {
    trigger,
    children,
    title,
    description,
    open,
    onOpenChange,
    component,
    nested = false,
    stacked = false,
    preferDialog = false,
    overlayClassName,
    tabBarPadding = true,
    className,
    contentClassName,
    size = 'md',
    side = 'left',
    headerClassName
  } = props;
  const { width } = useMediaDevices();
  const useDrawerShell = !preferDialog && (nested || width == null || width <= DRAWER_MAX_WIDTH);
  const sizeClasses = getAppDialogClasses(size, className);
  const DrawerRoot = nested ? NestedDrawer : Drawer;

  if (useDrawerShell) {
    return (
      <DrawerRoot open={open} onOpenChange={onOpenChange} shouldScaleBackground={false}>
        {trigger ? <DrawerTrigger asChild>{trigger}</DrawerTrigger> : null}
        <DrawerContent
          showHandle
          radius='xl'
          overlayClassName={cn(stacked && STACKED_OVERLAY_CLASS, overlayClassName)}
          className={cn(
            'border-border',
            tabBarPadding && 'pb-[calc(5rem+env(safe-area-inset-bottom))]',
            sizeClasses.drawer,
            stacked && STACKED_CONTENT_CLASS
          )}
        >
          {(title || description) && (
            <DrawerHeader
              className={cn('shrink-0 px-4 pt-1 pb-2 text-center sm:text-start', headerClassName)}
            >
              {title ? <DrawerTitle className='text-lg font-semibold'>{title}</DrawerTitle> : null}
              {description ? <DrawerDescription>{description}</DrawerDescription> : null}
            </DrawerHeader>
          )}

          <div
            className={cn(
              'flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-6',
              contentClassName
            )}
          >
            {children}
          </div>
        </DrawerContent>
      </DrawerRoot>
    );
  }

  if (component === 'sheet') {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
        <SheetContent
          side={side}
          className={cn(
            'flex h-full w-full flex-col gap-0 p-0',
            sizeClasses.sheet,
            stacked && STACKED_CONTENT_CLASS
          )}
        >
          {(title || description) && (
            <SheetHeader
              className={cn(
                'shrink-0 space-y-1 border-b px-6 py-5 pe-14 text-start',
                headerClassName
              )}
            >
              {title && <SheetTitle className='text-lg font-semibold'>{title}</SheetTitle>}
              {description && <SheetDescription>{description}</SheetDescription>}
            </SheetHeader>
          )}
          <div
            className={cn(
              'flex min-h-0 flex-1 flex-col overflow-hidden px-4 pb-6',
              contentClassName
            )}
          >
            {children}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={cn(
          'bg-popover text-popover-foreground border-border shadow-2xl',
          sizeClasses.dialog,
          stacked && STACKED_CONTENT_CLASS
        )}
        overlayClassName={cn('bg-black/55', stacked && STACKED_OVERLAY_CLASS, overlayClassName)}
      >
        {(title || description) && (
          <DialogHeader className={cn('pe-14 text-start', headerClassName)}>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}
        <div className={cn('py-4', contentClassName)}>{children}</div>
      </DialogContent>
    </Dialog>
  );
}

export type { AppDialogSize };
