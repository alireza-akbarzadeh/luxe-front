'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';

import { DynamicBreadcrumb } from '@/components/breadcrumb-list';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Grid } from '@/components/ui/grid';
import { Skeleton } from '@/components/ui/skeleton';
import { Typography } from '@/components/ui/typography';
import { listReverseMarketplaceRequests } from '@/lib/api/reverse-marketplace';

function formatBudget(min?: number, max?: number) {
  const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
  if (min != null && max != null) return `${formatter.format(min)} – ${formatter.format(max)}`;
  if (max != null) return `Up to ${formatter.format(max)}`;
  if (min != null) return `From ${formatter.format(min)}`;
  return 'Flexible';
}

export function ReverseMarketplaceDomain() {
  const t = useTranslations('reverseMarketplacePage');
  const { data, isLoading } = useQuery({
    queryKey: ['reverse-marketplace-requests'],
    queryFn: () => listReverseMarketplaceRequests(24),
    staleTime: 60_000
  });

  const requests = data?.data?.requests ?? [];

  return (
    <main className='pb-24'>
      <div className='app-container pt-24'>
        <DynamicBreadcrumb items={[{ label: t('breadcrumb') }]} showBackButton={false} />

        <div className='mt-10 max-w-3xl'>
          <Typography.Overline className='text-gold'>{t('eyebrow')}</Typography.Overline>
          <Typography.H1 className='font-display mt-3 text-4xl font-bold tracking-tight lg:text-5xl'>
            {t('title')}
          </Typography.H1>
          <Typography.P className='text-muted-foreground mt-4 leading-relaxed'>{t('description')}</Typography.P>
          <Button asChild className='mt-6 rounded-full'>
            <Link href='/reverse-marketplace/new'>{t('postRequest')}</Link>
          </Button>
        </div>

        {isLoading ? (
          <Grid gap={6} className='mt-12 grid-cols-1 md:grid-cols-2'>
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className='h-40 w-full rounded-2xl' />
            ))}
          </Grid>
        ) : requests.length > 0 ? (
          <Grid gap={6} className='mt-12 grid-cols-1 md:grid-cols-2'>
            {requests.map((request) => (
              <Card key={request.id} className='border-border/40 rounded-2xl shadow-none'>
                <CardHeader className='space-y-2'>
                  <div className='flex flex-wrap items-center gap-2'>
                    {request.category ? (
                      <Badge variant='outline' className='rounded-full'>
                        {request.category}
                      </Badge>
                    ) : null}
                    <Badge variant='secondary' className='rounded-full'>
                      {t('offerCount', { count: request.offer_count ?? 0 })}
                    </Badge>
                  </div>
                  <CardTitle className='text-lg'>{request.title}</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  {request.description ? (
                    <p className='text-muted-foreground line-clamp-3 text-sm'>{request.description}</p>
                  ) : null}
                  <p className='text-sm font-medium'>{formatBudget(request.budget_min, request.budget_max)}</p>
                  <Button asChild variant='outline' className='rounded-full'>
                    <Link href={`/reverse-marketplace/${request.id}`}>{t('viewRequest')}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Grid>
        ) : (
          <p className='text-muted-foreground mt-12 text-sm'>{t('empty')}</p>
        )}
      </div>
    </main>
  );
}
