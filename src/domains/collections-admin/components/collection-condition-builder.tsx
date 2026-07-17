'use client';

import { IconPlus } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Text, Typography } from '@/components/ui/typography';
import type { CollectionRulesForm } from '@/domains/collections-admin/collection.schema';
import { emptyRuleCondition, emptyRuleGroup } from '@/domains/collections-admin/collection.schema';
import { CollectionConditionRow } from '@/domains/collections-admin/components/collection-condition-row';

interface CollectionConditionBuilderProps {
  value: CollectionRulesForm;
  onChange: (next: CollectionRulesForm) => void;
}

/** Shopify-style AND/OR condition builder for smart collection rules. */
export function CollectionConditionBuilder({ value, onChange }: CollectionConditionBuilderProps) {
  return (
    <Flex direction='column' spacing={4}>
      <Flex direction='row' align='center' justify='between' className='flex-wrap gap-2'>
        <Typography.Muted className='text-sm'>
          Products must match the root operator across conditions and groups.
        </Typography.Muted>
        <Select
          value={value.operator}
          onValueChange={(operator) =>
            onChange({ ...value, operator: operator as CollectionRulesForm['operator'] })
          }
        >
          <SelectTrigger className='w-[180px]'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='and'>Match all (AND)</SelectItem>
            <SelectItem value='or'>Match any (OR)</SelectItem>
          </SelectContent>
        </Select>
      </Flex>

      <Flex direction='column' spacing={3} className='border-border/60 rounded-xl border p-4'>
        <Text className='text-sm font-medium'>Conditions</Text>
        {value.conditions.map((condition, index) => (
          <CollectionConditionRow
            key={`root-${index}`}
            condition={condition}
            canRemove={value.conditions.length + value.groups.length > 1}
            onChange={(next) => {
              const conditions = value.conditions.slice();
              conditions[index] = next;
              onChange({ ...value, conditions });
            }}
            onRemove={() => {
              onChange({
                ...value,
                conditions: value.conditions.filter((_, i) => i !== index)
              });
            }}
          />
        ))}
        <Button
          type='button'
          variant='outline'
          size='sm'
          className='w-fit'
          onClick={() =>
            onChange({ ...value, conditions: [...value.conditions, emptyRuleCondition()] })
          }
        >
          <IconPlus className='me-1 size-4' />
          Add condition
        </Button>
      </Flex>

      {value.groups.map((group, groupIndex) => (
        <Flex
          key={`group-${groupIndex}`}
          direction='column'
          spacing={3}
          className='border-border/60 bg-muted/20 rounded-xl border p-4'
        >
          <Flex direction='row' align='center' justify='between' className='flex-wrap gap-2'>
            <Text className='text-sm font-medium'>Group {groupIndex + 1}</Text>
            <Flex direction='row' spacing={2} align='center'>
              <Select
                value={group.operator}
                onValueChange={(operator) => {
                  const groups = value.groups.slice();
                  groups[groupIndex] = {
                    ...group,
                    operator: operator as CollectionRulesForm['operator']
                  };
                  onChange({ ...value, groups });
                }}
              >
                <SelectTrigger className='w-[160px]'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='and'>Group AND</SelectItem>
                  <SelectItem value='or'>Group OR</SelectItem>
                </SelectContent>
              </Select>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                onClick={() =>
                  onChange({
                    ...value,
                    groups: value.groups.filter((_, i) => i !== groupIndex)
                  })
                }
              >
                Remove group
              </Button>
            </Flex>
          </Flex>
          {group.conditions.map((condition, conditionIndex) => (
            <CollectionConditionRow
              key={`group-${groupIndex}-${conditionIndex}`}
              condition={condition}
              canRemove={group.conditions.length > 1}
              onChange={(next) => {
                const groups = value.groups.slice();
                const conditions = group.conditions.slice();
                conditions[conditionIndex] = next;
                groups[groupIndex] = { ...group, conditions };
                onChange({ ...value, groups });
              }}
              onRemove={() => {
                const groups = value.groups.slice();
                groups[groupIndex] = {
                  ...group,
                  conditions: group.conditions.filter((_, i) => i !== conditionIndex)
                };
                onChange({ ...value, groups });
              }}
            />
          ))}
          <Button
            type='button'
            variant='outline'
            size='sm'
            className='w-fit'
            onClick={() => {
              const groups = value.groups.slice();
              groups[groupIndex] = {
                ...group,
                conditions: [...group.conditions, emptyRuleCondition()]
              };
              onChange({ ...value, groups });
            }}
          >
            <IconPlus className='me-1 size-4' />
            Add condition to group
          </Button>
        </Flex>
      ))}

      <Button
        type='button'
        variant='secondary'
        size='sm'
        className='w-fit'
        onClick={() => onChange({ ...value, groups: [...value.groups, emptyRuleGroup()] })}
      >
        <IconPlus className='me-1 size-4' />
        Add condition group
      </Button>
    </Flex>
  );
}
