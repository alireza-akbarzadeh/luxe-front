import { cn } from '@/lib/utils';

export type AppDialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export const appDialogSizeClasses: Record<
  AppDialogSize,
  { dialog: string; drawer: string; sheet: string }
> = {
  sm: {
    dialog: 'sm:max-w-md',
    drawer: 'max-h-[72dvh]',
    sheet: 'sm:max-w-md'
  },
  md: {
    dialog: 'sm:max-w-lg',
    drawer: 'max-h-[78dvh]',
    sheet: 'sm:max-w-lg'
  },
  lg: {
    dialog: 'sm:max-w-2xl',
    drawer: 'max-h-[85dvh]',
    sheet: 'w-full sm:max-w-xl'
  },
  xl: {
    dialog: 'sm:max-w-4xl',
    drawer: 'max-h-[92dvh]',
    sheet: 'w-full sm:max-w-2xl'
  },
  full: {
    dialog: 'sm:max-w-[min(96vw,72rem)]',
    drawer: 'h-[95dvh]',
    sheet: 'sm:max-w-[min(96vw,72rem)]'
  }
};

export function getAppDialogClasses(size: AppDialogSize = 'md', className?: string) {
  const sizes = appDialogSizeClasses[size];

  return {
    dialog: cn('w-full max-w-[calc(100%-2rem)]', sizes.dialog, className),
    drawer: cn('flex flex-col', sizes.drawer, className),
    sheet: cn(sizes.sheet, className)
  };
}
