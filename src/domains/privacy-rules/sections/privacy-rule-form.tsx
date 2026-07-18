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
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/typography';
import {
  mapFormToCreatePrivacyRuleRequest,
  mapFormToUpdatePrivacyRuleRequest,
  mapPrivacyRuleToFormValues
} from '@/domains/privacy-rules/lib/privacy-rule-mapper';
import {
  PRIVACY_RULE_PROVIDER_OPTIONS,
  PRIVACY_RULE_STATUS_OPTIONS,
  privacyRuleDefaultValues,
  privacyRuleFormSchema
} from '@/domains/privacy-rules/schemas/privacy-rule-schema';
import { PrivacyRuleMarkdownEditor } from '@/domains/privacy-rules/sections/privacy-rule-markdown-editor';
import { EntityWorkflowPanel } from '@/domains/workflows/components/entity-workflow-panel';
import { slugify } from '@/lib/utils';
import {
  getGetAdminPrivacyRulesIdQueryKey,
  useGetAdminPrivacyRulesId
} from '@/services/-admin-privacy-rules-{id}-get';
import { usePutAdminPrivacyRulesId } from '@/services/-admin-privacy-rules-{id}-put';
import { getGetAdminPrivacyRulesQueryKey } from '@/services/-admin-privacy-rules-get';
import { usePostAdminPrivacyRules } from '@/services/-admin-privacy-rules-post';

interface PrivacyRuleFormProps {
  ruleId?: string;
  isEdit?: boolean;
}

/** Derives a stable lookup key from the display name (dots allowed for provider.scope). */
function keyify(name: string): string {
  return slugify(name).replace(/-+/g, '-');
}

export function PrivacyRuleForm({ isEdit = false, ruleId }: PrivacyRuleFormProps) {
  const { push } = useRouter();
  const queryClient = useQueryClient();

  const { data: { data: rule } = {}, isLoading: isLoadingRule } = useGetAdminPrivacyRulesId(
    Number(ruleId),
    {
      query: { enabled: isEdit && Boolean(ruleId) }
    }
  );

  const { mutateAsync: createRule, isPending: isCreating } = usePostAdminPrivacyRules({
    mutation: {
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: getGetAdminPrivacyRulesQueryKey() });
      }
    }
  });

  const { mutateAsync: updateRule, isPending: isUpdating } = usePutAdminPrivacyRulesId({
    mutation: {
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: getGetAdminPrivacyRulesQueryKey() });
        if (rule?.id) {
          void queryClient.invalidateQueries({
            queryKey: getGetAdminPrivacyRulesIdQueryKey(rule.id)
          });
        }
      }
    }
  });

  const isPending = isCreating || isUpdating;

  const form = useAppForm({
    defaultValues: privacyRuleDefaultValues,
    validators: {
      onChange: privacyRuleFormSchema,
      onSubmit: privacyRuleFormSchema
    },
    listeners: {
      onChange: ({ formApi }) => {
        const name = formApi.getFieldValue('name');
        const keyMeta = formApi.getFieldMeta('key');
        if (!keyMeta?.isDirty && name) {
          formApi.setFieldValue('key', keyify(name));
        }
      }
    },
    onSubmit: async ({ value }) => {
      try {
        if (isEdit && rule?.id) {
          await updateRule({
            id: rule.id,
            data: mapFormToUpdatePrivacyRuleRequest(value)
          });
          toast.success('Privacy rule updated');
        } else {
          const created = await createRule({
            data: mapFormToCreatePrivacyRuleRequest(value)
          });
          toast.success('Privacy rule created');
          const id = created.data?.id;
          if (id) {
            push(`/dashboard/privacy-rules/edit/${id}`);
            return;
          }
        }
        push('/dashboard/privacy-rules');
      } catch (error) {
        toast.error(isEdit ? 'Failed to update privacy rule' : 'Failed to create privacy rule', {
          description: error instanceof Error ? error.message : 'Something went wrong'
        });
      }
    }
  });

  useEffect(() => {
    if (isEdit && rule) {
      form.reset(mapPrivacyRuleToFormValues(rule));
    }
  }, [isEdit, rule, form]);

  if (isEdit && isLoadingRule) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className='h-7 w-48' />
          <Skeleton className='h-4 w-72' />
        </CardHeader>
        <CardContent>
          <Flex direction='column' spacing={4}>
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-[420px] w-full' />
          </Flex>
        </CardContent>
      </Card>
    );
  }

  const editRuleId = rule?.id;

  return (
    <>
      {isEdit && editRuleId ? (
        <EntityWorkflowPanel
          workflowKey='privacy_rule'
          entityId={editRuleId}
          className='mb-6'
          onTransitionSuccess={() => {
            void queryClient.invalidateQueries({
              queryKey: getGetAdminPrivacyRulesIdQueryKey(editRuleId)
            });
            void queryClient.invalidateQueries({ queryKey: getGetAdminPrivacyRulesQueryKey() });
          }}
        />
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? 'Edit privacy rule' : 'Create privacy rule'}</CardTitle>
          <CardDescription>
            {isEdit
              ? 'Update markdown, provider scope, and version. Use the workflow panel to activate.'
              : 'Author a markdown privacy rule scoped to a provider. Apps resolve by key or provider.'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form.AppForm>
            <form.Root
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                void form.handleSubmit();
              }}
            >
              <Flex direction='column' spacing={6}>
                <Grid cols={1} gap={4} className='sm:grid-cols-2'>
                  <GridItem className='sm:col-span-2'>
                    <form.AppField
                      name='name'
                      children={(field) => (
                        <field.TextField
                          label='Rule name'
                          placeholder='Stripe checkout disclosure'
                          required
                        />
                      )}
                    />
                  </GridItem>
                  <GridItem>
                    <form.AppField
                      name='key'
                      children={(field) => (
                        <field.TextField
                          label='Lookup key'
                          placeholder='stripe.checkout'
                          detail='Stable key for apps (e.g. stripe.checkout, platform.general)'
                          required
                        />
                      )}
                    />
                  </GridItem>
                  <GridItem>
                    <form.AppField
                      name='provider'
                      children={(field) => (
                        <field.Select
                          label='Provider'
                          options={[...PRIVACY_RULE_PROVIDER_OPTIONS]}
                          description='Which integration this rule applies to'
                          required
                        />
                      )}
                    />
                  </GridItem>
                  <GridItem>
                    <form.AppField
                      name='locale'
                      children={(field) => (
                        <field.TextField label='Locale' placeholder='en' required />
                      )}
                    />
                  </GridItem>
                  <GridItem>
                    <form.AppField
                      name='status'
                      children={(field) => (
                        <field.Select
                          label='Status'
                          options={[...PRIVACY_RULE_STATUS_OPTIONS]}
                          description={
                            isEdit
                              ? 'Prefer workflow transitions for publishing'
                              : 'Defaults to draft; activate via workflow after save'
                          }
                          required
                        />
                      )}
                    />
                  </GridItem>
                  <GridItem className='sm:col-span-2'>
                    <form.AppField
                      name='summary'
                      children={(field) => (
                        <field.TextArea
                          label='Summary'
                          placeholder='Short plain-text summary for lists and acceptance UI'
                          rows={2}
                        />
                      )}
                    />
                  </GridItem>
                </Grid>

                <Separator />

                <Flex direction='column' spacing={2}>
                  <Text className='text-sm font-medium'>Rule content (Markdown)</Text>
                  <form.Subscribe
                    selector={(state) => state.values.content_markdown}
                    children={(markdown) => (
                      <PrivacyRuleMarkdownEditor
                        key={rule?.id ?? 'new'}
                        value={markdown}
                        onChange={(next) => form.setFieldValue('content_markdown', next)}
                      />
                    )}
                  />
                </Flex>

                {isEdit ? (
                  <Flex direction='column' spacing={1}>
                    <form.AppField
                      name='bump_version'
                      children={(field) => <field.Checkbox label='Force version bump' />}
                    />
                    <Text variant='muted' className='text-xs'>
                      Active content changes bump version automatically; check to bump without
                      content edits.
                    </Text>
                  </Flex>
                ) : null}

                {isEdit && rule?.version != null ? (
                  <Text variant='muted' className='text-xs'>
                    Current version: v{rule.version}
                  </Text>
                ) : null}

                <Flex direction='row' justify='end' spacing={2}>
                  <Button
                    type='button'
                    variant='outline'
                    disabled={isPending}
                    onClick={() => push('/dashboard/privacy-rules')}
                  >
                    Cancel
                  </Button>
                  <Button type='submit' disabled={isPending}>
                    {isPending ? <IconLoader2 className='size-4 animate-spin' /> : null}
                    {isEdit ? 'Save changes' : 'Create rule'}
                  </Button>
                </Flex>
              </Flex>
            </form.Root>
          </form.AppForm>
        </CardContent>
      </Card>
    </>
  );
}
