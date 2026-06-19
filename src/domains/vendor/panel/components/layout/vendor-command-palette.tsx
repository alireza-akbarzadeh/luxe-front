'use client';

import { useRouter } from 'next/navigation';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command';
import { useVendorPanelStore } from '@/domains/vendor/panel/stores/vendor-panel-store';
import { flattenVendorNav } from '@/domains/vendor/vendor-panel-nav';

export function VendorCommandPalette() {
  const router = useRouter();
  const commandOpen = useVendorPanelStore((s) => s.commandOpen);
  const setCommandOpen = useVendorPanelStore((s) => s.setCommandOpen);

  const navItems = flattenVendorNav();

  const onSelect = (href: string) => {
    setCommandOpen(false);
    router.push(href);
  };

  return (
    <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
      <CommandInput placeholder='Search orders, products, pages, settings…' />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading='Navigation'>
          {navItems.map((item) => (
            <CommandItem key={item.id} onSelect={() => onSelect(item.href)} className='gap-3'>
              <item.icon className='size-4' aria-hidden />
              <div className='flex flex-col'>
                <span>{item.label}</span>
                {item.description ? (
                  <span className='text-muted-foreground text-xs'>{item.description}</span>
                ) : null}
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading='Quick actions'>
          <CommandItem onSelect={() => onSelect('/vendor/panel/products')}>Create product</CommandItem>
          <CommandItem onSelect={() => onSelect('/vendor/panel/discounts')}>Create coupon</CommandItem>
          <CommandItem onSelect={() => onSelect('/vendor/panel/orders')}>View orders</CommandItem>
          <CommandItem onSelect={() => onSelect('/vendor/panel/analytics')}>Open analytics</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
