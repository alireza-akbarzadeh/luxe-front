'use client';

import { IconCurrencyDollar } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { Input } from '@/components/ui/input';
import { Typography } from '@/components/ui/typography';
import { type AiNegotiationResponse, postAiNegotiation } from '@/lib/api/ai-premium';
import { useLocaleFormatters } from '@/lib/i18n/use-locale-formatters';
import { cn } from '@/lib/utils';

type ProductNegotiationProps = {
  productId: number;
  listPrice: number;
  className?: string;
};

function verdictClass(verdict?: string) {
  switch (verdict) {
    case 'accept':
      return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300';
    case 'decline':
      return 'border-amber-600/30 bg-amber-500/10 text-amber-900 dark:text-amber-300';
    default:
      return 'border-gold/30 bg-gold/10 text-gold-strong';
  }
}

/** AI-assisted price negotiation card on PDP. */
export function ProductNegotiation({ productId, listPrice, className }: ProductNegotiationProps) {
  const t = useTranslations('pdp.negotiation');
  const { formatPrice } = useLocaleFormatters();
  const [offer, setOffer] = useState('');
  const [message, setMessage] = useState('');
  const [result, setResult] = useState<AiNegotiationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async () => {
    const offeredPrice = Number.parseFloat(offer);
    if (!Number.isFinite(offeredPrice) || offeredPrice <= 0 || productId <= 0) {
      return;
    }

    setIsPending(true);
    setError(null);
    setResult(null);

    try {
      const response = await postAiNegotiation({
        product_id: productId,
        offered_price: offeredPrice,
        message: message.trim() || undefined
      });
      setResult(response.data ?? null);
    } catch {
      setError(t('offline'));
    } finally {
      setIsPending(false);
    }
  };

  const verdictKey = result?.verdict ?? 'counter';
  const verdictLabel = t.has(`verdict.${verdictKey}`)
    ? t(`verdict.${verdictKey}`)
    : t('verdict.counter');

  return (
    <Card
      className={cn(
        'border-border/70 from-card to-muted/20 rounded-2xl border bg-linear-to-br p-5 sm:p-6',
        className
      )}
    >
      <Flex direction='row' align='center' spacing={2} className='mb-4'>
        <IconCurrencyDollar className='text-gold-strong size-5' />
        <Typography.H3 className='text-base font-semibold tracking-tight'>
          {t('title')}
        </Typography.H3>
      </Flex>

      <Typography.Muted className='mb-4 text-sm'>
        {t('subtitle', { price: formatPrice(listPrice) })}
      </Typography.Muted>

      <Flex direction='column' spacing={3}>
        <Input
          type='number'
          min={1}
          step='0.01'
          inputMode='decimal'
          placeholder={t('offerPlaceholder')}
          value={offer}
          onChange={(event) => setOffer(event.target.value)}
          aria-label={t('offerLabel')}
        />
        <Input
          placeholder={t('messagePlaceholder')}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          aria-label={t('messageLabel')}
        />
        <Button type='button' onClick={() => void handleSubmit()} disabled={isPending || !offer}>
          {isPending ? t('checking') : t('checkOffer')}
        </Button>
      </Flex>

      {error ? (
        <Typography.Muted className='text-destructive mt-4 text-sm' role='alert'>
          {error}
        </Typography.Muted>
      ) : null}

      {result ? (
        <Flex direction='column' spacing={3} className='mt-5 border-t pt-5'>
          <Flex direction='row' align='center' spacing={2}>
            <Badge variant='outline' className={verdictClass(result.verdict)}>
              {verdictLabel}
            </Badge>
            {result.counter_price != null ? (
              <Typography.Small className='font-medium'>
                {t('counter', { price: formatPrice(result.counter_price) })}
              </Typography.Small>
            ) : null}
          </Flex>
          <Typography.Small className='leading-relaxed'>{result.summary}</Typography.Small>
          {result.tips && result.tips.length > 0 ? (
            <ul className='text-muted-foreground space-y-1.5 text-sm'>
              {result.tips.map((tip) => (
                <li key={tip}>• {tip}</li>
              ))}
            </ul>
          ) : null}
        </Flex>
      ) : null}

      <Typography.Muted className='mt-4 text-xs'>{t('footer')}</Typography.Muted>
    </Card>
  );
}
