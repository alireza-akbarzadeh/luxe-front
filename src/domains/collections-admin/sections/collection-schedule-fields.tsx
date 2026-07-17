'use client';

import { withForm } from '@/components/forms/useAppForm';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { GridItem } from '@/components/ui/grid-item';
import { Typography } from '@/components/ui/typography';
import { collectionDefaultValues } from '@/domains/collections-admin/collection.schema';

export const CollectionScheduleFields = withForm({
  defaultValues: collectionDefaultValues,
  render: function CollectionScheduleFieldsRender({ form }) {
    return (
      <Flex direction='column' spacing={4}>
        <Typography.H3 className='text-base'>Schedule</Typography.H3>
        <Typography.Muted className='text-sm'>
          Use status Scheduled (or Active with a future start) so the hourly cron publishes the
          collection when starts_at arrives. Ends_at deactivates it automatically.
        </Typography.Muted>
        <Grid cols={1} gap={4} className='sm:grid-cols-2'>
          <GridItem>
            <form.AppField
              name='starts_at'
              children={(field) => (
                <field.DatePicker
                  label='Starts at'
                  detail='Leave empty to start immediately when active'
                />
              )}
            />
          </GridItem>
          <GridItem>
            <form.AppField
              name='ends_at'
              children={(field) => (
                <field.DatePicker label='Ends at' detail='Leave empty for no end date' />
              )}
            />
          </GridItem>
        </Grid>
      </Flex>
    );
  }
});
