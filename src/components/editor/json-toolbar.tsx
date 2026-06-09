import { Button } from '@/components/ui/button';

interface Props {
  onFormat: () => void;
  onMinify: () => void;
  onCopy: () => void;
  onReset: () => void;
  hasError: boolean;
}

export function JsonToolbar({ onFormat, onMinify, onCopy, onReset, hasError }: Props) {
  return (
    <div className='flex items-center justify-between border-b px-2 py-1 text-xs'>
      <span className={hasError ? 'text-red-500' : 'text-green-500'}>
        {hasError ? 'Invalid JSON' : 'Valid JSON'}
      </span>

      <div className='flex gap-1'>
        <Button size='sm' variant='ghost' onClick={onFormat}>
          Format
        </Button>
        <Button size='sm' variant='ghost' onClick={onMinify}>
          Minify
        </Button>
        <Button size='sm' variant='ghost' onClick={onCopy}>
          Copy
        </Button>
        <Button size='sm' variant='ghost' onClick={onReset}>
          Reset
        </Button>
      </div>
    </div>
  );
}
