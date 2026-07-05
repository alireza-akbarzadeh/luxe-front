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

/** Match sticky PDP/checkout bars — drawer below this width, dialog above. */
const DRAWER_MAX_WIDTH = 1024;

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
  const { width } = useMediaDevices();
  const useDrawerShell = width == null ? true : width <= DRAWER_MAX_WIDTH;
  const sizeClasses = getAppDialogClasses(size, className);

  if (useDrawerShell) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange} shouldScaleBackground={false}>
        {trigger ? <DrawerTrigger asChild>{trigger}</DrawerTrigger> : null}
        <DrawerContent
          showHandle
          radius='xl'
          className={cn(
            'border-border pb-[calc(5rem+env(safe-area-inset-bottom))]',
            sizeClasses.drawer
          )}
        >
          {(title || description) && (
            <DrawerHeader className='shrink-0 px-4 pt-1 pb-2 text-center sm:text-start'>
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
            <SheetHeader className='shrink-0 space-y-1 border-b px-6 py-5 pe-14 text-start'>
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
      <DialogContent className={sizeClasses.dialog}>
        {(title || description) && (
          <DialogHeader className='pe-14 text-start'>
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
