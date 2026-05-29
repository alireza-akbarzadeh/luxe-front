import { IconFileText, IconSettings, IconUser } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command';

import { useDashboardStore } from '../admin.store';
import { ICON_MAP, type SidebarGroup } from '../data';

type IconMapType = Record<string, React.ComponentType<{ className?: string }>>;

interface CommandSettingProps {
  data: SidebarGroup[];
}

export type FlatSearchItem = {
  label: string;
  href: string;
  icon?: string;
  groupName: string;
  parentLabel: string | null;
  permission?: string;
};

export function SearchSide({ data }: CommandSettingProps) {
  const { push } = useRouter();

  const searchOpen = useDashboardStore((state) => state.searchOpen);
  const setSearchOpen = useDashboardStore((state) => state.setSearchOpen);

  const flatItems = useMemo(() => {
    const items: FlatSearchItem[] = [];
    data.forEach((group) => {
      group.items.forEach((item) => {
        if (item.href) {
          items.push({
            label: item.label,
            href: item.href,
            icon: item.icon,
            groupName: group.group,
            parentLabel: null,
            permission: item.permission
          });
        }
        if (item.children) {
          item.children.forEach((child) => {
            if (child.href) {
              items.push({
                label: child.label,
                href: child.href,
                icon: child.icon || item.icon,
                groupName: group.group,
                parentLabel: item.label,
                permission: child.permission || item.permission
              });
            }
          });
        }
      });
    });
    return items;
  }, [data]);

  const onSelect = (href: string) => {
    setSearchOpen(false);
    push(href);
  };

  return (
    <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
      <CommandInput placeholder='Search pages, tools, or staff settings...' />
      <CommandList className='custom-scrollbar'>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading='Navigation'>
          {flatItems.map((item, index) => {
            const Icon = item.icon ? (ICON_MAP as IconMapType)[item.icon] : IconFileText;
            return (
              <CommandItem
                key={`${item.href}-${index}`}
                onSelect={() => item.href && onSelect(item.href)}
                className='group flex cursor-pointer items-center gap-3 py-3'
              >
                <div className='bg-muted/50 group-aria-selected:bg-background flex h-9 w-9 items-center justify-center rounded-xl border transition-colors'>
                  {Icon && (
                    <Icon className='text-muted-foreground group-aria-selected:text-primary h-4 w-4 transition-colors' />
                  )}
                </div>
                <div className='flex flex-col'>
                  <span className='group-aria-selected:text-primary text-sm font-semibold transition-colors'>
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
              </CommandItem>
            );
          })}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading='Quick Actions'>
          <CommandItem onSelect={() => onSelect('/dashboard/settings')}>
            <IconSettings className='text-muted-foreground mr-3 h-4 w-4' />
            <span className='text-sm font-medium'>System Settings</span>
          </CommandItem>
          <CommandItem onSelect={() => onSelect('/dashboard/library')}>
            <IconUser className='text-muted-foreground mr-3 h-4 w-4' />
            <span className='text-sm font-medium'>My Profile</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
