import type { TablerIcon } from '@tabler/icons-react';

interface TrustItemsProps {
  label: string;
  icon: TablerIcon;
  index: number;
}
export function TrustItems({ label, icon: Icon, index }: TrustItemsProps) {
  return (
    <div key={label} className='flex items-center gap-4'>
      {index > 0 && <div className='bg-border hidden h-8 w-px sm:block' />}
      <div className='flex items-center gap-2.5'>
        <Icon className='text-accent h-4 w-4 shrink-0' />
        <p className='text-muted-foreground text-xs leading-snug sm:max-w-[9rem]'>{label}</p>
      </div>
    </div>
  );
}
