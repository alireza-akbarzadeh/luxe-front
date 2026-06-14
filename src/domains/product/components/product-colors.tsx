import { IconCheck } from '@tabler/icons-react';

import { cn } from '@/lib/utils';

interface ProductColorsProps {
  selected: string | null;
  onSetSelected: (select: string) => void;
  colors: string[];
}

export default function ProductColors(props: ProductColorsProps) {
  const { colors, onSetSelected, selected } = props;

  if (!colors?.length) return null;

  return (
    <div>
      <div className='mb-3 flex items-center justify-between'>
        <p className='text-sm font-medium'>Color</p>
        <p className='text-muted-foreground text-sm'>{selected}</p>
      </div>
      <div className='flex gap-2.5'>
        {colors?.map((color) => (
          <button
            key={color}
            onClick={() => onSetSelected(color)}
            className={cn(
              'relative h-10 w-10 rounded-full border-2 transition-all',
              selected === color ? 'border-accent scale-110' : 'border-border hover:scale-105'
            )}
            style={{ backgroundColor: color }}
            title={color}
          >
            {selected?.toLowerCase() === color.toLowerCase() && (
              <IconCheck className='absolute inset-0 m-auto h-4 w-4 text-gray-200 mix-blend-difference' />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
