import { cn } from '@/lib/utils';

export function UserStatCard({ label, value, change, pulse, color }: any) {
  return (
    <div className='bg-muted/20 border-border/40 rounded-2xl border p-5'>
      <p className='text-muted-foreground text-[10px] font-bold tracking-widest uppercase'>
        {label}
      </p>
      <div className='mt-2 flex items-center justify-between'>
        <h3 className={cn('text-2xl font-bold', color)}>{value}</h3>
        {pulse && (
          <span className='relative flex h-2 w-2'>
            <span className='bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75'></span>
            <span className='bg-primary relative inline-flex h-2 w-2 rounded-full'></span>
          </span>
        )}
        {change && <span className='text-[10px] font-medium text-emerald-500'>{change}</span>}
      </div>
    </div>
  );
}
