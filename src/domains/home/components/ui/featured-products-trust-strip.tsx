import { IconHeadphones, IconLock, IconRefresh, IconTruck } from '@tabler/icons-react';

import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';

export type FeaturedTrustIcon = 'truck' | 'return' | 'lock' | 'headphones';

export type FeaturedTrustItem = {
  icon: FeaturedTrustIcon;
  title: string;
};

const iconMap = {
  truck: IconTruck,
  return: IconRefresh,
  lock: IconLock,
  headphones: IconHeadphones
} as const;

type FeaturedProductsTrustStripProps = {
  items: FeaturedTrustItem[];
};

/** Compact trust row inside the featured products panel footer. */
export function FeaturedProductsTrustStrip({ items }: FeaturedProductsTrustStripProps) {
  if (items.length === 0) return null;

  return (
    <ul className='border-border/50 sm:divide-border/50 mt-5 grid grid-cols-2 gap-x-2 gap-y-3 border-t pt-4 sm:grid-cols-4 sm:gap-0 sm:divide-x'>
      {items.map((item) => {
        const Icon = iconMap[item.icon];
        return (
          <li key={item.title} className='sm:px-3'>
            <Flex direction='column' align='center' gap={1.5} className='text-center'>
              <Flex
                align='center'
                justify='center'
                className='bg-gold/12 text-gold size-9 rounded-full'
              >
                <Icon className='size-4' stroke={1.5} />
              </Flex>
              <Typography.Text
                variant='subtle'
                weight='medium'
                align='center'
                className='text-[11px] leading-snug sm:text-xs'
              >
                {item.title}
              </Typography.Text>
            </Flex>
          </li>
        );
      })}
    </ul>
  );
}
