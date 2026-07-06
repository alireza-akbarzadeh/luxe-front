'use client';

import { IconArrowsExchange, IconSparkles } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { DynamicBreadcrumb } from '@/components/breadcrumb-list';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { Input } from '@/components/ui/input';
import { Typography } from '@/components/ui/typography';
import { type AiCompatibilityCheckResponse, postAiCompatibilityCheck } from '@/lib/api/ai-premium';

/** Universal compatibility checker — compare two catalog products. */
export function CompatibilityDomain() {
  const t = useTranslations('compatibilityPage');
  const [productA, setProductA] = useState('');
  const [productB, setProductB] = useState('');
  const [result, setResult] = useState<AiCompatibilityCheckResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleCheck = async () => {
    const idA = Number.parseInt(productA, 10);
    const idB = Number.parseInt(productB, 10);
    if (!Number.isFinite(idA) || !Number.isFinite(idB) || idA <= 0 || idB <= 0 || idA === idB) {
      setError(t('invalidIds'));
      return;
    }

    setIsPending(true);
    setError(null);
    setResult(null);

    try {
      const response = await postAiCompatibilityCheck({
        product_id_a: idA,
        product_id_b: idB
      });
      setResult(response.data ?? null);
    } catch {
      setError(t('offline'));
    } finally {
      setIsPending(false);
    }
  };

  const compatibilityKey = result?.compatibility ?? 'mixed';
  const compatibilityLabel = t.has(`levels.${compatibilityKey}`)
    ? t(`levels.${compatibilityKey}`)
    : t('levels.mixed');

  return (
    <main className='app-container py-12 sm:py-16'>
      <DynamicBreadcrumb items={[{ label: t('title'), href: '/compatibility' }]} />

      <Flex
        direction='column'
        align='center'
        spacing={3}
        className='mx-auto mb-10 max-w-2xl text-center'
      >
        <IconArrowsExchange className='text-gold-strong size-10' aria-hidden />
        <Typography.H1 className='text-3xl font-semibold tracking-tight'>
          {t('title')}
        </Typography.H1>
        <Typography.Muted>{t('subtitle')}</Typography.Muted>
      </Flex>

      <Card className='mx-auto max-w-2xl rounded-2xl p-6'>
        <Flex direction='column' spacing={4}>
          <Flex direction='column' spacing={2}>
            <label className='text-sm font-medium' htmlFor='product-a'>
              {t('productA')}
            </label>
            <Input
              id='product-a'
              inputMode='numeric'
              placeholder={t('idPlaceholder')}
              value={productA}
              onChange={(event) => setProductA(event.target.value)}
            />
          </Flex>
          <Flex direction='column' spacing={2}>
            <label className='text-sm font-medium' htmlFor='product-b'>
              {t('productB')}
            </label>
            <Input
              id='product-b'
              inputMode='numeric'
              placeholder={t('idPlaceholder')}
              value={productB}
              onChange={(event) => setProductB(event.target.value)}
            />
          </Flex>
          <Button type='button' onClick={() => void handleCheck()} disabled={isPending}>
            {isPending ? t('checking') : t('check')}
          </Button>
          {error ? (
            <Typography.Muted className='text-destructive text-sm' role='alert'>
              {error}
            </Typography.Muted>
          ) : null}
        </Flex>
      </Card>

      {result ? (
        <Card className='mx-auto mt-8 max-w-2xl rounded-2xl p-6'>
          <Flex direction='column' spacing={4}>
            <Flex direction='row' align='center' justify='between' spacing={3}>
              <Typography.H2 className='text-xl font-semibold'>{compatibilityLabel}</Typography.H2>
              <Typography.Large className='text-accent font-semibold'>
                {result.score ?? 0}/100
              </Typography.Large>
            </Flex>
            {result.category ? (
              <Typography.Overline className='text-muted-foreground'>
                {result.category}
              </Typography.Overline>
            ) : null}
            <Typography.Small className='leading-relaxed'>{result.summary}</Typography.Small>
            {result.works_well && result.works_well.length > 0 ? (
              <Flex direction='column' spacing={2}>
                <Typography.Small className='font-medium'>{t('worksWell')}</Typography.Small>
                <ul className='text-muted-foreground space-y-1 text-sm'>
                  {result.works_well.map((item) => (
                    <li key={item} className='flex gap-2'>
                      <IconSparkles className='text-accent mt-0.5 size-3.5 shrink-0' />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Flex>
            ) : null}
            {result.concerns && result.concerns.length > 0 ? (
              <Flex direction='column' spacing={2}>
                <Typography.Small className='font-medium'>{t('concerns')}</Typography.Small>
                <ul className='text-muted-foreground space-y-1 text-sm'>
                  {result.concerns.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </Flex>
            ) : null}
          </Flex>
        </Card>
      ) : null}
    </main>
  );
}
