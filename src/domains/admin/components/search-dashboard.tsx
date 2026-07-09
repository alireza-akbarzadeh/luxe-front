import {
  IconArrowRight,
  IconCornerDownLeft,
  IconFileText,
  IconSettings,
  IconUser
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import React, { useMemo } from 'react';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command';
import { ICON_MAP } from '@/domains/admin/data';
import type {
  DtoMenuGroupResponse,
  DtoMenuItemResponse
} from '@/services/-user-menu-structure-get.schemas';

import { useDashboardStore } from '../admin.store';

type IconMapType = Record<string, React.ComponentType<{ className?: string }>>;

export type FlatSearchItem = {
  label: string;
  href: string;
  icon?: string;
  groupName: string;
  parentLabel: string | null;
  permission?: string;
};

interface CommandSettingProps {
  data: DtoMenuGroupResponse[];
}

export function SearchSide({ data }: CommandSettingProps) {
  const { push } = useRouter();
  const searchOpen = useDashboardStore((state) => state.searchOpen);
  const setSearchOpen = useDashboardStore((state) => state.setSearchOpen);
  const flatItems = useMemo(() => flattenMenu(data), [data]);

  const onSelect = (href: string) => {
    setSearchOpen(false);
    push(href);
  };

  return (
    <CommandDialog
      dialogClassName='border-6'
      open={searchOpen}
      onOpenChange={setSearchOpen}
      title='Search dashboard'
    >
      <CommandInput
        placeholder='Search pages, tools, or staff settings...'
        className='text-foreground border-b border-none bg-transparent'
      />
      <CommandList className='max-h-90'>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading='Navigation' className='px-2 py-2'>
          {flatItems.map((item, idx) => {
            const Icon = item.icon ? (ICON_MAP as IconMapType)[item.icon] : IconFileText;
            return (
              <CommandItem
                key={`${item.href}-${idx}`}
                onSelect={() => onSelect(item.href)}
                className='group aria-selected:text-accent-foreground aria-selected:bg-accent/20 flex cursor-pointer items-center justify-between px-3 py-2.5 transition-colors'
              >
                <div className='flex items-center gap-3 overflow-hidden'>
                  <div className='border-border bg-muted group-aria-selected:border-primary group-aria-selected:bg-primary/10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-colors'>
                    {Icon && (
                      <Icon className='text-muted-foreground group-aria-selected:text-primary h-4 w-4 transition-colors' />
                    )}
                  </div>
                  <div className='flex flex-col overflow-hidden'>
                    <span className='group-aria-selected:text-primary truncate text-sm font-semibold transition-colors'>
                      {item.label}
                    </span>
                    <div className='text-muted-foreground flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase'>
                      <span>{item.groupName}</span>
                      {item.parentLabel && (
                        <>
                          <span className='opacity-40'>/</span>
                          <span className='text-primary/70'>{item.parentLabel}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {/* Enter icon hint */}
                <IconArrowRight className='text-muted-foreground ml-auto h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity group-aria-selected:opacity-100' />
              </CommandItem>
            );
          })}
        </CommandGroup>

        {/* Sticky quick actions at bottom */}
      </CommandList>
      <div className='bg-background sticky bottom-0 pt-1'>
        <CommandSeparator className='bg-border' />
        <CommandGroup heading='Quick Actions' className='px-2 py-2'>
          <CommandItem
            onSelect={() => onSelect('/dashboard/settings')}
            className='aria-selected:bg-accent/20 flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 transition-colors aria-selected:text-black'
          >
            <div className='flex items-center gap-3'>
              <IconSettings className='text-muted-foreground h-4 w-4' />
              <span className='text-sm font-medium'>System Settings</span>
            </div>
            <IconArrowRight className='text-muted-foreground ml-auto h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity aria-selected:opacity-100' />
          </CommandItem>
          <CommandItem
            onSelect={() => onSelect('/dashboard/library')}
            className='aria-selected:bg-accent/20 flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 transition-colors aria-selected:text-black'
          >
            <div className='flex items-center gap-3'>
              <IconUser className='text-muted-foreground h-4 w-4' />
              <span className='text-sm font-medium'>My Profile</span>
            </div>
            <IconArrowRight className='text-muted-foreground ml-auto h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity aria-selected:opacity-100' />
          </CommandItem>
          <div className='ml-2 flex items-center gap-2 pt-2'>
            <div className='rounded-xs border p-px'>
              <IconCornerDownLeft className='h-4 w-4' />
            </div>
            <span className='text-foreground text-xs'>Go to Page</span>
          </div>
        </CommandGroup>
      </div>
    </CommandDialog>
  );
}

// Helper: recursively flatten groups -> items -> children
function flattenMenu(groups: DtoMenuGroupResponse[]): FlatSearchItem[] {
  const result: FlatSearchItem[] = [];
  for (const group of groups) {
    if (group.items?.length) {
      flattenItems(group.items, group.name as string, null, result);
    }
  }
  return result;
}

function flattenItems(
  items: DtoMenuItemResponse[],
  groupName: string,
  parentLabel: string | null,
  accumulator: FlatSearchItem[]
) {
  for (const item of items) {
    if (item.href) {
      accumulator.push({
        label: item.label ?? '',
        href: item.href,
        icon: item.icon,
        groupName: groupName,
        parentLabel: parentLabel,
        permission: item.permission
      });
    }
    if (item.children?.length) {
      flattenItems(item.children, groupName, item.label as string, accumulator);
    }
  }
}
