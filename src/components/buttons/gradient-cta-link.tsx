'use client';

import type { ReactNode } from 'react';

import { HoverBorderGradient } from '@/components/buttons/hover-border-gradient';

interface GradientCtaLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

/** Primary landing CTA with gold hover border — hover animation skips when reduced motion. */
export function GradientCtaLink({ href, children, className }: GradientCtaLinkProps) {
  return (
    <HoverBorderGradient as='a' href={href} className={className} containerClassName='inline-flex'>
      {children}
    </HoverBorderGradient>
  );
}
