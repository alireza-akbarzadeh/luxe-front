'use client';

import { IconChevronRight } from '@tabler/icons-react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { useProfileDrawerStore } from '@/stores/profile-drawer-store';

type MenuRowProps = {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onClickAction?: () => void;
  href?: string;
};

export function MenuRow({ icon, title, subtitle, onClickAction, href }: MenuRowProps) {
  const closeProfileDrawer = useProfileDrawerStore((state) => state.closeProfileDrawer);

  const content = (
    <>
      <div className='text-muted-foreground'>{icon}</div>

      <div className='flex-1'>
        <div className='text-sm font-medium'>{title}</div>
        {subtitle && <div className='text-muted-foreground text-xs'>{subtitle}</div>}
      </div>
      <IconChevronRight
        size={16}
        className='text-muted-foreground cn-rtl-flip shrink-0 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1'
      />
    </>
  );

  const className = cn(
    'group flex w-full items-center gap-3 rounded-2xl p-3 text-start transition-colors',
    'hover:bg-accent/50'
  );

  if (href) {
    return (
      <Link
        href={href}
        className={className}
        onClick={() => {
          closeProfileDrawer();
        }}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type='button'
      onClick={() => {
        onClickAction?.();
        closeProfileDrawer();
      }}
      className={className}
    >
      {content}
    </button>
  );
}
