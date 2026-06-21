import { IconChevronRight } from '@tabler/icons-react';

import { DropdownMenuItem } from '~/src/components/ui/dropdown-menu';

interface MenuButtonProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

export function MenuButton({ icon, title, subtitle }: MenuButtonProps) {
  return (
    <DropdownMenuItem asChild>
      <button className='group hover:bg-accent/60 flex w-full cursor-pointer items-center gap-3 rounded-2xl p-3 transition-all'>
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
      </button>
    </DropdownMenuItem>
  );
}
