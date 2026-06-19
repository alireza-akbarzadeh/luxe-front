'use client';

import { IconCreditCard, IconRefresh } from '@tabler/icons-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useGetPaymentProviders } from '@/services/-payment-providers-get';
import type { DtoPaymentProviderResponse } from '@/services/-payment-providers-get.schemas';
import { useGetPaymentsStripeConfig } from '@/services/-payments-stripe-config-get';

function StatusDot({ active }: { active: boolean }) {
  return (
    <span
      className={cn('inline-block h-2 w-2 rounded-full', active ? 'bg-emerald-500' : 'bg-slate-400')}
    />
  );
}

function ProviderCard({ provider }: { provider: DtoPaymentProviderResponse }) {
  return (
    <Card className='border-border/40'>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between gap-2'>
          <CardTitle className='text-base'>
            {provider.display_name ?? provider.name ?? 'Payment method'}
          </CardTitle>
          <StatusDot active />
        </div>
        {provider.name ? (
          <CardDescription className='font-mono text-xs uppercase'>{provider.name}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className='text-muted-foreground space-y-2 text-sm'>
        {provider.description ? <p>{provider.description}</p> : null}
        <p className='text-xs'>
          {provider.requires_card ? 'Requires card details at checkout' : 'No card required'}
        </p>
      </CardContent>
    </Card>
  );
}

export function GatewaysAdminDomain() {
  const {
    data: providersResponse,
    isLoading: isProvidersLoading,
    isFetching: isProvidersFetching,
    refetch: refetchProviders
  } = useGetPaymentProviders({ is_active: false });

  const {
    data: stripeResponse,
    isLoading: isStripeLoading,
    refetch: refetchStripe
  } = useGetPaymentsStripeConfig();

  const providers = providersResponse?.data ?? [];
  const stripe = stripeResponse?.data;
  const isLoading = isProvidersLoading || isStripeLoading;

  const handleRefresh = () => {
    void refetchProviders();
    void refetchStripe();
  };

  return (
    <Flex direction='column' className='gap-6'>
      <div className='flex flex-wrap items-start justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-semibold tracking-tight'>Payment gateways</h1>
          <p className='text-muted-foreground mt-1 text-sm'>
            Read-only status of checkout payment methods. Secrets are configured via server
            environment variables — never shown here.
          </p>
        </div>
        <Button
          variant='outline'
          size='sm'
          className='gap-2'
          onClick={handleRefresh}
          disabled={isProvidersFetching}
        >
          <IconRefresh className='size-4' />
          Refresh
        </Button>
      </div>

      <Card className='border-border/40 bg-card/40 backdrop-blur-2xl'>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <IconCreditCard className='text-primary size-5' />
            <CardTitle className='text-lg'>Stripe</CardTitle>
          </div>
          <CardDescription>Card payments and wallet top-ups via Stripe Checkout</CardDescription>
        </CardHeader>
        <CardContent className='space-y-3 text-sm'>
          {isStripeLoading ? (
            <Skeleton className='h-16 w-full' />
          ) : (
            <>
              <div className='flex items-center gap-2'>
                <StatusDot active={stripe?.enabled === true} />
                <span className='font-medium'>
                  {stripe?.enabled ? 'Enabled' : 'Disabled (mock / wallet-only mode)'}
                </span>
              </div>
              {stripe?.enabled && stripe.publishable_key ? (
                <p className='text-muted-foreground font-mono text-xs break-all'>
                  Publishable key: {stripe.publishable_key}
                </p>
              ) : null}
              <p className='text-muted-foreground text-xs'>
                Configure <code className='text-foreground'>STRIPE_*</code> in the API{' '}
                <code className='text-foreground'>.env</code>. Webhook endpoint:{' '}
                <code className='text-foreground'>/api/v1/webhooks/stripe</code> — monitor deliveries
                in{' '}
                <Link href='/dashboard/settings/webhooks' className='text-primary underline'>
                  Webhook events
                </Link>
                .
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <div>
        <h2 className='mb-3 text-sm font-medium'>Checkout methods</h2>
        {isLoading ? (
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className='h-36 rounded-xl' />
            ))}
          </div>
        ) : providers.length === 0 ? (
          <p className='text-muted-foreground text-sm'>No payment providers returned by the API.</p>
        ) : (
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {providers.map((provider) => (
              <ProviderCard key={provider.name ?? provider.display_name} provider={provider} />
            ))}
          </div>
        )}
      </div>
    </Flex>
  );
}
