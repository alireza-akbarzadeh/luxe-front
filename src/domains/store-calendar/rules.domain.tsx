'use client';

import { toast } from 'sonner';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Typography } from '@/components/ui/typography';
import { useGetAdminCalendarRules } from '@/services/-admin-calendar-rules-get';
import type { DtoDeliveryCalendarRuleResponse } from '@/services/-admin-calendar-rules-get.schemas';
import { usePutAdminCalendarRules } from '@/services/-admin-calendar-rules-put';

/** Toggleable delivery-calendar rule cards (e.g. skip holidays, skip weekends). */
export function RulesDomain() {
  const { data, isLoading, refetch } = useGetAdminCalendarRules();
  const rules = data?.data ?? [];

  const { mutateAsync: updateRules, isPending } = usePutAdminCalendarRules();

  const toggleRule = async (rule: DtoDeliveryCalendarRuleResponse) => {
    if (!rule.rule_key) return;
    try {
      await updateRules({
        data: { rules: [{ rule_key: rule.rule_key, enabled: !rule.enabled }] }
      });
      await refetch();
      toast.success(`${rule.label ?? rule.rule_key} ${!rule.enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      toast.error('Failed to update rule', {
        description: error instanceof Error ? error.message : 'Something went wrong'
      });
    }
  };

  if (isLoading) {
    return (
      <Grid cols={1} gap={4} className='sm:grid-cols-2 lg:grid-cols-3'>
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className='h-32 w-full rounded-xl' />
        ))}
      </Grid>
    );
  }

  if (rules.length === 0) {
    return (
      <Flex align='center' justify='center' className='h-48 rounded-lg border border-dashed'>
        <Typography.Muted>No delivery calendar rules configured</Typography.Muted>
      </Flex>
    );
  }

  return (
    <Grid cols={1} gap={4} className='sm:grid-cols-2 lg:grid-cols-3'>
      {rules.map((rule) => (
        <Card key={rule.id ?? rule.rule_key}>
          <CardHeader>
            <Flex direction='row' align='start' justify='between' spacing={3}>
              <CardTitle className='text-base'>{rule.label ?? rule.rule_key}</CardTitle>
              <Switch
                checked={rule.enabled ?? false}
                disabled={isPending}
                aria-label={`Toggle ${rule.label ?? rule.rule_key}`}
                onCheckedChange={() => void toggleRule(rule)}
              />
            </Flex>
          </CardHeader>
          <CardContent>
            <Typography.Muted className='text-sm'>{rule.description || 'No description'}</Typography.Muted>
          </CardContent>
        </Card>
      ))}
    </Grid>
  );
}
