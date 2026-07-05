'use client';

import { IconLoader2 } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import { AppDialog } from '@/components/app-dialog';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Typography } from '@/components/ui/typography';
import type { DtoAiOutfitBuilderResponse } from '@/services/-ai-outfit-builder-post.schemas';

import { useOutfitBuilder } from '../../hooks/use-outfit-builder';
import { OutfitBuilderResults } from './outfit-builder-results';

interface ProductOutfitBuilderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: number;
  productName?: string;
}

/** Dialog for building a complete look around the current product. */
export function ProductOutfitBuilderDialog({
  open,
  onOpenChange,
  productId,
  productName
}: ProductOutfitBuilderDialogProps) {
  const t = useTranslations('pdp.outfitBuilder');
  const { buildOutfit, isPending } = useOutfitBuilder(productId);
  const [occasion, setOccasion] = useState('');
  const [context, setContext] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [result, setResult] = useState<DtoAiOutfitBuilderResponse | null>(null);

  const reset = () => {
    setOccasion('');
    setContext('');
    setBudgetMax('');
    setResult(null);
  };

  const handleClose = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      reset();
    }
  };

  const handleBuild = async () => {
    if (isPending) return;
    const parsedBudget = budgetMax.trim() ? Number.parseFloat(budgetMax) : undefined;
    const data = await buildOutfit(occasion, context, parsedBudget);
    if (!data) {
      toast.error(t('errors.buildFailed'));
      return;
    }
    setResult(data);
  };

  return (
    <AppDialog
      open={open}
      onOpenChange={handleClose}
      size='lg'
      title={t('title')}
      description={productName ? t('descriptionNamed', { name: productName }) : t('description')}
    >
      <div className='pb-2'>
        {result ? (
          <OutfitBuilderResults result={result} onStartOver={reset} />
        ) : (
          <>
            <Input
              value={occasion}
              onChange={(event) => setOccasion(event.target.value)}
              placeholder={t('occasionPlaceholder')}
              className='mb-3 rounded-full'
            />
            <Textarea
              value={context}
              onChange={(event) => setContext(event.target.value)}
              placeholder={t('contextPlaceholder')}
              rows={3}
              className='mb-3 min-h-24 resize-none rounded-2xl'
            />
            <Input
              value={budgetMax}
              onChange={(event) => setBudgetMax(event.target.value)}
              placeholder={t('budgetPlaceholder')}
              inputMode='decimal'
              className='mb-3 rounded-full'
            />
            <Typography.Muted className='text-xs leading-relaxed'>
              {t('contextHint')}
            </Typography.Muted>
          </>
        )}

        {!result ? (
          <Flex direction='row' spacing={2} className='mt-4'>
            <Button
              type='button'
              className='flex-1'
              disabled={isPending}
              onClick={() => void handleBuild()}
            >
              {isPending ? (
                <>
                  <IconLoader2 className='me-2 size-4 animate-spin' />
                  {t('building')}
                </>
              ) : (
                t('buildOutfit')
              )}
            </Button>
          </Flex>
        ) : null}
      </div>
    </AppDialog>
  );
}
