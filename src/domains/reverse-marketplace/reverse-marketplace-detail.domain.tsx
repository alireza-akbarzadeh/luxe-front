'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { DynamicBreadcrumb } from '@/components/breadcrumb-list';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Typography } from '@/components/ui/typography';
import { getReverseMarketplaceRequest } from '@/lib/api/reverse-marketplace';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

interface ReverseMarketplaceDetailDomainProps {
  requestId: number;
}

export function ReverseMarketplaceDetailDomain({ requestId }: ReverseMarketplaceDetailDomainProps) {
  const t = useTranslations('reverseMarketplacePage');
  const { data, isLoading, isError } = useQuery({
    queryKey: ['reverse-marketplace-request', requestId],
    queryFn: () => getReverseMarketplaceRequest(requestId),
    staleTime: 60_000
  });

  const request = data?.data;
  const offers = request?.offers ?? [];

  return (
    <main className='pb-24'>
      <div className='app-container max-w-3xl pt-24'>
        <DynamicBreadcrumb
          items={[
            { label: t('breadcrumb'), href: '/reverse-marketplace' },
            { label: request?.title ?? t('request') }
          ]}
          showBackButton={false}
        />

        {isLoading ? (
          <Skeleton className='mt-10 h-48 w-full rounded-2xl' />
        ) : isError || !request ? (
          <div className='mt-10 space-y-4'>
            <Typography.P className='text-muted-foreground'>{t('notFound')}</Typography.P>
            <Button asChild variant='outline' className='rounded-full'>
              <Link href='/reverse-marketplace'>{t('backToList')}</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className='mt-10 space-y-3'>
              <div className='flex flex-wrap items-center gap-2'>
                {request.category ? (
                  <Badge variant='outline' className='rounded-full'>
                    {request.category}
                  </Badge>
                ) : null}
                <Badge variant='secondary' className='rounded-full capitalize'>
                  {request.status}
                </Badge>
              </div>
              <Typography.H1 className='font-display text-3xl font-bold tracking-tight'>
                {request.title}
              </Typography.H1>
              {request.description ? (
                <Typography.P className='text-muted-foreground leading-relaxed'>
                  {request.description}
                </Typography.P>
              ) : null}
            </div>

            <Card className='border-border/40 mt-8 rounded-2xl shadow-none'>
              <CardHeader>
                <CardTitle>{t('vendorOffers', { count: offers.length })}</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {offers.length === 0 ? (
                  <p className='text-muted-foreground text-sm'>{t('noOffersYet')}</p>
                ) : (
                  offers.map((offer) => (
                    <div key={offer.id} className='border-border/50 rounded-2xl border p-4'>
                      <div className='flex flex-wrap items-center justify-between gap-2'>
                        <p className='font-medium'>{offer.store_name ?? t('vendorOffer')}</p>
                        <p className='text-lg font-semibold tabular-nums'>
                          {formatCurrency(offer.offered_price ?? 0)}
                        </p>
                      </div>
                      {offer.message ? (
                        <p className='text-muted-foreground mt-2 text-sm'>{offer.message}</p>
                      ) : null}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </main>
  );
}
