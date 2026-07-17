'use client';

import { withForm } from '@/components/forms/useAppForm';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { GridItem } from '@/components/ui/grid-item';
import { Typography } from '@/components/ui/typography';
import { collectionDefaultValues } from '@/domains/collections-admin/collection.schema';

export const CollectionSeoFields = withForm({
  defaultValues: collectionDefaultValues,
  render: function CollectionSeoFieldsRender({ form }) {
    return (
      <Flex direction='column' spacing={4}>
        <Typography.H3 className='text-base'>SEO</Typography.H3>
        <Grid cols={1} gap={4} className='sm:grid-cols-2'>
          <GridItem>
            <form.AppField
              name='seo_title'
              children={(field) => <field.TextField label='SEO title' />}
            />
          </GridItem>
          <GridItem>
            <form.AppField
              name='canonical_url'
              children={(field) => (
                <field.TextField label='Canonical URL' placeholder='https://…' />
              )}
            />
          </GridItem>
          <GridItem className='sm:col-span-2'>
            <form.AppField
              name='seo_description'
              children={(field) => <field.TextArea label='SEO description' rows={3} />}
            />
          </GridItem>
          <GridItem className='sm:col-span-2'>
            <form.AppField
              name='meta_keywords'
              children={(field) => (
                <field.TextField label='Meta keywords' placeholder='summer, women, dresses' />
              )}
            />
          </GridItem>
          <GridItem>
            <form.AppField
              name='is_indexable'
              children={(field) => <field.Switch label='Allow indexing' />}
            />
          </GridItem>
          <GridItem>
            <form.AppField
              name='robots_directives'
              children={(field) => (
                <field.TextField label='Robots directives' placeholder='max-image-preview:large' />
              )}
            />
          </GridItem>
          <GridItem>
            <form.AppField
              name='og_title'
              children={(field) => <field.TextField label='Open Graph title' />}
            />
          </GridItem>
          <GridItem>
            <form.AppField
              name='og_image_url'
              children={(field) => (
                <field.TextField label='Open Graph image URL' placeholder='https://…' />
              )}
            />
          </GridItem>
          <GridItem className='sm:col-span-2'>
            <form.AppField
              name='og_description'
              children={(field) => <field.TextArea label='Open Graph description' rows={3} />}
            />
          </GridItem>
          <GridItem>
            <form.AppField
              name='twitter_title'
              children={(field) => <field.TextField label='Twitter title' />}
            />
          </GridItem>
          <GridItem>
            <form.AppField
              name='twitter_image_url'
              children={(field) => (
                <field.TextField label='Twitter image URL' placeholder='https://…' />
              )}
            />
          </GridItem>
          <GridItem className='sm:col-span-2'>
            <form.AppField
              name='twitter_description'
              children={(field) => <field.TextArea label='Twitter description' rows={3} />}
            />
          </GridItem>
        </Grid>
      </Flex>
    );
  }
});
