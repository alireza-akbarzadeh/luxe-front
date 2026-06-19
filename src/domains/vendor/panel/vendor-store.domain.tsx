'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { VendorModuleHeader } from '@/domains/vendor/panel/components/ui/vendor-module-header';
import { useVendorPanelStore } from '@/domains/vendor/panel/stores/vendor-panel-store';

const STORE_SETTINGS_SECTIONS = [
  {
    title: 'Store information',
    features: ['Store name', 'Description', 'Contact email', 'Business details']
  },
  {
    title: 'Branding',
    features: ['Logo', 'Banner', 'Theme', 'Social media links']
  },
  {
    title: 'Commerce',
    features: ['Tax settings', 'Currencies', 'Payment methods', 'Shipping defaults']
  },
  {
    title: 'Policies & SEO',
    features: ['Return policy', 'Shipping policy', 'SEO metadata', 'Store hours']
  },
  {
    title: 'Verification',
    features: ['Domain', 'Verification status', 'Marketplace badges', 'Compliance docs']
  }
] as const;

export function VendorStoreDomain() {
  return <VendorStoreSettingsContent />;
}

function VendorStoreSettingsContent() {
  const activeStoreName = useVendorPanelStore((s) => s.activeStoreName);
  const activeStoreSlug = useVendorPanelStore((s) => s.activeStoreSlug);

  return (
    <div className='space-y-8'>
      <VendorModuleHeader
        title='Store settings'
        description='Branding, policies, tax, shipping, and public storefront configuration.'
        actions={
          <>
            <Button variant='outline' size='sm' className='rounded-xl' asChild>
              <a href={`/store/${activeStoreSlug}`} target='_blank' rel='noreferrer'>
                View storefront
              </a>
            </Button>
            <Button size='sm' className='rounded-xl'>
              Save changes
            </Button>
          </>
        }
      />

      <Card className='border-border/40 bg-card/50 rounded-2xl shadow-none'>
        <CardHeader>
          <div className='flex items-center justify-between gap-3'>
            <div>
              <CardTitle>{activeStoreName}</CardTitle>
              <CardDescription>/store/{activeStoreSlug}</CardDescription>
            </div>
            <Badge className='rounded-full'>Verified</Badge>
          </div>
        </CardHeader>
        <CardContent className='text-muted-foreground text-sm'>
          Configure how your store appears on the Luxe marketplace. Changes publish to your public
          storefront when saved.
        </CardContent>
      </Card>

      <div className='grid gap-6 lg:grid-cols-2'>
        {STORE_SETTINGS_SECTIONS.map((section) => (
          <Card key={section.title} className='border-border/40 bg-card/50 rounded-2xl shadow-none'>
            <CardHeader>
              <CardTitle className='text-base'>{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className='space-y-2'>
                {section.features.map((feature) => (
                  <li
                    key={feature}
                    className='border-border/40 hover:bg-muted/30 flex cursor-pointer items-center justify-between rounded-xl border px-3 py-2.5 text-sm transition-colors'
                  >
                    {feature}
                    <span className='text-muted-foreground text-xs'>Configure →</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
