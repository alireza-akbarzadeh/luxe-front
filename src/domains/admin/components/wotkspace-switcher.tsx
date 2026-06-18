import {
  IconBrandZapier,
  IconChevronDown,
  IconGlobe,
  IconLayout2,
  IconPlus
} from '@tabler/icons-react';
import * as React from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export function WorkspaceSwitcher({ isCollapsed }: { isCollapsed: boolean }) {
  const workspaces = [
    { name: 'Luxe Main', icon: IconLayout2, plan: 'Enterprise' },
    { name: 'Luxe Events', icon: IconBrandZapier, plan: 'Pro' },
    { name: 'Global Admin', icon: IconGlobe, plan: 'Internal' }
  ];

  const [activeWorkspace, setActiveWorkspace] = React.useState(workspaces[0]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            'flex w-full items-center gap-3 rounded-xl p-2 transition-all duration-200 outline-none',
            'hover:bg-accent/50 group hover:border-border/50 border border-transparent',
            isCollapsed && 'justify-center'
          )}
        >
          <div className='bg-primary text-primary-foreground shadow-primary/20 flex size-9 shrink-0 items-center justify-center rounded-lg shadow-lg'>
            {activeWorkspace && <activeWorkspace.icon className='size-5' />}
          </div>

          {!isCollapsed && (
            <div className='flex min-w-0 flex-1 flex-col items-start text-left'>
              <span className='w-full truncate text-sm font-bold tracking-tight'>
                {activeWorkspace?.name}
              </span>
              <span className='text-muted-foreground text-[10px] font-medium tracking-wider uppercase'>
                {activeWorkspace?.plan}
              </span>
            </div>
          )}

          {!isCollapsed && (
            <IconChevronDown className='text-muted-foreground group-hover:text-foreground size-4 transition-colors' />
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className='border-border/50 bg-popover/95 w-64 rounded-2xl p-2 shadow-2xl backdrop-blur-md'
        align='start'
        sideOffset={8}
      >
        <DropdownMenuLabel className='text-muted-foreground px-3 py-2 text-[10px] font-bold tracking-widest uppercase'>
          Switch Workspace
        </DropdownMenuLabel>

        {workspaces.map((workspace) => (
          <DropdownMenuItem
            key={workspace.name}
            onClick={() => setActiveWorkspace(workspace)}
            className='group flex cursor-pointer items-center gap-3 rounded-xl p-2.5'
          >
            <div className='bg-muted/50 group-focus:bg-primary/10 flex size-8 items-center justify-center rounded-lg border transition-colors'>
              <workspace.icon className='text-muted-foreground group-focus:text-primary size-4' />
            </div>
            <div className='flex flex-col'>
              <span className='text-sm font-semibold'>{workspace.name}</span>
              <span className='text-muted-foreground text-[10px]'>{workspace.plan}</span>
            </div>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator className='my-2' />

        <DropdownMenuItem className='text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-3 rounded-xl p-2.5'>
          <IconPlus className='size-4' />
          <span className='text-sm font-medium'>Create Workspace</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
