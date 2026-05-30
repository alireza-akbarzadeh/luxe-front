'use client';

import { cn } from '@/lib/utils';

type MenuRowProps = {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onClickAction?: () => void;
  href?: string;
};

export function MenuRow({ icon, title, subtitle, onClickAction }: MenuRowProps) {
  return (
    <button
      onClick={onClickAction}
      className={cn(
        'flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-colors',
        'hover:bg-accent/50'
      )}
    >
      <div className='text-muted-foreground'>{icon}</div>

      <div className='flex-1'>
        <div className='text-sm font-medium'>{title}</div>
        {subtitle && <div className='text-muted-foreground text-xs'>{subtitle}</div>}
      </div>
    </button>
  );
}
