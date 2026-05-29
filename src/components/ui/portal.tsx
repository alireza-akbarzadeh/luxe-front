'use client';

import { Portal as PortalPrimitive } from 'radix-ui';
import * as React from 'react';

type PortalProps = PortalPrimitive.PortalProps;

/**
 * Portal component that renders children outside the current DOM hierarchy.
 * Useful for modals, tooltips, dropdowns, etc.
 */
const Portal = React.forwardRef<HTMLDivElement, PortalPrimitive.PortalProps>(
  ({ container, children, ...props }, ref) => {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
      <PortalPrimitive.Root ref={ref} container={container ?? document.body} {...props}>
        {children}
      </PortalPrimitive.Root>
    );
  }
);

Portal.displayName = 'Portal';

// Export the raw primitive as PortalRoot for advanced use cases
const PortalRoot = PortalPrimitive;

export { Portal, PortalRoot };
export type { PortalProps };
