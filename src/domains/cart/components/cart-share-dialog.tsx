'use client';

import { IconCheck, IconCopy, IconLink } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import { AppDialog } from '@/components/app-dialog';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Input } from '@/components/ui/input';
import { Typography } from '@/components/ui/typography';
import {
  buildCartShareUrl,
  type CartShareSourceItem,
  encodeCartShare
} from '@/domains/cart/lib/cart-share';
import { copyToClipboard } from '@/lib/utils';

type CartShareDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CartShareSourceItem[];
};

export function CartShareDialog({ open, onOpenChange, items }: Readonly<CartShareDialogProps>) {
  const t = useTranslations('cart.share');
  const [copiedKey, setCopiedKey] = useState<'link' | 'code' | null>(null);

  const code = encodeCartShare(items);
  const shareUrl = code ? buildCartShareUrl(code) : '';

  const markCopied = (key: 'link' | 'code') => {
    setCopiedKey(key);
    window.setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCopyLink = async () => {
    if (!shareUrl) {
      toast.error(t('emptyError'));
      return;
    }
    await copyToClipboard(shareUrl, t('linkLabel'));
    markCopied('link');
  };

  const handleCopyCode = async () => {
    if (!code) {
      toast.error(t('emptyError'));
      return;
    }
    await copyToClipboard(code, t('codeLabel'));
    markCopied('code');
  };

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('title')}
      description={t('description')}
      size='md'
    >
      <Flex direction='column' spacing={4} className='pt-1'>
        <div className='space-y-2'>
          <Typography.Label className='text-sm font-medium'>{t('linkLabel')}</Typography.Label>
          <Flex spacing={2} align='center'>
            <Input readOnly value={shareUrl} className='font-mono text-xs' />
            <Button
              type='button'
              variant='outline'
              size='icon'
              className='shrink-0 rounded-full'
              onClick={() => void handleCopyLink()}
              aria-label={t('copyLink')}
            >
              {copiedKey === 'link' ? (
                <IconCheck className='size-4 text-green-500' />
              ) : (
                <IconLink className='size-4' />
              )}
            </Button>
          </Flex>
        </div>

        <div className='space-y-2'>
          <Typography.Label className='text-sm font-medium'>{t('codeLabel')}</Typography.Label>
          <Flex spacing={2} align='center'>
            <Input readOnly value={code ?? ''} className='font-mono text-xs' />
            <Button
              type='button'
              variant='outline'
              size='icon'
              className='shrink-0 rounded-full'
              onClick={() => void handleCopyCode()}
              aria-label={t('copyCode')}
            >
              {copiedKey === 'code' ? (
                <IconCheck className='size-4 text-green-500' />
              ) : (
                <IconCopy className='size-4' />
              )}
            </Button>
          </Flex>
          <Typography.Muted className='text-xs'>{t('codeHint')}</Typography.Muted>
        </div>

        <Button type='button' className='rounded-full' onClick={() => void handleCopyLink()}>
          {t('copyLink')}
        </Button>
      </Flex>
    </AppDialog>
  );
}
