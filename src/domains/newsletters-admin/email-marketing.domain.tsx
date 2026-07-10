'use client';

import Link from 'next/link';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { EmailMarketingKpiCards } from '@/domains/newsletters-admin/components/email-marketing-kpi-cards';

const MARKETING_LINKS = [
  {
    href: '/dashboard/marketing/subscribers',
    title: 'Subscribers',
    description: 'Opt-ins from homepage, footer, checkout, and registration — export to CSV.'
  },
  {
    href: '/dashboard/marketing/templates',
    title: 'Templates',
    description: 'Reusable HTML email layouts for campaigns.'
  },
  {
    href: '/dashboard/marketing/campaigns',
    title: 'Email campaigns',
    description:
      'Segment audiences and send via the job queue (distinct from merchandising campaigns).'
  }
] as const;

export function EmailMarketingDomain() {
  return (
    <Flex direction='column' className='gap-6'>
      <Flex direction='column' spacing={1}>
        <Typography.H2>Email marketing</Typography.H2>
        <Typography.Muted>
          Subscribers, templates, segmented campaigns, and delivery analytics.
        </Typography.Muted>
      </Flex>

      <EmailMarketingKpiCards />

      <div className='grid gap-4 md:grid-cols-2'>
        {MARKETING_LINKS.map((item) => (
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
