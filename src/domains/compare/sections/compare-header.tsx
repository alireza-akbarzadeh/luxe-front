import { IconTrash } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
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
    <div className='mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight md:text-4xl'>Compare Products</h1>
        <p className='text-muted-foreground mt-1'>
          {itemCount} of {maxCompare} products selected
        </p>
      </div>
      <div className='flex items-center gap-3'>
        <label className='flex items-center gap-2 text-sm'>
          <input
            type='checkbox'
            checked={highlightDiffs}
            onChange={(e) => setHighlightDiffs(e.target.checked)}
            className='border-border rounded'
          />
          Highlight differences
        </label>
        {itemCount > 0 && (
          <Button variant='outline' size='sm' className='gap-2' onClick={clearAll}>
            <IconTrash className='h-4 w-4' />
            Clear All
          </Button>
        )}
      </div>
    </div>
  );
}
