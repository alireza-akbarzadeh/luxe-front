import type { ComponentProps } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/** Shared sizing and hover for navbar icon actions (search, cart, menu). */
export const navbarActionButtonClassName =
  'text-foreground/75 hover:text-foreground size-10 shrink-0 rounded-full hover:bg-muted/70 active:scale-[0.98]';

type NavbarActionButtonProps = ComponentProps<typeof Button>;

export function NavbarActionButton({
  className,
  variant = 'ghost',
  size = 'icon',
  ...props
}: NavbarActionButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(navbarActionButtonClassName, className)}
      {...props}
    />
  );
}
