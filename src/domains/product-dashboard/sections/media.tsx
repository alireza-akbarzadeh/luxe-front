'use client';

import { IconInfoCircle } from '@tabler/icons-react';

import { withForm } from '@/components/forms/useAppForm';
import { ImageUploader } from '@/components/image-uploader';
import { Flex } from '@/components/ui/flex';

import { productDefaultValues } from '../product-schema';

export const MediaStep = withForm({
  defaultValues: productDefaultValues,
  render: ({ form }) => {
    return (
      <Flex direction='column' spacing={6}>
        <Flex direction='column' spacing={1}>
          <h3 className='text-foreground text-sm font-medium'>Product images</h3>
          <p className='text-muted-foreground text-xs'>
            Upload up to 10 images. The starred image is used as the thumbnail in listings.
          </p>
        </Flex>

        <form.AppField
          name='images'
          children={(field) => (
            <Flex direction='column' spacing={1.5}>
              <ImageUploader
                value={field.state.value}
                onChange={field.handleChange}
                error={
                  field.state.meta.errors.length > 0
                    ? field.state.meta.errors.join(', ')
                    : undefined
                }
                maxFiles={10}
              />
            </Flex>
          )}
        />

        <Flex direction='row' align='center' spacing={2} className='bg-muted rounded-md p-3'>
          <IconInfoCircle className='text-muted-foreground size-4 shrink-0' />
          <p className='text-muted-foreground text-xs'>
            Images are uploaded when you publish the product. Supported formats: PNG, JPG, WEBP,
            GIF. Max 10 MB each.
          </p>
        </Flex>
      </Flex>
    );
  }
});
