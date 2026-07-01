type HeroIconProps = Readonly<{ className?: string }>;

/** Inline SVGs for the hero — avoids @tabler/icons-react on the LCP-critical path. */
export function HeroIconSparkles({ className }: HeroIconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
      className={className}
      aria-hidden
    >
      <path d='M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z' />
      <path d='M19 13l.75 2.25L22 16l-2.25.75L19 19l-.75-2.25L16 16l2.25-.75L19 13z' />
    </svg>
  );
}

export function HeroIconStar({ className }: HeroIconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='currentColor'
      className={className}
      aria-hidden
    >
      <path d='M12 2l2.4 7.4H22l-6 4.6 2.3 7-6.3-4.6L5.7 21l2.3-7-6-4.6h7.6L12 2z' />
    </svg>
  );
}

export function HeroIconArrowRight({ className }: HeroIconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
      className={className}
      aria-hidden
    >
      <path d='M5 12h14M13 6l6 6-6 6' />
    </svg>
  );
}

export function HeroIconTruck({ className }: HeroIconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
      className={className}
      aria-hidden
    >
      <path d='M10 17h4M3 7h11v8H3V7zM14 9h3l3 3v3h-6V9z' />
      <circle cx='7.5' cy='17.5' r='1.5' />
      <circle cx='17.5' cy='17.5' r='1.5' />
    </svg>
  );
}

export function HeroIconShieldCheck({ className }: HeroIconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
      className={className}
      aria-hidden
    >
      <path d='M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6l7-3z' />
      <path d='M9 12l2 2 4-4' />
    </svg>
  );
}

export function HeroIconDiamond({ className }: HeroIconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
      className={className}
      aria-hidden
    >
      <path d='M6 3h12l4 7-10 11L2 10l4-7z' />
    </svg>
  );
}

export function HeroIconHanger({ className }: HeroIconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
      className={className}
      aria-hidden
    >
      <path d='M12 6a2 2 0 1 0-2-2M3 10l9 5 9-5-9-5-9 5z' />
    </svg>
  );
}

export function HeroIconClock({ className }: HeroIconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
      className={className}
      aria-hidden
    >
      <circle cx='12' cy='12' r='9' />
      <path d='M12 7v5l3 2' />
    </svg>
  );
}
