import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface VendorModuleHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function VendorModuleHeader({
  title,
  description,
  badge,
  actions,
  className
}: VendorModuleHeaderProps) {
  return (
    <div
      className={cn('flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between', className)}
    >
      <div>
        <div className='flex items-center gap-2'>
          <h1 className='text-2xl font-semibold tracking-tight md:text-3xl'>{title}</h1>
          {badge ? (
            <Badge variant='secondary' className='rounded-full'>
              {badge}
            </Badge>
          ) : null}
        </div>
        {description ? (
          <p className='text-muted-foreground mt-1 max-w-2xl text-sm leading-relaxed md:text-base'>
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className='flex flex-wrap items-center gap-2'>{actions}</div> : null}
    </div>
  );
}
