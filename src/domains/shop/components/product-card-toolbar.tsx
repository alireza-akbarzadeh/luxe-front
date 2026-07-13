'use client';

import {
  IconArrowsMaximize,
  IconDots,
  IconGitCompare,
  IconShare3,
  IconX
} from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { type MouseEvent, useState } from 'react';

import { LikeButton } from '@/components/buttons/like-button';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import useCompareController from '@/domains/compare/hooks/useCompareController';
import { cn, copyToClipboard } from '@/lib/utils';

type ProductCardToolbarProps = {
  productId: number;
  productName: string;
  productHref: string;
  isLiked: boolean;
  compact?: boolean;
};

const toolBtnClass =
  'bg-background/90 hover:bg-background size-9 shrink-0 rounded-full border shadow-sm backdrop-blur-sm';

/**
 * Expandable product-card action rail — like, share, compare, full product page.
 */
export function ProductCardToolbar({
  productId,
  productName,
  productHref,
  isLiked,
  compact = false
}: ProductCardToolbarProps) {
  const t = useTranslations('shop.productCard');
  const [open, setOpen] = useState(false);
  const { addItem, removeItem, isInCompare } = useCompareController();
  const compared = isInCompare(productId);

  const stop = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleShare = async (event: MouseEvent) => {
    stop(event);
    const url = `${window.location.origin}${productHref}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: productName, url });
        return;
      }
    } catch (error) {
      if ((error as Error).name === 'AbortError') return;
    }
    await copyToClipboard(url, t('linkCopiedLabel'));
  };

  const handleCompare = async (event: MouseEvent) => {
    stop(event);
    if (compared) {
      await removeItem(productId);
      return;
    }
    await addItem(productId);
  };

  return (
    <TooltipProvider>
      <div
        className={cn(
          'pointer-events-auto absolute end-2.5 top-2.5 z-20 flex flex-col items-end gap-1.5',
          compact && 'end-2 top-2'
        )}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type='button'
              size='icon'
              variant='outline'
              aria-expanded={open}
              aria-label={open ? t('toolbarClose') : t('toolbarOpen')}
              className={toolBtnClass}
              onClick={(event) => {
                stop(event);
                setOpen((value) => !value);
              }}
            >
              {open ? <IconX className='size-4' /> : <IconDots className='size-4' />}
            </Button>
          </TooltipTrigger>
          <TooltipContent side='left'>{open ? t('toolbarClose') : t('toolbarOpen')}</TooltipContent>
        </Tooltip>

        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              key='product-card-tools'
              className='flex flex-col items-end gap-1.5'
              initial={{ opacity: 0, y: -6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 420, damping: 28 }}
            >
              <LikeButton
                isLiked={isLiked}
                productId={productId}
                productName={productName}
                className={toolBtnClass}
              />

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type='button'
                    size='icon'
                    variant='outline'
                    aria-label={t('share')}
                    className={toolBtnClass}
                    onClick={handleShare}
                  >
                    <IconShare3 className='size-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side='left'>{t('share')}</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type='button'
                    size='icon'
                    variant={compared ? 'secondary' : 'outline'}
                    aria-label={compared ? t('removeCompare') : t('compare')}
                    aria-pressed={compared}
                    className={toolBtnClass}
                    onClick={handleCompare}
                  >
                    <IconGitCompare className='size-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side='left'>
                  {compared ? t('removeCompare') : t('compare')}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type='button'
                    size='icon'
                    variant='outline'
                    className={toolBtnClass}
                    asChild
                  >
                    <Link
                      href={productHref}
                      aria-label={t('fullDetails')}
                      onClick={(event) => event.stopPropagation()}
                    >
                      <IconArrowsMaximize className='size-4' />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side='left'>{t('fullDetails')}</TooltipContent>
              </Tooltip>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
}
