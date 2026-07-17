'use client';

import { withForm } from '@/components/forms/useAppForm';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { GridItem } from '@/components/ui/grid-item';
import { Typography } from '@/components/ui/typography';
import {
  COLLECTION_STATUS_OPTIONS,
  collectionDefaultValues
} from '@/domains/collections-admin/collection.schema';

export const CollectionContentFields = withForm({
  defaultValues: collectionDefaultValues,
  props: { isEdit: false },
  render: function CollectionContentFieldsRender({ form, isEdit }) {
    return (
      <Flex direction='column' spacing={4}>
        <Typography.H3 className='text-base'>Content</Typography.H3>
        <Grid cols={1} gap={4} className='sm:grid-cols-2'>
          <GridItem>
            <form.AppField
              name='eyebrow'
              children={(field) => (
                <field.TextField
                  label='Eyebrow'
                  placeholder='e.g. Spring edit'
                  detail='Small label above the title'
                />
              )}
            />
          </GridItem>
          <GridItem>
            <form.AppField
              name='sort_order'
              children={(field) => (
                <field.TextField
                  label='Sort order'
                  type='number'
                  detail='Lower numbers appear first'
                />
              )}
            />
          </GridItem>
          <GridItem className='sm:col-span-2'>
            <form.AppField
              name='title'
              children={(field) => (
                <field.TextField label='Title' placeholder='Modern Essentials' required />
              )}
            />
          </GridItem>
          <GridItem className='sm:col-span-2'>
            <form.AppField
              name='subtitle'
              children={(field) => (
                <field.TextField
                  label='Subtitle'
                  placeholder='Premium summer essentials'
                  detail='Short supporting line below the title'
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
                  placeholder='modern-essentials'
                  required
                  detail='Permanent storefront URL segment'
                />
              )}
            />
          </GridItem>
          <GridItem>
            {isEdit ? (
              <Typography.Muted className='text-sm'>
                Status is controlled by the workflow panel above.
              </Typography.Muted>
            ) : (
              <form.AppField
                name='status'
                children={(field) => (
                  <field.Select label='Status' options={[...COLLECTION_STATUS_OPTIONS]} required />
                )}
              />
            )}
          </GridItem>
        </Grid>

        <form.AppField
          name='description'
          children={(field) => (
            <field.TextArea label='Description' rows={4} placeholder='Short summary…' />
          )}
        />
      </Flex>
    );
  }
});
