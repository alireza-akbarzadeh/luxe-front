import type { ComponentProps } from 'react';
import { Drawer as DrawerPrimitive } from 'vaul';

import {
  MOBILE_COMMERCE_OVERLAY_BOTTOM_CLASS,
  MOBILE_COMMERCE_SUMMARY_DRAWER_BOTTOM_CLASS,
  MOBILE_TAB_BAR_BOTTOM_CLASS
} from '@/lib/mobile-commerce-drawer';
import { cn } from '@/lib/utils';

function Drawer({
  shouldScaleBackground = false,
  ...props
}: ComponentProps<typeof DrawerPrimitive.Root>) {
  return <DrawerPrimitive.Root shouldScaleBackground={shouldScaleBackground} {...props} />;
}

/** Stacked drawer — must be rendered inside an open parent `Drawer` / `DrawerContent`. */
function NestedDrawer({
  shouldScaleBackground = false,
  ...props
}: ComponentProps<typeof DrawerPrimitive.NestedRoot>) {
  return <DrawerPrimitive.NestedRoot shouldScaleBackground={shouldScaleBackground} {...props} />;
}

const DrawerTrigger = DrawerPrimitive.Trigger;

const DrawerPortal = DrawerPrimitive.Portal;

const DrawerClose = DrawerPrimitive.Close;

const DrawerHandle = DrawerPrimitive.Handle;

function DrawerOverlay({ className, ...props }: ComponentProps<typeof DrawerPrimitive.Overlay>) {
  return (
    <DrawerPrimitive.Overlay
      className={cn('fixed inset-0 z-50 bg-black/80', className)}
      {...props}
    />
  );
}

type DrawerVariant = 'default' | 'ios';
type Radius = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface DrawerContentProps extends React.ComponentProps<typeof DrawerPrimitive.Content> {
  variant?: DrawerVariant;
  showHandle?: boolean;
  radius?: Radius;
  /** Anchor above the mobile bottom tab bar instead of screen bottom. */
  aboveMobileTabBar?: boolean;
  /** Anchor above sticky cart/checkout action bar (tab bar + CTA strip). */
  aboveCommerceActionBar?: boolean;
  /** Dim the page behind the drawer (default true). */
  showOverlay?: boolean;
}

const radiusMap: Record<Radius, string> = {
  sm: 'rounded-t-md',
  md: 'rounded-t-lg',
  lg: 'rounded-t-xl',
  xl: 'rounded-t-2xl',
  full: 'rounded-t-[28px]'
};

function DrawerContent({
  className,
  variant = 'default',
  showHandle = false,
  radius = 'xl',
  aboveMobileTabBar = false,
  aboveCommerceActionBar = false,
  showOverlay = true,
  ...props
}: DrawerContentProps) {
  const bottomClass = aboveCommerceActionBar
    ? MOBILE_COMMERCE_SUMMARY_DRAWER_BOTTOM_CLASS
    : aboveMobileTabBar
      ? MOBILE_TAB_BAR_BOTTOM_CLASS
      : 'bottom-0';

  return (
    <DrawerPortal>
      {showOverlay ? (
        <DrawerOverlay
          className={cn(
            'fixed inset-x-0 top-0 z-[70] bg-black/50',
            aboveCommerceActionBar ? MOBILE_COMMERCE_OVERLAY_BOTTOM_CLASS : 'bottom-0'
          )}
        />
      ) : null}

      <DrawerPrimitive.Content
        aria-describedby={undefined}
        className={cn(
          'bg-background fixed inset-x-0 z-[71] flex h-auto flex-col border-t shadow-2xl',
          bottomClass,
          aboveCommerceActionBar && 'h-auto',
          'outline-none',
          radiusMap[radius],
          variant === 'ios' && 'px-4 pt-2 pb-6 shadow-[0_-10px_40px_rgba(0,0,0,0.25)]',
          className
        )}
        {...props}
      >
        {showHandle ? (
          <div className='border-border/70 flex shrink-0 justify-center border-b px-4 pt-3 pb-2.5'>
            <DrawerHandle className='bg-muted-foreground/50 hover:bg-muted-foreground/65 h-1.5 w-14 rounded-full transition-colors' />
          </div>
        ) : null}

        {props.children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
}

function DrawerHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('grid gap-1.5 p-4 text-center sm:text-start', className)} {...props} />;
}

function DrawerFooter({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('flex flex-col gap-2 p-4', className)} {...props} />;
}

function DrawerTitle({ className, ...props }: ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      className={cn('text-lg leading-none font-semibold tracking-tight', className)}
      {...props}
    />
  );
}

function DrawerDescription({
  className,
  ...props
}: ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHandle,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
  NestedDrawer
};
