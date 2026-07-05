'use client';

import {
  IconAlertTriangle,
  IconCircleCheck,
  IconClock,
  IconSparkles,
  IconThumbUp
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Message, MessageContent, MessageResponse } from '@/components/ai/message';
import { Shimmer } from '@/components/ai/shimmer';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { Typography } from '@/components/ui/typography';
import { PdpInsightShell } from '@/domains/product/components/pdp-insight-shell';
import { useProductPurchaseAdvisor } from '@/domains/product/hooks/use-product-purchase-advisor';
import { PDP_WIDE_INSIGHT_SHELL_CLASS } from '@/domains/product/lib/pdp-insight-layout';
import { cn } from '@/lib/utils';
import type { DtoAiPurchaseAdvisorResponse } from '@/services/-ai-purchase-advisor-post.schemas';

type ProductPurchaseAdvisorProps = {
  productId: number;
  enabled?: boolean;
  className?: string;
};

function verdictBadgeClass(verdict?: string) {
  switch (verdict) {
    case 'buy':
      return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300';
    case 'wait':
      return 'border-amber-600/30 bg-amber-500/10 text-amber-900 dark:text-amber-300';
    default:
      return 'border-gold/30 bg-gold/10 text-gold-strong';
  }
}

function VerdictIcon({ verdict }: { verdict?: string }) {
  if (verdict === 'buy') {
    return <IconCircleCheck className='size-5 shrink-0 text-emerald-600 dark:text-emerald-400' />;
  }
  if (verdict === 'wait') {
    return <IconClock className='size-5 shrink-0 text-amber-700 dark:text-amber-400' />;
  }
  return <IconThumbUp className='text-gold-strong size-5 shrink-0' />;
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className='text-muted-foreground space-y-2 ps-1 text-sm leading-relaxed'>
      {items.map((item) => (
        <li key={item} className='flex gap-2'>
          <span className='text-muted-foreground/60 mt-2 size-1 shrink-0 rounded-full bg-current' />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** AI purchase advisor card — buy / wait / consider guidance on PDP insights. */
export function ProductPurchaseAdvisor({
  productId,
  enabled = false,
  className
}: ProductPurchaseAdvisorProps) {
  const t = useTranslations('pdp.purchaseAdvisor');
  const { fetchPurchaseAdvisor, isPending, offlineMessage } = useProductPurchaseAdvisor(productId);
  const [advisor, setAdvisor] = useState<DtoAiPurchaseAdvisorResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || productId <= 0) {
      return;
    }

    let cancelled = false;

    const load = async () => {
      setError(null);
      setAdvisor(null);
      const result = await fetchPurchaseAdvisor();
      if (cancelled) {
        return;
      }
      if (!result) {
        setError(offlineMessage);
        return;
      }
      setAdvisor(result);
    };

    void load();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- enabled + productId gate fetch
  }, [productId, enabled]);

  if (productId <= 0) {
    return null;
  }

  if (!enabled) {
    return (
      <PdpInsightShell
        title={t('title')}
        icon={<IconSparkles className='text-gold-strong size-5 shrink-0' />}
        shellClassName={PDP_WIDE_INSIGHT_SHELL_CLASS}
        className={className}
      />
    );
  }

  return (
    <Card
      className={cn(
        'border-border/70 from-card to-muted/20 rounded-2xl border bg-linear-to-br p-5 sm:p-6',
        className
      )}
    >
      <Flex direction='row' align='center' justify='between' spacing={3} className='mb-4 gap-3'>
        <Flex direction='row' align='center' spacing={2} className='min-w-0'>
          <IconSparkles className='text-gold-strong size-5 shrink-0' />
          <Typography.H3 className='text-base font-semibold tracking-tight'>
            {t('title')}
          </Typography.H3>
        </Flex>
        {advisor?.verdict ? (
          <Badge
            variant='outline'
            className={cn('shrink-0 rounded-full capitalize', verdictBadgeClass(advisor.verdict))}
          >
            {t(`verdict.${advisor.verdict}`)}
          </Badge>
        ) : null}
      </Flex>

      {isPending ? (
        <Flex direction='column' spacing={2} className='py-2'>
          <Shimmer as='span' className='text-muted-foreground text-sm'>
            {t('loading')}
          </Shimmer>
        </Flex>
      ) : error ? (
        <Flex direction='column' spacing={2} align='center' className='py-4 text-center'>
          <IconAlertTriangle className='text-muted-foreground size-5' />
          <Typography.Text variant='small' className='text-muted-foreground max-w-sm'>
            {error}
          </Typography.Text>
        </Flex>
      ) : advisor ? (
        <Flex direction='column' spacing={5}>
          <Flex direction='row' align='start' spacing={3}>
            <VerdictIcon verdict={advisor.verdict} />
            <Flex direction='column' spacing={2} className='min-w-0 flex-1'>
              {advisor.summary ? (
                <Message from='assistant' className='max-w-none'>
                  <MessageContent className='w-full max-w-none px-0 py-0'>
                    <MessageResponse className='text-muted-foreground text-sm leading-relaxed'>
                      {advisor.summary}
                    </MessageResponse>
                  </MessageContent>
                </Message>
              ) : null}
              {advisor.confidence ? (
                <Typography.Muted className='text-xs capitalize'>
                  {t('confidence', { level: advisor.confidence })}
                </Typography.Muted>
              ) : null}
            </Flex>
          </Flex>

          {advisor.pros && advisor.pros.length > 0 ? (
            <Flex direction='column' spacing={2}>
              <Typography.Text className='text-sm font-medium'>{t('pros')}</Typography.Text>
              <BulletList items={advisor.pros} />
            </Flex>
          ) : null}

          {advisor.cons && advisor.cons.length > 0 ? (
            <Flex direction='column' spacing={2}>
              <Typography.Text className='text-sm font-medium'>{t('cons')}</Typography.Text>
              <BulletList items={advisor.cons} />
            </Flex>
          ) : null}

          {(advisor.ideal_for && advisor.ideal_for.length > 0) ||
          (advisor.considerations && advisor.considerations.length > 0) ? (
            <Grid template='1-2' gap={4}>
              {advisor.ideal_for && advisor.ideal_for.length > 0 ? (
                <Flex direction='column' spacing={2}>
                  <Typography.Text className='text-sm font-medium'>{t('idealFor')}</Typography.Text>
                  <BulletList items={advisor.ideal_for} />
                </Flex>
              ) : null}
              {advisor.considerations && advisor.considerations.length > 0 ? (
                <Flex direction='column' spacing={2}>
                  <Typography.Text className='text-sm font-medium'>
                    {t('considerations')}
                  </Typography.Text>
                  <BulletList items={advisor.considerations} />
                </Flex>
              ) : null}
            </Grid>
          ) : null}

          <Typography.Muted className='text-center text-xs'>{t('footer')}</Typography.Muted>
        </Flex>
      ) : null}
    </Card>
  );
}
