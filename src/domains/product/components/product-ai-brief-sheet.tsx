'use client';

import {
  IconAlertTriangle,
  IconArrowsLeftRight,
  IconCircleCheck,
  IconClock,
  IconSparkles,
  IconThumbDown,
  IconThumbUp,
  IconUsers
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Typography } from '@/components/ui/typography';
import type { DtoAiProductBriefResponse } from '@/services/-ai-product-brief-post.schemas';

import { useProductAiBrief } from '../hooks/use-product-ai-brief';

interface ProductAiBriefSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: number;
  productName?: string;
}

interface BriefSectionProps {
  title: string;
  items?: string[];
  icon: React.ReactNode;
  tone?: 'positive' | 'negative' | 'neutral';
}

function BriefSection({ title, items, icon, tone = 'neutral' }: BriefSectionProps) {
  if (!items?.length) {
    return null;
  }

  const toneClass =
    tone === 'positive'
      ? 'text-emerald-600 dark:text-emerald-400'
      : tone === 'negative'
        ? 'text-amber-700 dark:text-amber-400'
        : 'text-foreground';

  return (
    <Flex direction='column' spacing={3}>
      <Flex direction='row' align='center' spacing={2}>
        <span className={toneClass}>{icon}</span>
        <Typography.Text className='font-medium'>{title}</Typography.Text>
      </Flex>
      <ul className='text-muted-foreground space-y-2 ps-1 text-sm leading-relaxed'>
        {items.map((item) => (
          <li key={item} className='flex gap-2'>
            <span className='text-muted-foreground/60 mt-2 size-1 shrink-0 rounded-full bg-current' />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Flex>
  );
}

function ProductAiBriefPanel({
  productId,
  productName
}: {
  productId: number;
  productName?: string;
}) {
  const t = useTranslations('pdp.brief');
  const { fetchBrief, isPending, offlineMessage } = useProductAiBrief(productId);
  const [brief, setBrief] = useState<DtoAiProductBriefResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setError(null);
      const result = await fetchBrief();
      if (cancelled) {
        return;
      }
      if (!result) {
        setError(offlineMessage);
        return;
      }
      setBrief(result);
    };

    void load();

    return () => {
      cancelled = true;
    };
    // Panel remounts per product; fetch once when the sheet opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- productId only
  }, [productId]);

  return (
    <>
      <SheetHeader className='border-border border-b px-4 py-3'>
        <Flex direction='row' align='center' spacing={3}>
          <Flex align='center' justify='center' className='bg-gold/15 size-9 shrink-0 rounded-full'>
            <IconClock className='text-gold-strong size-[18px]' />
          </Flex>
          <Flex direction='column' spacing={0} className='min-w-0 flex-1'>
            <SheetTitle className='text-base'>{t('title')}</SheetTitle>
            {productName ? (
              <Typography.Muted className='truncate text-xs'>{productName}</Typography.Muted>
            ) : null}
          </Flex>
        </Flex>
      </SheetHeader>

      <Flex direction='column' spacing={6} className='min-h-0 flex-1 overflow-y-auto px-4 py-5'>
        {isPending ? (
          <Flex direction='column' spacing={3} align='center' className='py-10'>
            <IconSparkles className='text-gold-strong size-6 animate-pulse' />
            <Typography.Muted className='text-sm'>{t('loading')}</Typography.Muted>
          </Flex>
        ) : error ? (
          <Flex direction='column' spacing={3} align='center' className='py-10 text-center'>
            <IconAlertTriangle className='text-muted-foreground size-6' />
            <Typography.Text variant='small' className='text-muted-foreground max-w-sm'>
              {error}
            </Typography.Text>
          </Flex>
        ) : brief ? (
          <>
            <BriefSection
              title={t('pros')}
              items={brief.pros}
              icon={<IconCircleCheck className='size-4' />}
              tone='positive'
            />
            <BriefSection
              title={t('cons')}
              items={brief.cons}
              icon={<IconThumbDown className='size-4' />}
              tone='negative'
            />
            <BriefSection
              title={t('whoShouldBuy')}
              items={brief.who_should_buy}
              icon={<IconThumbUp className='size-4' />}
            />
            <BriefSection
              title={t('whoShouldNot')}
              items={brief.who_should_not}
              icon={<IconUsers className='size-4' />}
            />
            <BriefSection
              title={t('alternatives')}
              items={brief.alternatives}
              icon={<IconArrowsLeftRight className='size-4' />}
            />
          </>
        ) : null}
      </Flex>

      <Flex className='border-border border-t px-4 py-3'>
        <Typography.Muted className='text-center text-xs'>{t('footer')}</Typography.Muted>
      </Flex>
    </>
  );
}

export function ProductAiBriefSheet({
  open,
  onOpenChange,
  productId,
  productName
}: ProductAiBriefSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side='right' className='flex w-full flex-col gap-0 p-0 sm:max-w-md'>
        {open ? (
          <ProductAiBriefPanel
            key={String(productId)}
            productId={productId}
            productName={productName}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

/** PDP trigger for the 30-second AI product brief. */
export function ProductAiBriefButton({
  productId,
  productName
}: {
  productId: number;
  productName?: string;
}) {
  const t = useTranslations('pdp.brief');
  const [open, setOpen] = useState(false);

  if (!productId) {
    return null;
  }

  return (
    <>
      <Button
        type='button'
        variant='outline'
        className='border-gold/30 bg-gold/5 hover:bg-gold/10 h-11 w-full justify-start gap-2 rounded-full px-4 text-sm font-medium'
        onClick={() => setOpen(true)}
      >
        <IconSparkles className='text-gold-strong size-4 shrink-0' />
        {t('button')}
      </Button>
      <ProductAiBriefSheet
        open={open}
        onOpenChange={setOpen}
        productId={productId}
        productName={productName}
      />
    </>
  );
}
