import Link from 'next/link';

import { Box } from '@/components/ui/box';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { Text, Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

import {
  HeroIconArrowRight,
  HeroIconClock,
  HeroIconDiamond,
  HeroIconHanger,
  HeroIconShieldCheck,
  HeroIconSparkles,
  HeroIconStar,
  HeroIconTruck
} from './hero-icons';

const STATS = [
  { value: '120+', label: 'Maisons & makers' },
  { value: '25k+', label: 'Members worldwide' },
  { value: '4.9', label: 'Average rating' },
  { value: '32', label: 'Countries shipped' }
] as const;

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
    description: 'Seasonal stories, one place',
    icon: HeroIconDiamond
  },
  {
    href: '/shop?sort=newest',
    label: 'Fashion',
    description: 'Tailoring, leather, essentials',
    icon: HeroIconHanger
  },
  {
    href: '/shop',
    label: 'Timepieces',
    description: 'Watches and fine jewelry',
    icon: HeroIconClock
  }
] as const;

const primaryCtaClass = cn(
  'group flex min-h-[50px] w-full items-center justify-center gap-2 rounded-full px-6 text-[0.95rem] font-semibold tracking-wide',
  'bg-primary text-primary-foreground shadow-md transition-[color,background-color,transform] duration-200',
  'active:scale-[0.98]'
);

const secondaryCtaClass = cn(
  'flex min-h-[50px] w-full items-center justify-center gap-2 rounded-full border px-6 text-[0.95rem] font-semibold tracking-wide transition-colors',
  'border-gold/40 bg-card/90 text-foreground hover:border-gold active:scale-[0.98] dark:bg-card/70'
);

const curatedCardClass = cn(
  'block w-[150px] shrink-0 snap-start rounded-2xl border p-4 text-inherit no-underline transition-colors',
  'border-border/60 bg-card hover:border-gold/40 dark:border-border/40 dark:bg-card/80 dark:hover:border-gold/30'
);

/** Mobile-only hero — theme tokens + shared icons for dark mode and LCP safety. */
export function HeroMobile() {
  const year = new Date().getFullYear();

  return (
    <Box
      asChild
      className={cn(
        'hero-mobile-perf bg-background relative block overflow-x-hidden md:hidden',
        'px-5 pt-5 [padding-bottom:calc(2rem+env(safe-area-inset-bottom))] pb-8'
      )}
    >
      <section aria-label='LUXE mobile hero'>
        <Box
          aria-hidden
          className='from-background via-background to-surface pointer-events-none absolute inset-0 bg-gradient-to-b'
        />
        <Box
          aria-hidden
          className='bg-gold/15 dark:bg-gold/10 pointer-events-none absolute -end-16 -top-20 h-48 w-48 rounded-full blur-3xl'
        />

        <Flex direction='column' className='relative'>
          <span className='border-gold/30 bg-card/90 dark:bg-muted/50 mb-4 inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm backdrop-blur-sm'>
            <HeroIconSparkles className='text-gold size-3 shrink-0' />
            <span className='text-foreground tracking-wide'>{`Fall ${year}`}</span>
            <span className='text-muted-foreground'>— now live</span>
          </span>

          <Typography.H1
            family='display'
            className='hero-lcp-title mb-1 text-[clamp(2.1rem,9vw,2.6rem)] leading-[1.08] font-bold tracking-tight text-balance'
          >
            Modern luxury,
            <span className='hero-lcp-accent text-gold-gradient mt-0.5 block font-semibold italic'>
              beautifully curated
            </span>
          </Typography.H1>

          <Typography.Muted className='mb-4 max-w-[34ch] text-[0.95rem] leading-relaxed text-pretty'>
            The finest fashion houses and independent makers, in one considered edit.
          </Typography.Muted>

          <Flex align='center' gap={2} className='mb-5 text-sm'>
            <Flex align='center' gap={0.5} aria-hidden>
              {Array.from({ length: 5 }).map((_, index) => (
                <HeroIconStar key={index} className='text-gold size-3.5' />
              ))}
            </Flex>
            <Typography.Muted className='text-sm'>
              <Text as='span' weight='semibold'>
                4.9/5
              </Text>
              {' · 25,000+ members'}
            </Typography.Muted>
          </Flex>

          <Flex direction='column' gap={2.5} className='mb-5'>
            <Link href='/shop' className={primaryCtaClass}>
              Shop new arrivals
              <HeroIconArrowRight className='cn-rtl-flip size-4 shrink-0 transition-transform group-active:translate-x-0.5 rtl:group-active:-translate-x-0.5' />
            </Link>
            <Link href='/collections' className={secondaryCtaClass}>
              Explore collections
            </Link>
          </Flex>

          <Flex wrap='wrap' gap={5} className='text-muted-foreground mb-6 text-xs'>
            <span className='inline-flex items-center gap-1.5'>
              <HeroIconTruck className='text-gold size-3.5 shrink-0' />
              Free worldwide shipping
            </span>
            <span className='inline-flex items-center gap-1.5'>
              <HeroIconShieldCheck className='text-gold size-3.5 shrink-0' />
              Authenticity guaranteed
            </span>
          </Flex>

          <Flex align='baseline' justify='between' className='mb-3'>
            <Typography.Overline tone='accent'>The curated edit</Typography.Overline>
            <Typography.Subtle>Swipe →</Typography.Subtle>
          </Flex>

          <Flex
            direction='row'
            gap={3}
            className='-mx-5 mb-7 snap-x snap-mandatory overflow-x-auto px-5 pb-1 [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
          >
            {CURATED_LINKS.map(({ href, label, description, icon: Icon }) => (
              <Link key={label} href={href} className={curatedCardClass}>
                <span className='bg-gold/10 text-gold dark:bg-gold/15 mb-2.5 flex size-9 items-center justify-center rounded-[10px]'>
                  <Icon className='size-[18px]' />
                </span>
                <Typography.Small weight='semibold' className='mb-0.5 block'>
                  {label}
                </Typography.Small>
                <Typography.Subtle className='leading-snug'>{description}</Typography.Subtle>
              </Link>
            ))}
          </Flex>

          <Grid
            cols={2}
            className='border-border/60 bg-border/50 dark:border-border/40 dark:bg-border/30 gap-px overflow-hidden rounded-2xl border'
          >
            {STATS.map((stat) => (
              <Box key={stat.label} className='bg-surface dark:bg-muted/40 p-4'>
                <Typography.Large
                  family='display'
                  className='block text-xl leading-tight font-bold tabular-nums'
                >
                  {stat.value}
                </Typography.Large>
                <Typography.Subtle className='mt-0.5 block'>{stat.label}</Typography.Subtle>
              </Box>
            ))}
          </Grid>
        </Flex>
      </section>
    </Box>
  );
}
