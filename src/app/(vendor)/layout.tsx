import type { PropsWithChildren } from 'react';

type VendorGroupLayoutProps = Readonly<PropsWithChildren>;

/** Route group shell for vendor panel routes (URLs are not prefixed). */
export default function VendorGroupLayout({ children }: VendorGroupLayoutProps) {
  return children;
}
