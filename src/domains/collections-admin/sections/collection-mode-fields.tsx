'use client';

import { withForm } from '@/components/forms/useAppForm';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { GridItem } from '@/components/ui/grid-item';
import { Typography } from '@/components/ui/typography';
import {
  COLLECTION_SORT_KEY_OPTIONS,
  COLLECTION_TYPE_OPTIONS,
  collectionDefaultValues
} from '@/domains/collections-admin/collection.schema';

export const CollectionModeFields = withForm({
  defaultValues: collectionDefaultValues,
  render: function CollectionModeFieldsRender({ form }) {
    return (
      <Flex direction='column' spacing={4}>
        <Typography.H3 className='text-base'>Mode</Typography.H3>
        <Grid cols={1} gap={4} className='sm:grid-cols-2'>
          <GridItem>
            <form.AppField
              name='mode'
              children={(field) => (
                <field.Select
                  label='Collection mode'
                  options={[...COLLECTION_TYPE_OPTIONS]}
                  description='Dynamic collections use rules, manual collections use curated product picks, and hybrid merges both.'
                  required
                />
              )}
            />
          </GridItem>
          <GridItem>
            <form.AppField
              name='sort_key'
              children={(field) => (
                <field.Select
                  label='Default sort'
                  options={[...COLLECTION_SORT_KEY_OPTIONS]}
                  description='Baseline ordering for dynamic product resolution'
                />
              )}
            />
          </GridItem>
        </Grid>
      </Flex>
    );
  }
});
