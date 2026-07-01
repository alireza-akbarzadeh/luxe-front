import Link from 'next/link';

import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';

import {
  HeroIconArrowRight,
  HeroIconClock,
  HeroIconDiamond,
  HeroIconHanger,
  HeroIconSparkles
} from './hero-icons';

const CURATED_LINKS = [
  {
    href: '/shop',
    label: 'New arrivals',
    description: 'Fresh edits from top houses',
    icon: HeroIconSparkles
  },
  {
    href: '/collections',
    label: 'Collections',
    description: 'Seasonal stories, one destination',
    icon: HeroIconDiamond
  },
  {
    href: '/shop?sort=newest',
    label: 'Fashion',
    description: 'Tailoring, leather, and essentials',
    icon: HeroIconHanger
  },
  {
    href: '/shop',
    label: 'Timepieces',
    description: 'Watches and fine jewelry',
    icon: HeroIconClock
  }
] as const;

/** Lightweight hero visual — CSS only, no remote images or API fetch (LCP-safe). */
export function HeroEditorialPanel() {
  return (
    <div className='border-gold/25 bg-card/90 relative overflow-hidden rounded-3xl border p-6 shadow-xl sm:p-8'>
      <div
        aria-hidden
        className='from-gold/12 pointer-events-none absolute -end-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br to-transparent'
      />

      <Flex direction='column' gap={6} className='relative'>
        <Flex direction='column' gap={2}>
          <Typography.Overline tone='accent'>The curated edit</Typography.Overline>
          <Typography.H2 family='display' className='text-balance text-2xl font-normal tracking-tight'>
            Discover what matters this season
          </Typography.H2>
          <Typography.Muted className='max-w-sm text-pretty'>
            Handpicked categories to start browsing — no loading, no waiting.
          </Typography.Muted>
        </Flex>

        <Flex direction='column' gap={3}>
          {CURATED_LINKS.map(({ href, label, description, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              className='group border-border/60 bg-background/80 hover:border-gold/40 hover:bg-background flex items-center gap-4 rounded-2xl border p-4 transition-colors'
            >
              <span className='bg-gold/10 text-gold flex size-11 shrink-0 items-center justify-center rounded-xl'>
                <Icon className='size-5' />
              </span>
              <span className='min-w-0 flex-1'>
                <Typography.Small weight='semibold' className='block'>
                  {label}
                </Typography.Small>
                <Typography.Muted className='mt-0.5 block'>{description}</Typography.Muted>
              </span>
              <HeroIconArrowRight className='text-muted-foreground group-hover:text-gold cn-rtl-flip size-4 shrink-0 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5' />
            </Link>
          ))}
        </Flex>
      </Flex>
    </div>
  );
}
