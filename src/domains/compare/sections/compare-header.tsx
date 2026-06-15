import { IconSparkles, IconTrash } from '@tabler/icons-react';

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
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface CompareHeaderProps {
  itemCount: number;
  maxCompare: number;
  clearAll: () => Promise<void>;
  highlightDiffs: boolean;
  setHighlightDiffs: (value: boolean) => void;
}

export function CompareHeader(props: CompareHeaderProps) {
  const { itemCount, maxCompare, clearAll, highlightDiffs, setHighlightDiffs } = props;

  return (
    <div className='my-8 space-y-6'>
      <div className='flex flex-col justify-between gap-4 md:flex-row md:items-end'>
        <div>
          <p className='text-accent mb-2 text-xs font-semibold tracking-[0.2em] uppercase'>
            Side by side
          </p>
          <h1 className='text-3xl font-bold tracking-tight md:text-4xl'>Compare products</h1>
          <p className='text-muted-foreground mt-2 max-w-2xl text-sm md:text-base'>
            Review pricing, ratings, seller policies, and specifications. Add up to {maxCompare}{' '}
            products — scroll horizontally to compare them all.
          </p>
        </div>

        <div className='flex flex-wrap items-center gap-3'>
          <div className='bg-muted/40 border-border/60 flex items-center gap-3 rounded-full border px-4 py-2'>
            <Switch
              id='highlight-diffs'
              checked={highlightDiffs}
              onCheckedChange={setHighlightDiffs}
            />
            <Label htmlFor='highlight-diffs' className='flex items-center gap-1.5 text-sm'>
              <IconSparkles className='text-accent h-4 w-4' />
              Highlight winners
            </Label>
          </div>

          {itemCount > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant='outline' size='sm' className='gap-2 rounded-full'>
                  <IconTrash className='h-4 w-4' />
                  Clear all
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear compare list?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This removes all {itemCount} product{itemCount === 1 ? '' : 's'} from your
                    compare list. You can add them again anytime.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => void clearAll()}>Clear all</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      <div className='flex flex-wrap items-center gap-3'>
        <div className='flex items-center gap-2'>
          {Array.from({ length: maxCompare }).map((_, index) => (
            <div
              key={index}
              className={cn(
                'h-2.5 w-10 rounded-full transition-colors',
                index < itemCount ? 'bg-accent' : 'bg-muted'
              )}
            />
          ))}
        </div>
        <p className='text-muted-foreground text-sm'>
          <span className='text-foreground font-semibold'>{itemCount}</span> of {maxCompare} slots
          used
          {itemCount === 1 && ' · add one more to compare side by side'}
        </p>
      </div>
    </div>
  );
}
