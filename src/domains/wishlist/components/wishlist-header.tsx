'use client';
import {
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialog
} from '@/components/ui/alert-dialog';
import { TooltipProvider, TooltipTrigger, TooltipContent, Tooltip } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { IconShare2, IconTrash } from '@tabler/icons-react';
import { useWishlistStore } from '../wishlist.store';

interface WishlistHeaderProps {
  itemLength: number;
}
export function WishlistHeader(props: WishlistHeaderProps) {
  const clearWishlist = useWishlistStore((store) => store.clearWishlist);

  const { itemLength } = props;
  const handleShare = async () => {
    const shareText = `Check out my wishlist with ${itemLength} items!`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Luxe Wishlist',
          text: shareText,
          url: window.location.href
        });
      } catch {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className='mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight md:text-4xl'>My Wishlist</h1>
        <p className='text-muted-foreground mt-1'>
          {itemLength} {itemLength === 1 ? 'item' : 'items'} saved for later
        </p>
      </div>

      <div className='flex items-center gap-3'>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant='outline' size='icon' onClick={handleShare}>
                <IconShare2 className='h-4 w-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Share Wishlist</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {itemLength > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='outline' size='sm' className='gap-2'>
                <IconTrash className='h-4 w-4' />
                Clear All
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear Wishlist?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove all {itemLength} items from your wishlist. This action cannot be
                  undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={clearWishlist}>Clear All</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
}
