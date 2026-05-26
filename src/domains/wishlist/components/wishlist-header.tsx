import { IconCheck, IconChevronRight, IconCopy, IconShare2, IconTrash } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DynamicBreadcrumb } from '~/src/components/breadcrumb-list';
import { useWishlistStore } from '~/src/domains/wishlist/wishlist.store';

interface WishlistHeaderProperties {
  itemLength: number;
}

export function WishlistHeader(properties: Readonly<WishlistHeaderProperties>) {
  const { itemLength } = properties;
  const { isCopied, setIsCopied, clearSelection } = useWishlistStore();
  const isShareSupported = typeof navigator !== 'undefined' && 'share' in navigator;

  const handleShare = async () => {
    const shareText = `Check out my wishlist with ${itemLength} items!`;

    if (isShareSupported) {
      try {
        await navigator.share({
          title: 'My Luxe Wishlist',
          text: shareText,
          url: globalThis.location.href
        });
        toast.success('Wishlist shared successfully!');
      } catch {
        // User cancelled share window or native interface threw error
      }
    } else {
      await navigator.clipboard.writeText(globalThis.location.href);
      setIsCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
      toast.error('Failed to copy link. Please try copying the URL bar.');
    }
  };

  let shareTooltipText = 'Copy Wishlist Link';
  if (isCopied) {
    shareTooltipText = 'Copied!';
  } else if (isShareSupported) {
    shareTooltipText = 'Share Wishlist';
  }

  return (
    <div className='mb-8 space-y-4'>
      <DynamicBreadcrumb
        items={[{ label: 'Wishlist' }]}
        direction='column'
        separator={<IconChevronRight className='h-3 w-3' />}
        className='text-muted-foreground text-xs'
        breadcrumbClassName='flex items-center gap-1.5'
      />
      <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight md:text-4xl'>My Wishlist</h1>
          <p className='text-muted-foreground mt-1 text-sm md:text-base'>
            You have <span className='text-foreground font-semibold'>{itemLength}</span>{' '}
            {itemLength === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>

        <div className='flex items-center gap-3 self-start sm:self-auto'>
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='outline'
                  size='icon'
                  onClick={handleShare}
                  className='transform active:scale-95'
                >
                  <AnimatePresence mode='wait' initial={false}>
                    {isCopied ? (
                      <motion.div
                        key='check'
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                      >
                        <IconCheck className='h-4 w-4 text-green-500' />
                      </motion.div>
                    ) : (
                      <motion.div
                        key='share'
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                      >
                        {isShareSupported ? (
                          <IconShare2 className='h-4 w-4' />
                        ) : (
                          <IconCopy className='h-4 w-4' />
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </TooltipTrigger>
              <TooltipContent side='bottom'>{shareTooltipText} </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <AnimatePresence>
            {itemLength > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, x: 10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95, x: 10 }}
                transition={{ duration: 0.15 }}
              >
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant='outline'
                      size='sm'
                      className='text-destructive hover:bg-destructive/10 hover:text-destructive bor h-9 gap-2'
                    >
                      <IconTrash className='h-4 w-4' />
                      Clear All
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete all {itemLength} items currently saved to your
                        wishlist. This operation cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={clearSelection}
                        className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                      >
                        Clear All Items
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
