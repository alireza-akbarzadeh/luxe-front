import type { PropsWithChildren } from 'react';

type VendorMarketingLayoutProps = Readonly<PropsWithChildren>;

/** Standalone marketing layout — no site navbar/footer (vendor page has its own). */
export default function VendorMarketingLayout({ children }: VendorMarketingLayoutProps) {
  return (
    <div className='bg-background text-foreground min-h-screen scroll-smooth'>{children}</div>
  );
}
