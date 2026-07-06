'use client';

import {
  IconBulb,
  IconLoader2,
  IconRefresh,
  IconRobot,
  IconSparkles,
  IconSpeakerphone
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useVendorAiCustomerSegmentsQuery } from '@/domains/vendor/panel/hooks/use-vendor-ai-customer-segments';

function InsightList({
  title,
  items,
  icon: Icon
}: {
  title: string;
  items: string[];
  icon: React.ComponentType<{ className?: string }>;
}) {
  if (items.length === 0) return null;

  return (
    <div className='space-y-2'>
      <p className='text-muted-foreground flex items-center gap-2 text-xs font-medium tracking-wide uppercase'>
        <Icon className='size-3.5' aria-hidden />
        {title}
      </p>
      <ul className='space-y-2'>
        {items.map((item) => (
          <li key={item} className='bg-muted/30 rounded-xl px-3 py-2 text-sm leading-relaxed'>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

interface VendorAiCustomerSegmentsPanelProps {
  days?: number;
}

export function VendorAiCustomerSegmentsPanel({ days = 365 }: VendorAiCustomerSegmentsPanelProps) {
  const t = useTranslations('vendor.panel.customerSegments');
  const { data, isLoading, isError, refetch, isFetching } = useVendorAiCustomerSegmentsQuery(days);

  const segments = data?.data;
  const highlights = segments?.highlights ?? [];
  const recommendations = segments?.recommendations ?? [];
  const campaignIdeas = segments?.campaign_ideas ?? [];

  return (
    <Card className='border-border/40 from-accent/5 bg-card/80 rounded-2xl border bg-gradient-to-br to-transparent shadow-none'>
      <CardHeader className='flex flex-row items-start justify-between gap-4 space-y-0'>
        <div className='space-y-1'>
          <div className='flex flex-wrap items-center gap-2'>
            <CardTitle className='text-base'>{t('title')}</CardTitle>
            {segments?.ai_enabled ? (
              <Badge variant='secondary' className='gap-1 rounded-full text-[10px]'>
                <IconSparkles className='size-3' aria-hidden />
                {t('aiPowered')}
              </Badge>
            ) : (
              <Badge variant='outline' className='gap-1 rounded-full text-[10px]'>
                <IconRobot className='size-3' aria-hidden />
                {t('ruleBased')}
              </Badge>
            )}
          </div>
          <p className='text-muted-foreground text-sm'>{t('description')}</p>
        </div>
        <Button
          type='button'
          variant='outline'
          size='sm'
          className='rounded-full'
          onClick={() => void refetch()}
          disabled={isFetching}
        >
          {isFetching ? (
            <IconLoader2 className='size-4 animate-spin' aria-hidden />
          ) : (
            <IconRefresh className='size-4' aria-hidden />
          )}
          <span className='sr-only'>{t('refresh')}</span>
        </Button>
      </CardHeader>
      <CardContent className='space-y-6'>
        {isLoading ? (
          <div className='space-y-3'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-5/6' />
            <Skeleton className='h-20 w-full rounded-xl' />
          </div>
        ) : isError ? (
          <p className='text-destructive text-sm'>{t('error')}</p>
        ) : (
          <>
            {segments?.summary ? (
              <p className='text-sm leading-relaxed'>{segments.summary}</p>
            ) : null}
            <InsightList title={t('highlights')} items={highlights} icon={IconSparkles} />
            <InsightList title={t('recommendations')} items={recommendations} icon={IconBulb} />
            <InsightList title={t('campaignIdeas')} items={campaignIdeas} icon={IconSpeakerphone} />
          </>
        )}
      </CardContent>
    </Card>
  );
}
