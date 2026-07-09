'use client';

import { IconLoader2 } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { useAppForm } from '@/components/forms/useAppForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { GridItem } from '@/components/ui/grid-item';
import {
  mapCampaignFormToPayload,
  mapCampaignToFormValues
} from '@/domains/promotions-admin/lib/campaign-mapper';
import {
  campaignDefaultValues,
  campaignFormSchema
} from '@/domains/promotions-admin/schemas/promotions.schema';
import { useGetAdminCampaignsId } from '@/services/-admin-campaigns-{id}-get';
import { usePutAdminCampaignsId } from '@/services/-admin-campaigns-{id}-put';
import { getGetAdminCampaignsQueryKey } from '@/services/-admin-campaigns-get';
import { usePostAdminCampaigns } from '@/services/-admin-campaigns-post';

interface CampaignFormProps {
  campaignId?: string;
  isEdit?: boolean;
}

export function CampaignForm({ campaignId, isEdit = false }: CampaignFormProps) {
  const { push } = useRouter();
  const queryClient = useQueryClient();

  const { data: campaignResponse, isLoading } = useGetAdminCampaignsId(Number(campaignId), {
    query: { enabled: isEdit && Boolean(campaignId) }
  });
  const campaign = campaignResponse?.data?.campaign;

  const { mutateAsync: createCampaign, isPending: isCreating } = usePostAdminCampaigns();
  const { mutateAsync: updateCampaign, isPending: isUpdating } = usePutAdminCampaignsId();

  const form = useAppForm({
    defaultValues: campaignDefaultValues,
    validators: { onChange: campaignFormSchema, onSubmit: campaignFormSchema },
    onSubmit: async ({ value }) => {
      try {
        const payload = mapCampaignFormToPayload(value);
        if (isEdit && campaign?.id) {
          await updateCampaign({ id: campaign.id, data: payload });
          toast.success('Campaign updated');
        } else {
          await createCampaign({ data: payload });
          toast.success('Campaign created');
        }
        void queryClient.invalidateQueries({ queryKey: getGetAdminCampaignsQueryKey() });
        push('/dashboard/promotions/campaigns');
      } catch (error) {
        toast.error('Failed to save campaign', {
          description: error instanceof Error ? error.message : 'Something went wrong'
        });
      }
    }
  });

  useEffect(() => {
    if (isEdit && campaign?.id) form.reset(mapCampaignToFormValues(campaign));
  }, [isEdit, campaign, form]);

  if (isEdit && isLoading) {
    return (
      <Card>
        <CardContent className='p-6'>Loading…</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? 'Edit campaign' : 'Create campaign'}</CardTitle>
        <CardDescription>
          Group flash sales, banners, and collections into a scheduled campaign.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form.AppForm>
          <form.Root
            onSubmit={(e) => {
              e.preventDefault();
              void form.handleSubmit();
            }}
          >
            <Flex direction='column' spacing={4}>
              <Grid cols={1} gap={4} className='sm:grid-cols-2'>
                <GridItem>
                  <form.AppField
                    name='name'
                    children={(field) => <field.TextField label='Name' required />}
                  />
                </GridItem>
                <GridItem>
                  <form.AppField
                    name='slug'
                    children={(field) => (
                      <field.TextField label='Slug (optional)' placeholder='summer-launch' />
                    )}
                  />
                </GridItem>
                <GridItem className='sm:col-span-2'>
                  <form.AppField
                    name='description'
                    children={(field) => <field.TextArea label='Description' rows={3} />}
                  />
                </GridItem>
                <GridItem>
                  <form.AppField
                    name='starts_at'
                    children={(field) => <field.DatePicker label='Start date' />}
                  />
                </GridItem>
                <GridItem>
                  <form.AppField
                    name='ends_at'
                    children={(field) => <field.DatePicker label='End date' />}
                  />
                </GridItem>
                <GridItem>
                  <form.AppField
                    name='status'
                    children={(field) => (
                      <field.Select
                        label='Status'
                        options={[
                          { label: 'Draft', value: 'draft' },
                          { label: 'Scheduled', value: 'scheduled' },
                          { label: 'Active', value: 'active' },
                          { label: 'Ended', value: 'ended' },
                          { label: 'Archived', value: 'archived' }
                        ]}
                        required
                      />
                    )}
                  />
                </GridItem>
              </Grid>
              <Grid cols={1} gap={4}>
                <GridItem>
                  <form.AppField
                    name='flash_deal_ids'
                    children={(field) => (
                      <field.TextField label='Flash deal IDs' placeholder='1, 2, 3' />
                    )}
                  />
                </GridItem>
                <GridItem>
                  <form.AppField
                    name='section_ids'
                    children={(field) => (
                      <field.TextField label='Banner section IDs' placeholder='4, 5' />
                    )}
                  />
                </GridItem>
                <GridItem>
                  <form.AppField
                    name='collection_ids'
                    children={(field) => (
                      <field.TextField label='Collection IDs' placeholder='10, 11' />
                    )}
                  />
                </GridItem>
              </Grid>
              <Flex direction='row' justify='end'>
                <Button type='submit' disabled={isCreating || isUpdating}>
                  {isCreating || isUpdating ? (
                    <IconLoader2 className='size-4 animate-spin' />
                  ) : null}
                  {isEdit ? 'Save changes' : 'Create campaign'}
                </Button>
              </Flex>
            </Flex>
          </form.Root>
        </form.AppForm>
      </CardContent>
    </Card>
  );
}
