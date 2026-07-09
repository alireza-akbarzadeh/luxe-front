'use client';

import Link from 'next/link';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { PromotionKpiCards } from '@/domains/promotions-admin/components/promotion-kpi-cards';

const PROMOTION_LINKS = [
  {
    href: '/dashboard/promotions/flash-sales',
    title: 'Flash sales',
    description: 'Time-limited product deals on the homepage countdown.'
  },
  {
    href: '/dashboard/promotions/banners',
    title: 'Featured banners',
    description: 'Seasonal picks and hero blocks for the storefront home page.'
  },
  {
    href: '/dashboard/promotions/campaigns',
    title: 'Campaigns',
    description: 'Group placements into scheduled merchandising campaigns.'
  },
  {
    href: '/dashboard/collections',
    title: 'Landing pages',
    description: 'Curated collections with hero images and schedule windows.'
  }
] as const;

export function PromotionsDomain() {
  return (
    <Flex direction='column' className='gap-6'>
      <Flex direction='column' spacing={1}>
        <Typography.H2>Promotions</Typography.H2>
        <Typography.Muted>
          Merchandising for the storefront — flash sales, banners, campaigns, and landing pages.
        </Typography.Muted>
      </Flex>

      <PromotionKpiCards />

      <div className='grid gap-4 md:grid-cols-2'>
        {PROMOTION_LINKS.map((item) => (
          <Link key={item.href} href={item.href} className='block'>
            <Card className='hover:border-primary/40 h-full transition-colors'>
              <CardHeader>
                <CardTitle className='text-base'>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </Flex>
  );
}
