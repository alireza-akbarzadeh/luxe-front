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
  DrawerTrigger
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

interface AppDialogProps {
  trigger?: React.ReactNode;
  children: React.ReactNode;
  title?: string;
  description?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Desktop only — mobile always renders as a drawer. Omit for centered dialog. */
  component?: 'sheet';
  className?: string;
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
    className,
    contentClassName,
    size = 'md',
    side = 'left'
  } = props;
  const { isMobile } = useMediaDevices();
  const sizeClasses = getAppDialogClasses(size, className);

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
        <DrawerContent className={sizeClasses.drawer}>
          <div className='mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-white/20' />

          {(title || description) && (
            <DrawerHeader className='mt-2 shrink-0'>
              {title && (
                <DrawerTitle className='text-center text-lg font-semibold'>{title}</DrawerTitle>
              )}
              {description && (
                <DrawerDescription className='text-center'>{description}</DrawerDescription>
              )}
            </DrawerHeader>
          )}

          <div className={cn('mt-2 flex min-h-0 flex-1 flex-col px-4 pb-8', contentClassName)}>
            {children}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  if (component === 'sheet') {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
        <SheetContent
          side={side}
          className={cn('flex h-full w-full flex-col gap-0 p-0', sizeClasses.sheet)}
        >
          {(title || description) && (
            <SheetHeader className='shrink-0 space-y-1 border-b px-6 py-5 pr-14 text-left'>
              {title && <SheetTitle className='text-lg font-semibold'>{title}</SheetTitle>}
              {description && <SheetDescription>{description}</SheetDescription>}
            </SheetHeader>
          )}
          <div
            className={cn('flex min-h-0 flex-1 flex-col overflow-hidden px-4 pb-6', contentClassName)}
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
      <DialogContent className={sizeClasses.dialog}>
        {(title || description) && (
          <DialogHeader>
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
