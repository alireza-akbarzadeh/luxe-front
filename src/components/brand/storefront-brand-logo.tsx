import { AppImage } from '@/components/ui/app-image';
import { BRAND_ASSETS } from '@/lib/brand-assets';
import { cn } from '@/lib/utils';

/** Horizontal LUXE wordmark for storefront navbar, footer, and marketing shells. */
export function StorefrontBrandLogo({
  priority = false,
  className
}: {
  priority?: boolean;
  className?: string;
}) {
  return (
    <AppImage
      src={BRAND_ASSETS.logo}
      alt='LUXE'
      width={220}
      height={56}
      sizes='(max-width: 640px) 220px, 220px'
      priority={priority}
      className={cn('ml-auto block h-30 w-auto shrink-0', className)}
    />
  );
}
