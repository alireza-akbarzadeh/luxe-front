'use client';

import { IconLoader2 } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { useAppForm } from '@/components/forms/useAppForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { GridItem } from '@/components/ui/grid-item';
import {
  mapBannerFormToPayload,
  mapBannerToFormValues
} from '@/domains/promotions-admin/lib/banner-mapper';
import {
  bannerDefaultValues,
  bannerFormSchema
} from '@/domains/promotions-admin/schemas/promotions.schema';
import { useGetAdminHomepageSectionsId } from '@/services/-admin-homepage-sections-{id}-get';
import { usePutAdminHomepageSectionsId } from '@/services/-admin-homepage-sections-{id}-put';
import { getGetAdminHomepageSectionsQueryKey } from '@/services/-admin-homepage-sections-get';
import { usePostAdminHomepageSections } from '@/services/-admin-homepage-sections-post';

interface BannerFormProps {
  bannerId?: string;
  isEdit?: boolean;
}

export function BannerForm({ bannerId, isEdit = false }: BannerFormProps) {
  const { push } = useRouter();
  const queryClient = useQueryClient();

  const { data: sectionResponse, isLoading } = useGetAdminHomepageSectionsId(Number(bannerId), {
    query: { enabled: isEdit && Boolean(bannerId) }
  });
  const section = sectionResponse?.data?.section;

  const { mutateAsync: createBanner, isPending: isCreating } = usePostAdminHomepageSections();
  const { mutateAsync: updateBanner, isPending: isUpdating } = usePutAdminHomepageSectionsId();

  const form = useAppForm({
    defaultValues: bannerDefaultValues,
    validators: { onChange: bannerFormSchema, onSubmit: bannerFormSchema },
    onSubmit: async ({ value }) => {
      try {
        const payload = mapBannerFormToPayload(value);
        if (isEdit && section?.id) {
          await updateBanner({ id: section.id, data: payload });
          toast.success('Banner updated');
        } else {
          await createBanner({ data: payload });
          toast.success('Banner created');
        }
        void queryClient.invalidateQueries({ queryKey: getGetAdminHomepageSectionsQueryKey() });
        push('/dashboard/promotions/banners');
      } catch (error) {
        toast.error('Failed to save banner', {
          description: error instanceof Error ? error.message : 'Something went wrong'
        });
      }
    }
  });

  useEffect(() => {
    if (isEdit && section?.id) form.reset(mapBannerToFormValues(section));
  }, [isEdit, section, form]);

  if (isEdit && isLoading) {
    return (
      <Card>
        <CardContent className='p-6'>Loading…</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? 'Edit banner' : 'Create banner'}</CardTitle>
        <CardDescription>
          Homepage merchandising block. Use keys starting with <code>hero-</code> for the hero
          carousel, or <code>flash-deals-promo</code> for the flash-sale band copy.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form.AppForm>
          <form.Root
            onSubmit={(e) => {
              e.preventDefault();
              void form.handleSubmit();
            }}
          >
            <Flex direction='column' spacing={4}>
              <Grid cols={1} gap={4} className='sm:grid-cols-2'>
                <GridItem>
                  <form.AppField
                    name='section_key'
                    children={(field) => (
                      <field.TextField label='Section key' required placeholder='summer-hero' />
                    )}
                  />
                </GridItem>
                <GridItem>
                  <form.AppField
                    name='title'
                    children={(field) => <field.TextField label='Title' required />}
                  />
                </GridItem>
                <GridItem>
                  <form.AppField
                    name='href'
                    children={(field) => <field.TextField label='Link URL' required />}
                  />
                </GridItem>
                <GridItem>
                  <form.AppField
                    name='image_url'
                    children={(field) => (
                      <field.TextField label='Image URL' placeholder='https://…' />
                    )}
                  />
                </GridItem>
                <GridItem>
                  <form.AppField
                    name='eyebrow'
                    children={(field) => (
                      <field.TextField label='Eyebrow (hero slides)' placeholder='Seasonal edit' />
                    )}
                  />
                </GridItem>
                <GridItem>
                  <form.AppField
                    name='description'
                    children={(field) => (
                      <field.TextField label='Description' placeholder='Subtitle or promo body' />
                    )}
                  />
                </GridItem>
                <GridItem>
                  <form.AppField
                    name='badge'
                    children={(field) => (
                      <field.TextField
                        label='Badge (flash-deals-promo)'
                        placeholder='Limited time'
                      />
                    )}
                  />
                </GridItem>
                <GridItem>
                  <form.AppField
                    name='cta_label'
                    children={(field) => (
                      <field.TextField label='CTA label' placeholder='Shop the sale' />
                    )}
                  />
                </GridItem>
                <GridItem>
                  <form.AppField
                    name='ends_at'
                    children={(field) => (
                      <field.TextField
                        label='Promo ends at (ISO)'
                        placeholder='2026-12-31T23:59:59Z'
                      />
                    )}
                  />
                </GridItem>
                <GridItem>
                  <form.AppField
                    name='sort_order'
                    children={(field) => <field.NumberField label='Sort order' />}
                  />
                </GridItem>
                <GridItem>
                  <form.AppField
                    name='status'
                    children={(field) => (
                      <field.Select
                        label='Status'
                        options={[
                          { label: 'Draft', value: 'draft' },
                          { label: 'Published', value: 'published' },
                          { label: 'Archived', value: 'archived' }
                        ]}
                        required
                      />
                    )}
                  />
                </GridItem>
              </Grid>
              <Flex direction='row' justify='end'>
                <Button type='submit' disabled={isCreating || isUpdating}>
                  {isCreating || isUpdating ? (
                    <IconLoader2 className='size-4 animate-spin' />
                  ) : null}
                  {isEdit ? 'Save changes' : 'Create banner'}
                </Button>
              </Flex>
            </Flex>
          </form.Root>
        </form.AppForm>
      </CardContent>
    </Card>
  );
}
