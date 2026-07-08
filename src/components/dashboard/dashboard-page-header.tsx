import { cn } from '@/lib/utils';

interface DashboardPageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

/** Page header for dashboard home and module pages inside the dashboard shell. */
export function DashboardPageHeader({
  title,
  description,
  actions,
  className
}: DashboardPageHeaderProps) {
  return (
    <header
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between',
        className
      )}
    >
      <div>
        <h1 className='text-2xl font-semibold tracking-tight md:text-[1.75rem]'>{title}</h1>
        {description ? (
          <p className='text-muted-foreground mt-1 max-w-2xl text-sm leading-relaxed'>
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className='flex flex-wrap items-center gap-2'>{actions}</div> : null}
    </header>
  );
}
