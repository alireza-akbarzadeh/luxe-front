import {
  IconArrowRight,
  IconClock,
  IconDiamond,
  IconHanger,
  IconSparkles
} from '@tabler/icons-react';
import Link from 'next/link';

import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';

const CURATED_LINKS = [
  {
    href: '/shop',
    label: 'New arrivals',
    description: 'Fresh edits from top houses',
    icon: IconSparkles
  },
  {
    href: '/collections',
    label: 'Collections',
    description: 'Seasonal stories, one destination',
    icon: IconDiamond
  },
  {
    href: '/shop?sort=newest',
    label: 'Fashion',
    description: 'Tailoring, leather, and essentials',
    icon: IconHanger
  },
  {
    href: '/shop',
    label: 'Timepieces',
    description: 'Watches and fine jewelry',
    icon: IconClock
  }
] as const;

/** Lightweight hero visual — CSS only, no remote images or API fetch (LCP-safe). */
export function HeroEditorialPanel() {
  return (
    <div className='border-gold/25 bg-card/75 relative overflow-hidden rounded-3xl border p-6 shadow-2xl backdrop-blur-sm sm:p-8'>
      <div
        aria-hidden
        className='from-gold/15 pointer-events-none absolute -end-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br to-transparent blur-2xl'
      />
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 opacity-[0.04]'
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--gold) 1px, transparent 1px), linear-gradient(to bottom, var(--gold) 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      />

      <Flex direction='column' gap={6} className='relative'>
        <Flex direction='column' gap={2}>
          <Typography.Overline tone='accent'>The curated edit</Typography.Overline>
          <Typography.H3 family='display' className='text-balance'>
            Discover what matters this season
          </Typography.H3>
          <Typography.Muted className='max-w-sm text-pretty'>
            Handpicked categories to start browsing — no loading, no waiting.
          </Typography.Muted>
        </Flex>

        <Flex direction='column' gap={3}>
          {CURATED_LINKS.map(({ href, label, description, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              className='group border-border/60 bg-background/60 hover:border-gold/40 hover:bg-background flex items-center gap-4 rounded-2xl border p-4 transition-colors'
            >
              <span className='bg-gold/10 text-gold flex size-11 shrink-0 items-center justify-center rounded-xl'>
                <Icon className='size-5' aria-hidden />
              </span>
              <span className='min-w-0 flex-1'>
                <Typography.Small weight='semibold' className='block'>
                  {label}
                </Typography.Small>
                <Typography.Muted className='mt-0.5 block'>{description}</Typography.Muted>
              </span>
              <IconArrowRight
                className='text-muted-foreground group-hover:text-gold cn-rtl-flip size-4 shrink-0 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5'
                aria-hidden
              />
            </Link>
          ))}
        </Flex>
      </Flex>
    </div>
  );
}
