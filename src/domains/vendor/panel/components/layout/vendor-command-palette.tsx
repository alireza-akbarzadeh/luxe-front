'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command';
import { useVendorPanelNav } from '@/domains/vendor/panel/hooks/use-vendor-panel-nav';
import { useVendorPanelStore } from '@/domains/vendor/panel/stores/vendor-panel-store';
import { flattenVendorNavGroups } from '@/domains/vendor/vendor-panel-nav';

export function VendorCommandPalette() {
  const t = useTranslations('vendor.panel.commandPalette');
  const router = useRouter();
  const commandOpen = useVendorPanelStore((s) => s.commandOpen);
  const setCommandOpen = useVendorPanelStore((s) => s.setCommandOpen);
  const { groups } = useVendorPanelNav();

  const navItems = flattenVendorNavGroups(groups);

  const onSelect = (href: string) => {
    setCommandOpen(false);
    router.push(href);
  };

  return (
    <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
      <CommandInput placeholder={t('placeholder')} />
      <CommandList>
        <CommandEmpty>{t('empty')}</CommandEmpty>
        <CommandGroup heading={t('navigationHeading')}>
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
        <CommandGroup heading={t('quickActionsHeading')}>
          <CommandItem onSelect={() => onSelect('/vendor/panel/products')}>
            {t('createProduct')}
          </CommandItem>
          <CommandItem onSelect={() => onSelect('/vendor/panel/discounts')}>
            {t('createCoupon')}
          </CommandItem>
          <CommandItem onSelect={() => onSelect('/vendor/panel/orders')}>
            {t('viewOrders')}
          </CommandItem>
          <CommandItem onSelect={() => onSelect('/vendor/panel/analytics')}>
            {t('openAnalytics')}
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
