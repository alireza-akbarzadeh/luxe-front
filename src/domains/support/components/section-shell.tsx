import { cn } from '@/lib/utils';
interface SectionShellProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  id?: string;
}

export function SectionShell({ children, id, className, size = 'lg' }: SectionShellProps) {
  return (
    <section
      id={id}
      className={cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-8',
        size === 'sm' && 'max-w-3xl',
        size === 'md' && 'max-w-5xl',
        size === 'lg' && 'max-w-7xl',
        className
      )}
    >
      {children}
    </section>
  );
}

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left'
}: SectionHeadingProps) {
  return (
    <div className={cn('mb-10', align === 'center' && 'text-center')}>
      {eyebrow && (
        <div
          className={cn(
            'border-border/60 bg-card/60 text-muted-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium tracking-wider uppercase backdrop-blur'
          )}
        >
          {eyebrow}
        </div>
      )}
      <h2 className='mt-4 text-3xl font-semibold tracking-tight md:text-4xl'>{title}</h2>
      {description && (
        <p
          className={cn(
            'text-muted-foreground mt-3 max-w-2xl text-base leading-relaxed',
            align === 'center' && 'mx-auto'
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
