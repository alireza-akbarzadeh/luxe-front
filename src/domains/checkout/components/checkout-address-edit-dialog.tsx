'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useEffect, useTransition } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import { AppDialog } from '@/components/app-dialog';
import { useAppForm } from '@/components/forms/useAppForm';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { usePutAddressesId } from '@/services/-addresses-{id}-put';
import { getGetAddressesQueryKey } from '@/services/-addresses-get';
import type { ModelsAddress } from '@/services/-addresses-get.schemas';

import {
  addressToCheckoutFields,
  applyAddressToCheckoutForm,
  buildAddressUpdatePayload
} from '../lib/checkout-address';

const checkoutAddressEditSchema = z.object({
  addressLine1: z.string().min(1, 'Street address is required'),
  addressLine2: z.string(),
  label: z.string()
});

type CheckoutAddressEditValues = z.infer<typeof checkoutAddressEditSchema>;

interface CheckoutAddressEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address: ModelsAddress | null;
  form: { setFieldValue: (name: string, value: unknown) => void };
  selectedAddressId: number | null;
}

/** Quick-edit dialog for a saved checkout address (street, apt, label). */
export function CheckoutAddressEditDialog({
  open,
  onOpenChange,
  address,
  form: checkoutForm,
  selectedAddressId
}: CheckoutAddressEditDialogProps) {
  const t = useTranslations('checkout.shipping');
  const tCommon = useTranslations('account.common');
  const queryClient = useQueryClient();
  const updateAddress = usePutAddressesId();
  const [isPending, startTransition] = useTransition();

  const editForm = useAppForm({
    defaultValues: {
      addressLine1: '',
      addressLine2: '',
      label: ''
    } satisfies CheckoutAddressEditValues,
    validators: {
      onChange: checkoutAddressEditSchema,
      onSubmit: checkoutAddressEditSchema
    },
    onSubmit: async ({ value }) => {
      if (!address?.id) return;

      startTransition(async () => {
        try {
          const payload = buildAddressUpdatePayload(address, {
            addressLine1: value.addressLine1,
            addressLine2: value.addressLine2,
            label: value.label
          });

          await updateAddress.mutateAsync({
            id: address.id as number,
            data: payload
          });

          await queryClient.invalidateQueries({ queryKey: getGetAddressesQueryKey() });

          const updated: ModelsAddress = {
            ...address,
            address_line1: payload.address_line1,
            address_line2: payload.address_line2,
            instructions: payload.instructions
          };

          if (selectedAddressId === address.id) {
            applyAddressToCheckoutForm(checkoutForm, updated);
          }

          toast.success(t('addressUpdated'));
          onOpenChange(false);
        } catch (error: unknown) {
          const message =
            (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
            tCommon('somethingWrong');
          toast.error(message);
        }
      });
    }
  });

  useEffect(() => {
    if (!open || !address) return;
    const fields = addressToCheckoutFields(address);
    editForm.reset({
      addressLine1: fields.addressLine1,
      addressLine2: fields.addressLine2 ?? '',
      label: address.instructions ?? ''
    });
  }, [address, editForm, open]);

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('editAddressTitle')}
      description={t('editAddressDescription')}
      size='md'
    >
      <editForm.AppForm>
        <editForm.Root
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            editForm.handleSubmit();
          }}
          className='space-y-4'
        >
          <editForm.AppField name='label'>
            {(field) => (
              <field.TextField
                label={t('addressLabel')}
                placeholder={t('addressLabelPlaceholder')}
              />
            )}
          </editForm.AppField>
          <editForm.AppField name='addressLine1'>
            {(field) => (
              <field.TextField
                label={t('addressLine1')}
                placeholder={t('addressLine1Placeholder')}
                autoComplete='address-line1'
              />
            )}
          </editForm.AppField>
          <editForm.AppField name='addressLine2'>
            {(field) => (
              <field.TextField
                label={t('addressLine2')}
                placeholder={t('addressLine2Placeholder')}
                autoComplete='address-line2'
              />
            )}
          </editForm.AppField>
          <Flex direction='row' justify='end' spacing={2} className='pt-2'>
            <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
              {tCommon('cancel')}
            </Button>
            <editForm.Submit isPending={isPending} label={tCommon('saveAddress')} />
          </Flex>
        </editForm.Root>
      </editForm.AppForm>
    </AppDialog>
  );
}
