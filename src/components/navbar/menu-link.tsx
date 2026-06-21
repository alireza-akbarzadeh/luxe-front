import { IconChevronRight } from '@tabler/icons-react';
import Link from 'next/link';
import React from 'react';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

interface MenuLinkProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}
export function MenuLink({ href, icon, title, subtitle }: MenuLinkProps) {
  return (
    <DropdownMenuItem asChild>
      <Link
        href={href}
        className='group hover:bg-accent/60 flex items-center gap-3 rounded-2xl p-3 transition-all'
      >
        <div className='bg-muted group-hover:bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl transition-colors'>
          {icon}
        </div>

        <div className='flex-1 text-start'>
          <p className='text-sm font-medium'>{title}</p>

          <p className='text-muted-foreground text-xs'>{subtitle}</p>
        </div>

        <IconChevronRight
          size={16}
          className='text-muted-foreground cn-rtl-flip shrink-0 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1'
        />
      </Link>
    </DropdownMenuItem>
  );
}
