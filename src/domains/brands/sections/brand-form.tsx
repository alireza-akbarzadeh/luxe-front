'use client';

import { IconLoader2, IconPhoto, IconUpload } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { useAppForm } from '@/components/forms/useAppForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { GridItem } from '@/components/ui/grid-item';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BRAND_STATUS_OPTIONS,
  brandDefaultValues,
  brandFormSchema
} from '@/domains/brands/brand.schema';
import {
  mapBrandToFormValues,
  mapFormToCreateBrandRequest,
  mapFormToUpdateBrandRequest
} from '@/domains/brands/lib/brand-mapper';
import { uploadBrandLogo } from '@/domains/brands/lib/upload-brand-logo';
import { EntityWorkflowPanel } from '@/domains/workflows/components/entity-workflow-panel';
import { slugify } from '@/lib/utils';
import { getGetBrandsIdQueryKey, useGetBrandsId } from '@/services/-brands-{id}-get';
import { usePutBrandsId } from '@/services/-brands-{id}-put';
import { getGetBrandsQueryKey } from '@/services/-brands-get';
import { usePostBrands } from '@/services/-brands-post';

interface BrandFormProps {
  brandId?: string;
  isEdit?: boolean;
}

export function BrandForm({ isEdit = false, brandId }: BrandFormProps) {
  const { push } = useRouter();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const { data: { data: brand } = {}, isLoading: isLoadingBrand } = useGetBrandsId(
    Number(brandId),
    {
      query: {
        enabled: isEdit && Boolean(brandId)
      }
    }
  );

  const { mutateAsync: createBrand, isPending: isCreating } = usePostBrands({
    mutation: {
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: getGetBrandsQueryKey() });
      }
    }
  });

  const { mutateAsync: updateBrand, isPending: isUpdating } = usePutBrandsId({
    mutation: {
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: getGetBrandsQueryKey() });
        if (brand?.id) {
          void queryClient.invalidateQueries({
            queryKey: getGetBrandsIdQueryKey(brand.id)
          });
        }
      }
    }
  });

  const isPending = isCreating || isUpdating || isUploadingLogo;

  const form = useAppForm({
    defaultValues: brandDefaultValues,
    validators: {
      onChange: brandFormSchema,
      onSubmit: brandFormSchema
    },
    listeners: {
      onChange: ({ formApi }) => {
        const name = formApi.getFieldValue('name');
        const slugMeta = formApi.getFieldMeta('slug');
        if (!slugMeta?.isDirty && name) {
          formApi.setFieldValue('slug', slugify(name));
        }
      }
    },
    onSubmit: async ({ value }) => {
      try {
        if (isEdit && brand?.id) {
          await updateBrand({
            id: brand.id,
            data: mapFormToUpdateBrandRequest(value)
          });
          toast.success('Brand updated successfully');
        } else {
          await createBrand({ data: mapFormToCreateBrandRequest(value) });
          toast.success('Brand created successfully');
        }

        push('/dashboard/brands');
      } catch (error) {
        toast.error(isEdit ? 'Failed to update brand' : 'Failed to create brand', {
          description: error instanceof Error ? error.message : 'Something went wrong'
        });
      }
    }
  });

  useEffect(() => {
    if (isEdit && brand) {
      form.reset(mapBrandToFormValues(brand));
    }
  }, [isEdit, brand, form]);

  const handleLogoUpload = async (file: File) => {
    setIsUploadingLogo(true);
    try {
      const publicUrl = await uploadBrandLogo(file);
      form.setFieldValue('logo_url', publicUrl);
      toast.success('Logo uploaded');
    } catch (error) {
      toast.error('Failed to upload logo', {
        description: error instanceof Error ? error.message : 'Something went wrong'
      });
    } finally {
      setIsUploadingLogo(false);
    }
  };

  if (isEdit && isLoadingBrand) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className='h-8 w-48' />
          <Skeleton className='h-4 w-72' />
        </CardHeader>
        <CardContent className='space-y-4'>
          <Skeleton className='h-10 w-full' />
          <Skeleton className='h-10 w-full' />
          <Skeleton className='h-24 w-full' />
        </CardContent>
      </Card>
    );
  }

  const editBrandId = brand?.id;

  return (
    <>
      {isEdit && editBrandId ? (
        <EntityWorkflowPanel
          workflowKey='brand'
          entityId={editBrandId}
          className='mb-6'
          onTransitionSuccess={() => {
            void queryClient.invalidateQueries({
              queryKey: getGetBrandsIdQueryKey(editBrandId)
            });
            void queryClient.invalidateQueries({ queryKey: getGetBrandsQueryKey() });
          }}
        />
      ) : null}
      <Card className='border-border/40 bg-card/40 backdrop-blur-2xl'>
        <CardHeader>
          <CardTitle>{isEdit ? 'Edit brand' : 'Create brand'}</CardTitle>
          <CardDescription>
            {isEdit
              ? 'Update brand details shown across the storefront and product catalog.'
              : 'Add a new brand for products, filters, and storefront merchandising.'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form.AppForm>
            <form.Root
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                void form.handleSubmit();
              }}
            >
              <Flex direction='column' spacing={6}>
                <Flex direction='column' spacing={4}>
                  <h3 className='text-foreground text-sm font-medium'>Basic information</h3>

                  <Grid cols={1} gap={4} className='sm:grid-cols-2'>
                    <GridItem>
                      <form.AppField
                        name='name'
                        children={(field) => (
                          <field.TextField
                            label='Brand name'
                            placeholder='e.g. Nike'
                            required
                            detail='Displayed on product pages and brand filters'
                          />
                        )}
                      />
                    </GridItem>

                    <GridItem>
                      <form.AppField
                        name='slug'
                        children={(field) => (
                          <field.TextField
                            label='Slug'
                            placeholder='e.g. nike'
                            required
                            detail='Used in URLs — lowercase, hyphen-separated'
                          />
                        )}
                      />
                    </GridItem>
                  </Grid>

                  <form.AppField
                    name='description'
                    children={(field) => (
                      <field.TextArea
                        label='Description'
                        placeholder='Briefly describe this brand…'
                        rows={4}
                        description='Optional — shown on brand landing pages'
                      />
                    )}
                  />
                </Flex>

                <Separator />

                <Flex direction='column' spacing={4}>
                  <h3 className='text-foreground text-sm font-medium'>Logo</h3>

                  <form.Subscribe
                    selector={(state) => state.values.logo_url}
                    children={(logoUrl) => (
                      <Flex direction='row' spacing={4} align='start' className='flex-wrap'>
                        <div className='border-border/40 bg-muted/30 relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl border'>
                          {logoUrl ? (
                            <Image
                              src={logoUrl}
                              alt='Brand logo preview'
                              fill
                              className='object-contain p-2'
                              sizes='96px'
                            />
                          ) : (
                            <IconPhoto className='text-muted-foreground size-8' />
                          )}
                        </div>

                        <Flex direction='column' spacing={3} className='min-w-60 flex-1'>
                          <input
                            ref={fileInputRef}
                            type='file'
                            accept='image/jpeg,image/png,image/webp,image/gif'
                            className='hidden'
                            onChange={(event) => {
                              const file = event.target.files?.[0];
                              if (file) void handleLogoUpload(file);
                              event.target.value = '';
                            }}
                          />
                          <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            className='w-fit'
                            disabled={isUploadingLogo}
                            onClick={() => fileInputRef.current?.click()}
                          >
                            {isUploadingLogo ? (
                              <IconLoader2 className='size-4 animate-spin' />
                            ) : (
                              <IconUpload className='size-4' />
                            )}
                            Upload logo
                          </Button>

                          <form.AppField
                            name='logo_url'
                            children={(field) => (
                              <field.TextField
                                label='Logo URL'
                                placeholder='https://…'
                                detail='Upload an image or paste a public URL'
                              />
                            )}
                          />
                        </Flex>
                      </Flex>
                    )}
                  />
                </Flex>

                <Separator />

                <Flex direction='column' spacing={4}>
                  <h3 className='text-foreground text-sm font-medium'>Visibility</h3>

                  <Grid cols={1} gap={4} className='sm:grid-cols-2'>
                    <GridItem>
                      {isEdit ? (
                        <p className='text-muted-foreground text-sm'>
                          Status is controlled by the workflow panel above (Draft / Active /
                          Inactive / Archived).
                        </p>
                      ) : (
                        <form.AppField
                          name='status'
                          children={(field) => (
                            <field.Select
                              label='Status'
                              options={[...BRAND_STATUS_OPTIONS]}
                              description='Active brands appear in storefront filters and product forms'
                              required
                            />
                          )}
                        />
                      )}
                    </GridItem>
                  </Grid>
                </Flex>

                <Separator />

                <Flex direction='row' justify='between' spacing={3} className='flex-wrap'>
                  <Button type='button' variant='ghost' onClick={() => push('/dashboard/brands')}>
                    Cancel
                  </Button>

                  <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting, state.isDirty]}
                    children={([canSubmit, isSubmitting, isDirty]) => (
                      <Button
                        type='submit'
                        disabled={!canSubmit || isPending || (!isDirty && isEdit)}
                      >
                        {isPending || isSubmitting ? (
                          <>
                            <IconLoader2 className='size-4 animate-spin' />
                            {isEdit ? 'Saving…' : 'Creating…'}
                          </>
                        ) : isEdit ? (
                          'Save changes'
                        ) : (
                          'Create brand'
                        )}
                      </Button>
                    )}
                  />
                </Flex>
              </Flex>
            </form.Root>
          </form.AppForm>
        </CardContent>
      </Card>
    </>
  );
}
