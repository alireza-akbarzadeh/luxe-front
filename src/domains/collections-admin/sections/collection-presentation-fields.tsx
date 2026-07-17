'use client';

import { IconLoader2, IconPhoto, IconUpload } from '@tabler/icons-react';
import type { RefObject } from 'react';

import { withForm } from '@/components/forms/useAppForm';
import { AppImage } from '@/components/ui/app-image';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { GridItem } from '@/components/ui/grid-item';
import { Typography } from '@/components/ui/typography';
import {
  COLLECTION_THEME_OPTIONS,
  collectionDefaultValues
} from '@/domains/collections-admin/collection.schema';

export const CollectionPresentationFields = withForm({
  defaultValues: collectionDefaultValues,
  props: {
    isUploadingImage: false,
    fileInputRef: { current: null } as RefObject<HTMLInputElement | null>,
    onImageUpload: async (_file: File) => {}
  },
  render: function CollectionPresentationFieldsRender({
    form,
    isUploadingImage,
    fileInputRef,
    onImageUpload
  }) {
    return (
      <Flex direction='column' spacing={4}>
        <Typography.H3 className='text-base'>Presentation</Typography.H3>
        <Grid cols={1} gap={4} className='sm:grid-cols-2'>
          <GridItem>
            <form.AppField
              name='theme'
              children={(field) => (
                <field.Select
                  label='Theme'
                  options={[...COLLECTION_THEME_OPTIONS]}
                  description='Visual style on the storefront collections page'
                />
              )}
            />
          </GridItem>
          <GridItem>
            <form.AppField
              name='theme_variant'
              children={(field) => (
                <field.TextField
                  label='Theme variant'
                  placeholder='cos-mono'
                  detail='Editorial variant label for design treatment'
                />
              )}
            />
          </GridItem>
          <GridItem>
            <form.AppField
              name='cta_label'
              children={(field) => (
                <field.TextField label='CTA label' placeholder='Shop collection' />
              )}
            />
          </GridItem>
        </Grid>

        <form.Subscribe
          selector={(state) => state.values.desktop_image_url || state.values.image_url}
          children={(imageUrl) => (
            <Flex direction='row' spacing={4} align='start' className='flex-wrap'>
              <Flex
                align='center'
                justify='center'
                className='bg-muted relative h-28 w-28 overflow-hidden rounded-xl border'
              >
                {imageUrl ? (
                  <AppImage
                    src={imageUrl}
                    alt='Collection hero preview'
                    fill
                    sizes='112px'
                    className='object-cover'
                  />
                ) : (
                  <IconPhoto className='text-muted-foreground size-8' />
                )}
              </Flex>

              <Flex direction='column' spacing={3} className='min-w-60 flex-1'>
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/jpeg,image/png,image/webp,image/gif'
                  className='hidden'
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void onImageUpload(file);
                    event.target.value = '';
                  }}
                />
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  className='w-fit'
                  disabled={isUploadingImage}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isUploadingImage ? (
                    <IconLoader2 className='size-4 animate-spin' />
                  ) : (
                    <IconUpload className='size-4' />
                  )}
                  Upload hero image
                </Button>

                <form.AppField
                  name='desktop_image_url'
                  children={(field) => (
                    <field.TextField
                      label='Desktop image URL'
                      placeholder='https://…'
                      detail='Upload an image or paste a public URL'
                    />
                  )}
                />
                <Grid cols={1} gap={3} className='sm:grid-cols-2'>
                  <GridItem>
                    <form.AppField
                      name='tablet_image_url'
                      children={(field) => (
                        <field.TextField label='Tablet image URL' placeholder='https://…' />
                      )}
                    />
                  </GridItem>
                  <GridItem>
                    <form.AppField
                      name='mobile_image_url'
                      children={(field) => (
                        <field.TextField label='Mobile image URL' placeholder='https://…' />
                      )}
                    />
                  </GridItem>
                  <GridItem className='sm:col-span-2'>
                    <form.AppField
                      name='overlay_opacity'
                      children={(field) => (
                        <field.TextField
                          label='Overlay opacity'
                          type='number'
                          detail='Number between 0 and 1'
                        />
                      )}
                    />
                  </GridItem>
                </Grid>
              </Flex>
            </Flex>
          )}
        />
      </Flex>
    );
  }
});
