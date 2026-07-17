'use client';

import { IconLoader2 } from '@tabler/icons-react';

import { withForm } from '@/components/forms/useAppForm';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { collectionDefaultValues } from '@/domains/collections-admin/collection.schema';

export const CollectionFormActions = withForm({
  defaultValues: collectionDefaultValues,
  props: {
    isEdit: false,
    isPending: false,
    onCancel: () => {}
  },
  render: function CollectionFormActionsRender({ form, isEdit, isPending, onCancel }) {
    return (
      <Flex direction='row' justify='between' spacing={3} className='flex-wrap'>
        <Button type='button' variant='ghost' onClick={onCancel}>
          Cancel
        </Button>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting, state.isDirty]}
          children={([canSubmit, isSubmitting, isDirty]) => (
            <Button type='submit' disabled={!canSubmit || isPending || (!isDirty && isEdit)}>
              {isPending || isSubmitting ? (
                <>
                  <IconLoader2 className='size-4 animate-spin' />
                  {isEdit ? 'Saving…' : 'Creating…'}
                </>
              ) : isEdit ? (
                'Save changes'
              ) : (
                'Create collection'
              )}
            </Button>
          )}
        />
      </Flex>
    );
  }
});
