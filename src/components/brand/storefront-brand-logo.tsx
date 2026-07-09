import { LuxeWordmark, type LuxeWordmarkVariant } from '@/components/brand/luxe-wordmark';
import { cn } from '@/lib/utils';

/** Gold italic Luxe wordmark for storefront navbar, footer, and marketing shells. */
export function StorefrontBrandLogo({
  variant = 'compact',
  className
}: {
  /** @deprecated Images removed — kept for call-site compatibility. */
  priority?: boolean;
  variant?: LuxeWordmarkVariant;
  className?: string;
}) {
  return <LuxeWordmark variant={variant} className={cn('shrink-0', className)} />;
}
