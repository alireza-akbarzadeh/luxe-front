'use client';

import { IconLoader2, IconSettingsAutomation } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Flex } from '@/components/ui/flex';
import { Textarea } from '@/components/ui/textarea';
import { Typography } from '@/components/ui/typography';
import type { DtoAiProductConfiguratorResponse } from '@/services/-ai-product-configurator-post.schemas';

import { useProductConfigurator } from '../../hooks/use-product-configurator';
import { ConfiguratorResults } from './configurator-results';

interface ProductConfiguratorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: number;
  productName?: string;
  currentPreferences?: Record<string, string>;
  onApplyConfiguration: (result: DtoAiProductConfiguratorResponse) => void;
}

/** Dialog for AI-guided variant configuration from shopper context. */
export function ProductConfiguratorDialog({
  open,
  onOpenChange,
  productId,
  productName,
  currentPreferences,
  onApplyConfiguration
}: ProductConfiguratorDialogProps) {
  const t = useTranslations('pdp.configurator');
  const { configure, isPending } = useProductConfigurator(productId);
  const [context, setContext] = useState('');
  const [result, setResult] = useState<DtoAiProductConfiguratorResponse | null>(null);

  const reset = () => {
    setContext('');
    setResult(null);
  };

  const handleClose = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      reset();
    }
  };

  const handleConfigure = async () => {
    if (isPending) return;
    const data = await configure(context, currentPreferences);
    if (!data) {
      toast.error(t('errors.configureFailed'));
      return;
    }
    setResult(data);
  };

  const handleApply = () => {
    if (!result) return;
    onApplyConfiguration(result);
    toast.success(t('applied'));
    handleClose(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='max-w-md gap-0 overflow-hidden p-0'>
        <DialogHeader className='space-y-1 px-6 pt-6 pb-4 text-start'>
          <DialogTitle className='flex items-center gap-2'>
            <IconSettingsAutomation className='size-5' />
            {t('title')}
          </DialogTitle>
          <DialogDescription>
            {productName ? t('descriptionNamed', { name: productName }) : t('description')}
          </DialogDescription>
        </DialogHeader>

        <div className='px-6 pb-6'>
          {result ? (
            <ConfiguratorResults result={result} onApply={handleApply} onStartOver={reset} />
          ) : (
            <>
              <Textarea
                value={context}
                onChange={(event) => setContext(event.target.value)}
                placeholder={t('contextPlaceholder')}
                rows={4}
                className='mb-4 min-h-28 resize-none rounded-2xl'
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
                onClick={() => void handleConfigure()}
              >
                {isPending ? (
                  <>
                    <IconLoader2 className='me-2 size-4 animate-spin' />
                    {t('configuring')}
                  </>
                ) : (
                  t('configure')
                )}
              </Button>
            </Flex>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
