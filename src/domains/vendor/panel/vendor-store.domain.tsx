'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import { useAppForm } from '@/components/forms/useAppForm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { VendorLocationField } from '@/domains/vendor/onboarding/components/vendor-location-field';
import { VendorModuleHeader } from '@/domains/vendor/panel/components/ui/vendor-module-header';
import { useVendorPanelStore } from '@/domains/vendor/panel/stores/vendor-panel-store';
import { getVendorStore, updateVendorStore } from '@/lib/api/vendor-stores';

const vendorStoreSettingsSchema = z.object({
  storeName: z.string().min(2),
  storeDescription: z.string().min(20),
  location: z.string().min(2),
  locationLat: z.number().optional(),
  locationLng: z.number().optional(),
  shippingInfo: z.string().min(10),
  returnPolicy: z.string().min(10),
  businessLegalName: z.string().min(2),
  businessType: z.enum(['individual', 'company', 'brand']),
  country: z.string().min(2),
  website: z.string().optional(),
  taxId: z.string().optional(),
  fulfillmentModel: z.enum(['self', 'platform', 'hybrid'])
});

type VendorStoreSettingsValues = z.infer<typeof vendorStoreSettingsSchema>;

const vendorStoreSettingsDefaults: VendorStoreSettingsValues = {
  storeName: '',
  storeDescription: '',
  location: '',
  shippingInfo: '',
  returnPolicy: '',
  businessLegalName: '',
  businessType: 'brand',
  country: '',
  website: '',
  taxId: '',
  fulfillmentModel: 'self'
};

export function VendorStoreDomain() {
  return <VendorStoreSettingsContent />;
}

function VendorStoreSettingsContent() {
  const queryClient = useQueryClient();
  const activeStoreId = useVendorPanelStore((s) => s.activeStoreId);
  const activeStoreName = useVendorPanelStore((s) => s.activeStoreName);
  const activeStoreSlug = useVendorPanelStore((s) => s.activeStoreSlug);
  const [isSaving, setIsSaving] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['vendor-store', activeStoreId],
    queryFn: () => getVendorStore(activeStoreId),
    enabled: activeStoreId > 0
  });

  const store = data?.data;
  const settings = store?.settings ?? {};
  const isPending = store?.status === 'pending';

  const form = useAppForm({
    defaultValues: vendorStoreSettingsDefaults,
    validators: { onSubmit: vendorStoreSettingsSchema },
    onSubmit: async ({ value }) => {
      setIsSaving(true);
      try {
        await updateVendorStore(activeStoreId, {
          name: value.storeName,
          description: value.storeDescription,
          location: value.location,
          shipping_info: value.shippingInfo,
          return_policy: value.returnPolicy,
          business_legal_name: value.businessLegalName,
          business_type: value.businessType,
          country: value.country,
          website: value.website || undefined,
          tax_id: value.taxId || undefined,
          fulfillment_model: value.fulfillmentModel,
          latitude: value.locationLat,
          longitude: value.locationLng
        });
        toast.success('Store settings saved');
        void queryClient.invalidateQueries({ queryKey: ['vendor-store', activeStoreId] });
      } catch (error) {
        toast.error('Failed to save store settings', {
          description: error instanceof Error ? error.message : undefined
        });
      } finally {
        setIsSaving(false);
      }
    }
  });

  useEffect(() => {
    if (!store) return;

    const lat = settings['latitude'] ? Number(settings['latitude']) : undefined;
    const lng = settings['longitude'] ? Number(settings['longitude']) : undefined;

    form.reset({
      storeName: store.name ?? '',
      storeDescription: store.description ?? '',
      location: store.location ?? '',
      locationLat: Number.isFinite(lat) ? lat : undefined,
      locationLng: Number.isFinite(lng) ? lng : undefined,
      shippingInfo: store.shipping_info ?? '',
      returnPolicy: store.return_policy ?? '',
      businessLegalName: settings['business_legal_name'] ?? '',
      businessType:
        (settings['business_type'] as VendorStoreSettingsValues['businessType'] | undefined) ??
        'brand',
      country: settings['country'] ?? '',
      website: settings['website'] ?? '',
      taxId: settings['tax_id'] ?? '',
      fulfillmentModel:
        (settings['fulfillment_model'] as
          | VendorStoreSettingsValues['fulfillmentModel']
          | undefined) ?? 'self'
    });
  }, [form, settings, store]);

  if (isLoading) {
    return <p className='text-muted-foreground text-sm'>Loading store settings…</p>;
  }

  return (
    <Flex direction='column' spacing={8} fullWidth>
      <VendorModuleHeader
        title='Store settings'
        description='Update your storefront profile and business details from onboarding.'
        actions={
          <>
            <Button variant='outline' size='sm' className='rounded-xl' asChild>
              <a href={`/store/${activeStoreSlug}`} target='_blank' rel='noreferrer'>
                View storefront
              </a>
            </Button>
            <Button
              size='sm'
              className='rounded-xl'
              disabled={isSaving}
              onClick={() => void form.handleSubmit()}
            >
              {isSaving ? 'Saving…' : 'Save changes'}
            </Button>
          </>
        }
      />

      <Card className='border-border/40 bg-card/50 rounded-2xl shadow-none'>
        <CardHeader>
          <Flex direction='row' align='center' justify='between' fullWidth>
            <div>
              <CardTitle>{activeStoreName}</CardTitle>
              <CardDescription>/store/{activeStoreSlug}</CardDescription>
            </div>
            <Badge
              className='rounded-full capitalize'
              variant={isPending ? 'secondary' : 'default'}
            >
              {isPending ? 'Pending review' : (store?.status ?? 'active')}
            </Badge>
          </Flex>
        </CardHeader>
        {isPending ? (
          <CardContent className='text-muted-foreground text-sm'>
            Your storefront is not public yet. You can still update your profile while an admin
            reviews your application.
          </CardContent>
        ) : null}
      </Card>

      <form.AppForm>
        <form.Root
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
        >
          <Grid cols={1} gap={6}>
            <Card className='border-border/40 bg-card/50 rounded-2xl shadow-none'>
              <CardHeader>
                <CardTitle className='text-base'>Business</CardTitle>
              </CardHeader>
              <CardContent>
                <Grid cols={1} gap={4} className='sm:grid-cols-2'>
                  <form.AppField
                    name='businessLegalName'
                    children={(field) => <field.TextField label='Legal business name' required />}
                  />
                  <form.AppField
                    name='country'
                    children={(field) => <field.TextField label='Country' required />}
                  />
                  <form.AppField
                    name='website'
                    children={(field) => <field.TextField label='Website' />}
                  />
                  <form.AppField
                    name='taxId'
                    children={(field) => <field.TextField label='Tax ID' />}
                  />
                </Grid>
              </CardContent>
            </Card>

            <Card className='border-border/40 bg-card/50 rounded-2xl shadow-none'>
              <CardHeader>
                <CardTitle className='text-base'>Storefront</CardTitle>
              </CardHeader>
              <CardContent>
                <Grid cols={1} gap={4}>
                  <form.AppField
                    name='storeName'
                    children={(field) => <field.TextField label='Store name' required />}
                  />
                  <form.AppField
                    name='storeDescription'
                    children={(field) => (
                      <field.TextArea label='Store description' rows={4} required />
                    )}
                  />
                  <form.AppField
                    name='location'
                    children={(field) => (
                      <VendorLocationField
                        location={field.state.value ?? ''}
                        locationLat={form.state.values.locationLat}
                        locationLng={form.state.values.locationLng}
                        onChange={({ location, locationLat, locationLng }) => {
                          field.handleChange(location);
                          form.setFieldValue('locationLat', locationLat);
                          form.setFieldValue('locationLng', locationLng);
                        }}
                      />
                    )}
                  />
                </Grid>
              </CardContent>
            </Card>

            <Card className='border-border/40 bg-card/50 rounded-2xl shadow-none'>
              <CardHeader>
                <CardTitle className='text-base'>Operations</CardTitle>
              </CardHeader>
              <CardContent>
                <Grid cols={1} gap={4}>
                  <form.AppField
                    name='shippingInfo'
                    children={(field) => (
                      <field.TextArea label='Shipping policy' rows={3} required />
                    )}
                  />
                  <form.AppField
                    name='returnPolicy'
                    children={(field) => <field.TextArea label='Return policy' rows={3} required />}
                  />
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </form.Root>
      </form.AppForm>
    </Flex>
  );
}
