import type { PropsWithChildren } from 'react';

import { VendorAssistantLandingSlot } from '@/domains/vendor/assistant/components/vendor-assistant-landing-slot';

type VendorMarketingLayoutProps = Readonly<PropsWithChildren>;

/** Standalone marketing layout — no site navbar/footer (vendor page has its own). */
export default function VendorMarketingLayout({ children }: VendorMarketingLayoutProps) {
  return (
    <div className='font-shell-commerce bg-background text-foreground min-h-screen scroll-smooth font-sans'>
      {children}
      <VendorAssistantLandingSlot />
    </div>
  );
}
