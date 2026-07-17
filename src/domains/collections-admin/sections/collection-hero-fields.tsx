'use client';

import { withForm } from '@/components/forms/useAppForm';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { GridItem } from '@/components/ui/grid-item';
import { Typography } from '@/components/ui/typography';
import { collectionDefaultValues } from '@/domains/collections-admin/collection.schema';

export const CollectionHeroFields = withForm({
  defaultValues: collectionDefaultValues,
  render: function CollectionHeroFieldsRender({ form }) {
    return (
      <Flex direction='column' spacing={4}>
        <Typography.H3 className='text-base'>Hero Copy</Typography.H3>
        <Grid cols={1} gap={4} className='sm:grid-cols-2'>
          <GridItem>
            <form.AppField
              name='hero_title'
              children={(field) => <field.TextField label='Hero title' />}
            />
          </GridItem>
          <GridItem>
            <form.AppField
              name='image_url'
              children={(field) => (
                <field.TextField label='Card image URL' placeholder='https://…' />
              )}
            />
          </GridItem>
          <GridItem className='sm:col-span-2'>
            <form.AppField
              name='hero_description'
              children={(field) => <field.TextArea label='Hero description' rows={3} />}
            />
          </GridItem>
        </Grid>
      </Flex>
    );
  }
});
