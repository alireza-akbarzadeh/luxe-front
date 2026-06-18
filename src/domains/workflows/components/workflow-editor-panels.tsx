'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';

import { AppDialog } from '@/components/app-dialog';
import { useAppForm } from '@/components/forms/useAppForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  ColorSwatchPicker,
  KeySuggestionPills,
  PanelFooter,
  PanelSection,
  StatePreviewCard,
  TransitionFlowBanner
} from '@/domains/workflows/components/workflow-editor-ui';
import { stateCodeByNodeId } from '@/domains/workflows/lib/workflow-graph';
import {
  KNOWN_GUARD_KEYS,
  KNOWN_HOOK_KEYS,
  workflowStateSchema,
  workflowTransitionSchema,
  zodFormValidators
} from '@/domains/workflows/schemas/workflow-schema';
import { useWorkflowEditorStore } from '@/domains/workflows/stores/workflow-editor-store';
import { useDeleteAdminWorkflowsIdStatesStateId } from '@/services/-admin-workflows-{id}-states-{stateId}-delete';
import { usePatchAdminWorkflowsIdStatesStateId } from '@/services/-admin-workflows-{id}-states-{stateId}-patch';
import { usePostAdminWorkflowsIdStates } from '@/services/-admin-workflows-{id}-states-post';
import { useDeleteAdminWorkflowsIdTransitionsTransitionId } from '@/services/-admin-workflows-{id}-transitions-{transitionId}-delete';
import { usePatchAdminWorkflowsIdTransitionsTransitionId } from '@/services/-admin-workflows-{id}-transitions-{transitionId}-patch';
import { usePostAdminWorkflowsIdTransitions } from '@/services/-admin-workflows-{id}-transitions-post';
import { getGetWorkflowsKeyQueryKey } from '@/services/-workflows-{key}-get';
import type { DtoWorkflowDefinitionView } from '@/services/-workflows-{key}-get.schemas';

const SHEET_SUBMIT_CLASS =
  'h-9 w-auto shrink-0 px-5 text-sm font-semibold tracking-normal normal-case';

interface WorkflowEditorPanelsProps {
  workflowId: number;
  workflowKey: string;
  definition: DtoWorkflowDefinitionView;
}

async function refreshWorkflow(
  queryClient: ReturnType<typeof useQueryClient>,
  workflowKey: string
) {
  await queryClient.invalidateQueries({ queryKey: getGetWorkflowsKeyQueryKey(workflowKey) });
}

export function WorkflowEditorPanels({
  workflowId,
  workflowKey,
  definition
}: WorkflowEditorPanelsProps) {
  const queryClient = useQueryClient();
  const { panel, closePanel } = useWorkflowEditorStore();

  const isStateOpen = panel.type === 'create-state' || panel.type === 'edit-state';
  const isTransitionOpen = panel.type === 'create-transition' || panel.type === 'edit-transition';

  return (
    <>
      <WorkflowStatePanel
        open={isStateOpen}
        workflowId={workflowId}
        workflowKey={workflowKey}
        definition={definition}
        panel={panel}
        onClose={closePanel}
        onSaved={() => refreshWorkflow(queryClient, workflowKey)}
      />
      <WorkflowTransitionPanel
        open={isTransitionOpen}
        workflowId={workflowId}
        workflowKey={workflowKey}
        definition={definition}
        panel={panel}
        onClose={closePanel}
        onSaved={() => refreshWorkflow(queryClient, workflowKey)}
      />
    </>
  );
}

interface StatePanelProps extends WorkflowEditorPanelsProps {
  open: boolean;
  panel: ReturnType<typeof useWorkflowEditorStore.getState>['panel'];
  onClose: () => void;
  onSaved: () => Promise<void>;
}

function WorkflowStatePanel({
  open,
  workflowId,
  workflowKey,
  panel,
  onClose,
  onSaved
}: StatePanelProps) {
  const isEdit = panel.type === 'edit-state';
  const editingState = isEdit ? panel.state : undefined;

  const { mutateAsync: createState, isPending: creating } = usePostAdminWorkflowsIdStates();
  const { mutateAsync: updateState, isPending: updating } = usePatchAdminWorkflowsIdStatesStateId();
  const { mutateAsync: deleteState, isPending: deleting } =
    useDeleteAdminWorkflowsIdStatesStateId();

  const defaultValues = useMemo(
    () => ({
      code: editingState?.code ?? '',
      name: editingState?.name ?? '',
      color: editingState?.color ?? '#6366f1',
      text_color: editingState?.text_color ?? '#ffffff',
      description: '',
      is_initial: editingState?.is_initial ?? false,
      is_final: editingState?.is_final ?? false,
      sort_order: editingState?.sort_order ?? 0
    }),
    [editingState]
  );

  const form = useAppForm({
    defaultValues,
      validators: zodFormValidators(workflowStateSchema),
    onSubmit: async ({ value }) => {
      try {
        if (isEdit && editingState?.id) {
          const result = await updateState({
            id: workflowId,
            stateId: editingState.id,
            data: {
              name: value.name,
              color: value.color,
              text_color: value.text_color,
              is_initial: value.is_initial,
              is_final: value.is_final,
              sort_order: value.sort_order
            }
          });
          if (!result.success) {
            toast.error(result.message ?? 'Update failed');
            return;
          }
          toast.success('State updated');
        } else {
          const result = await createState({
            id: workflowId,
            data: {
              code: value.code,
              name: value.name,
              color: value.color,
              text_color: value.text_color,
              is_initial: value.is_initial,
              is_final: value.is_final,
              sort_order: value.sort_order
            }
          });
          if (!result.success) {
            toast.error(result.message ?? 'Create failed');
            return;
          }
          toast.success('State created');
        }
        await onSaved();
        onClose();
      } catch {
        toast.error('Failed to save state');
      }
    }
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form, open]);

  const handleDelete = async () => {
    if (!editingState?.id) return;
    try {
      const result = await deleteState({ id: workflowId, stateId: editingState.id });
      if (!result.success) {
        toast.error(result.message ?? 'Delete failed');
        return;
      }
      toast.success('State deleted');
      await onSaved();
      onClose();
    } catch {
      toast.error('Failed to delete state');
    }
  };

  return (
    <AppDialog
      component='sheet'
      side='right'
      size='lg'
      open={open}
      onOpenChange={(next) => !next && onClose()}
      title={isEdit ? 'Edit state' : 'New state'}
      description={`${workflowKey} workflow`}
    >
      <form.AppForm>
        <form.Root
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
          className='flex h-full min-h-0 flex-col'
        >
          <div className='flex-1 space-y-6 overflow-y-auto px-6 py-5'>
          <form.Subscribe
            selector={(s) => ({
              name: s.values.name,
              code: s.values.code,
              color: s.values.color,
              text_color: s.values.text_color,
              is_initial: s.values.is_initial,
              is_final: s.values.is_final
            })}
          >
            {(preview) => (
              <StatePreviewCard
                name={preview.name}
                code={isEdit ? (editingState?.code ?? preview.code) : preview.code}
                color={preview.color}
                textColor={preview.text_color}
                isInitial={preview.is_initial}
                isFinal={preview.is_final}
              />
            )}
          </form.Subscribe>

          <Separator />

          <PanelSection
            title='Identity'
            description='Code is permanent after creation and used in transition rules.'
          >
            {!isEdit ? (
              <form.AppField name='code'>
                {(field) => (
                  <field.TextField
                    label='Code'
                    placeholder='under_review'
                    detail='Stable snake_case identifier'
                  />
                )}
              </form.AppField>
            ) : (
              <div className='bg-muted/50 flex items-center justify-between rounded-xl border px-3 py-2.5'>
                <span className='font-mono text-sm'>{editingState?.code}</span>
                <Badge variant='outline' className='text-[10px]'>
                  locked
                </Badge>
              </div>
            )}
            <form.AppField name='name'>
              {(field) => <field.TextField label='Display name' placeholder='Under review' />}
            </form.AppField>
          </PanelSection>

          <Separator />

          <PanelSection title='Appearance' description='Colors shown on the canvas node.'>
            <form.Subscribe selector={(s) => s.values.color}>
              {(color) => (
                <ColorSwatchPicker
                  value={color}
                  onChange={(next) => form.setFieldValue('color', next)}
                />
              )}
            </form.Subscribe>
            <div className='grid grid-cols-2 gap-3'>
              <form.AppField name='color'>
                {(field) => (
                  <field.TextField label='Background' placeholder='#6366f1' className='font-mono' />
                )}
              </form.AppField>
              <form.AppField name='text_color'>
                {(field) => (
                  <field.TextField label='Text' placeholder='#ffffff' className='font-mono' />
                )}
              </form.AppField>
            </div>
          </PanelSection>

          <Separator />

          <PanelSection title='Behavior'>
            <form.AppField name='sort_order'>
              {(field) => <field.NumberField label='Sort order' min={0} max={999} />}
            </form.AppField>
            <div className='bg-muted/30 flex flex-col gap-3 rounded-xl border p-3'>
              <form.AppField name='is_initial'>
                {(field) => <field.Switch label='Initial state' />}
              </form.AppField>
              <form.AppField name='is_final'>
                {(field) => <field.Switch label='Final state' />}
              </form.AppField>
            </div>
          </PanelSection>
          </div>

          <PanelFooter>
            {isEdit && editingState?.id ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type='button' variant='destructive' size='sm' disabled={deleting}>
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete state?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Transitions referencing this state will be removed. This cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => void handleDelete()}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <div />
            )}
            <div className='ml-auto flex shrink-0 items-center gap-2'>
              <Button type='button' variant='outline' size='sm' onClick={onClose}>
                Cancel
              </Button>
              <form.Subscribe selector={(s) => s.isSubmitting}>
                {(submitting) => (
                  <form.Submit
                    className={SHEET_SUBMIT_CLASS}
                    disabled={submitting || creating || updating}
                  >
                    {submitting || creating || updating ? 'Saving…' : 'Save state'}
                  </form.Submit>
                )}
              </form.Subscribe>
            </div>
          </PanelFooter>
        </form.Root>
      </form.AppForm>
    </AppDialog>
  );
}

interface TransitionPanelProps extends WorkflowEditorPanelsProps {
  open: boolean;
  panel: ReturnType<typeof useWorkflowEditorStore.getState>['panel'];
  onClose: () => void;
  onSaved: () => Promise<void>;
}

function WorkflowTransitionPanel({
  open,
  workflowId,
  workflowKey,
  definition,
  panel,
  onClose,
  onSaved
}: TransitionPanelProps) {
  const isEdit = panel.type === 'edit-transition';
  const isCreate = panel.type === 'create-transition';
  const edgeData = isEdit ? panel.edgeData : undefined;

  const editingTransition = edgeData?.transitionId
    ? definition.transitions?.find((t) => t.id === edgeData.transitionId)
    : undefined;

  const fromToLabel = useMemo(() => {
    if (!isCreate) return undefined;
    const fromCode = stateCodeByNodeId(definition, panel.fromNodeId);
    const toCode = stateCodeByNodeId(definition, panel.toNodeId);
    const from = fromCode ?? (panel.fromNodeId === '__any__' ? 'any state' : panel.fromNodeId);
    const to = toCode ?? panel.toNodeId;
    return `${from} → ${to}`;
  }, [definition, isCreate, panel]);

  const flowBanner = useMemo(() => {
    if (isCreate && panel.type === 'create-transition') {
      const fromCode = stateCodeByNodeId(definition, panel.fromNodeId);
      const toCode = stateCodeByNodeId(definition, panel.toNodeId);
      const fromState =
        panel.fromNodeId === '__any__'
          ? undefined
          : definition.states?.find((s) => s.code === fromCode);
      const toState = definition.states?.find((s) => s.code === toCode);
      return {
        fromLabel: fromCode ?? 'any state',
        toLabel: toCode ?? panel.toNodeId,
        fromColor: fromState?.color,
        toColor: toState?.color
      };
    }
    if (editingTransition) {
      return {
        fromLabel: editingTransition.from_state?.code ?? 'any state',
        toLabel: editingTransition.to_state?.code ?? 'unknown',
        fromColor: editingTransition.from_state?.color,
        toColor: editingTransition.to_state?.color
      };
    }
    return undefined;
  }, [definition, editingTransition, isCreate, panel]);

  const { mutateAsync: createTransition, isPending: creating } =
    usePostAdminWorkflowsIdTransitions();
  const { mutateAsync: updateTransition, isPending: updating } =
    usePatchAdminWorkflowsIdTransitionsTransitionId();
  const { mutateAsync: deleteTransition, isPending: deleting } =
    useDeleteAdminWorkflowsIdTransitionsTransitionId();

  const defaultValues = useMemo(
    () => ({
      event: edgeData?.event ?? '',
      name: edgeData?.name ?? '',
      required_role: edgeData?.requiredRole ? edgeData.requiredRole : 'any',
      guard_key: edgeData?.guardKey ?? '',
      hook_key: edgeData?.hookKey ?? '',
      sort_order: 0
    }),
    [edgeData]
  );

  const form = useAppForm({
    defaultValues,
      validators: zodFormValidators(workflowTransitionSchema),
    onSubmit: async ({ value }) => {
      try {
        if (isEdit && edgeData?.transitionId) {
          const result = await updateTransition({
            id: workflowId,
            transitionId: edgeData.transitionId,
            data: {
              name: value.name,
              required_role: value.required_role === 'any' ? undefined : value.required_role,
              guard_key: value.guard_key || undefined,
              hook_key: value.hook_key || undefined
            }
          });
          if (!result.success) {
            toast.error(result.message ?? 'Update failed');
            return;
          }
          toast.success('Transition updated');
        } else if (isCreate) {
          const toCode = stateCodeByNodeId(definition, panel.toNodeId);
          if (!toCode) {
            toast.error('Target state not found');
            return;
          }
          const fromCode =
            panel.fromNodeId === '__any__'
              ? undefined
              : stateCodeByNodeId(definition, panel.fromNodeId);

          const result = await createTransition({
            id: workflowId,
            data: {
              event: value.event,
              name: value.name,
              to_state_code: toCode,
              from_state_code: fromCode,
              required_role: value.required_role === 'any' ? undefined : value.required_role,
              guard_key: value.guard_key || undefined,
              hook_key: value.hook_key || undefined,
              sort_order: value.sort_order
            }
          });
          if (!result.success) {
            toast.error(result.message ?? 'Create failed');
            return;
          }
          toast.success('Transition created');
        }
        await onSaved();
        onClose();
      } catch {
        toast.error('Failed to save transition');
      }
    }
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form, open]);

  const handleDelete = async () => {
    if (!edgeData?.transitionId) return;
    try {
      const result = await deleteTransition({
        id: workflowId,
        transitionId: edgeData.transitionId
      });
      if (!result.success) {
        toast.error(result.message ?? 'Delete failed');
        return;
      }
      toast.success('Transition deleted');
      await onSaved();
      onClose();
    } catch {
      toast.error('Failed to delete transition');
    }
  };

  return (
    <AppDialog
      component='sheet'
      side='right'
      size='lg'
      open={open}
      onOpenChange={(next) => !next && onClose()}
      title={isEdit ? 'Edit transition' : 'Connect states'}
      description={fromToLabel ?? `${workflowKey} workflow`}
    >
      <form.AppForm>
        <form.Root
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
          className='flex h-full min-h-0 flex-col'
        >
          <div className='flex-1 space-y-6 overflow-y-auto px-6 py-5'>
          {flowBanner ? (
            <TransitionFlowBanner
              fromLabel={flowBanner.fromLabel}
              toLabel={flowBanner.toLabel}
              fromColor={flowBanner.fromColor}
              toColor={flowBanner.toColor}
            />
          ) : null}

          <PanelSection
            title='Transition identity'
            description='Event key is sent by the API when firing this transition.'
          >
            {isEdit ? (
              <div className='bg-muted/50 flex items-center justify-between rounded-xl border px-3 py-2.5'>
                <span className='font-mono text-sm'>{edgeData?.event}</span>
                <Badge variant='outline' className='text-[10px]'>
                  event
                </Badge>
              </div>
            ) : (
              <form.AppField name='event'>
                {(field) => (
                  <field.TextField
                    label='Event key'
                    placeholder='approve'
                    detail='Lowercase snake_case, e.g. verify_email'
                  />
                )}
              </form.AppField>
            )}
            <form.AppField name='name'>
              {(field) => (
                <field.TextField
                  label='Button label'
                  placeholder='Approve'
                  detail='Shown on admin action buttons'
                />
              )}
            </form.AppField>
          </PanelSection>

          <Separator />

          <PanelSection title='Access control'>
            <form.AppField name='required_role'>
              {(field) => (
                <field.Select
                  label='Required role'
                  placeholder='Any authenticated user'
                  options={[
                    { label: 'Any authenticated user', value: 'any' },
                    { label: 'Admin only', value: 'admin' }
                  ]}
                />
              )}
            </form.AppField>
          </PanelSection>

          <Separator />

          <PanelSection
            title='Guards & hooks'
            description='Optional server-side checks and post-transition side effects.'
          >
            <form.Subscribe selector={(s) => s.values.guard_key}>
              {(guardKey) => (
                <>
                  <form.AppField name='guard_key'>
                    {(field) => (
                      <field.TextField
                        label='Guard key'
                        placeholder='order_cancellable'
                        detail='Must pass before transition is allowed'
                      />
                    )}
                  </form.AppField>
                  <KeySuggestionPills
                    keys={KNOWN_GUARD_KEYS}
                    activeKey={guardKey}
                    onSelect={(key) => form.setFieldValue('guard_key', key)}
                  />
                </>
              )}
            </form.Subscribe>

            <form.Subscribe selector={(s) => s.values.hook_key}>
              {(hookKey) => (
                <>
                  <form.AppField name='hook_key'>
                    {(field) => (
                      <field.TextField
                        label='Hook key'
                        placeholder='order_paid'
                        detail='Runs after transition succeeds'
                      />
                    )}
                  </form.AppField>
                  <KeySuggestionPills
                    keys={KNOWN_HOOK_KEYS}
                    activeKey={hookKey}
                    onSelect={(key) => form.setFieldValue('hook_key', key)}
                  />
                </>
              )}
            </form.Subscribe>
          </PanelSection>

          {isEdit && edgeData ? (
            <div className='bg-muted/30 rounded-xl border p-3 text-xs'>
              <p className='text-muted-foreground font-medium tracking-wide uppercase'>
                Edge metadata
              </p>
              <dl className='mt-2 grid grid-cols-2 gap-2'>
                <div>
                  <dt className='text-muted-foreground'>Transition ID</dt>
                  <dd className='font-mono font-medium'>{edgeData.transitionId}</dd>
                </div>
                <div>
                  <dt className='text-muted-foreground'>Wildcard</dt>
                  <dd className='font-medium'>{edgeData.isWildcard ? 'Yes' : 'No'}</dd>
                </div>
              </dl>
            </div>
          ) : null}
          </div>

          <PanelFooter>
            {isEdit && edgeData?.transitionId ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type='button' variant='destructive' size='sm' disabled={deleting}>
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete transition?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Entities will no longer be able to fire the &quot;{edgeData.event}&quot; event
                      on this path.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => void handleDelete()}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <div />
            )}
            <div className='ml-auto flex shrink-0 items-center gap-2'>
              <Button type='button' variant='outline' size='sm' onClick={onClose}>
                Cancel
              </Button>
              <form.Subscribe selector={(s) => s.isSubmitting}>
                {(submitting) => (
                  <form.Submit
                    className={SHEET_SUBMIT_CLASS}
                    disabled={submitting || creating || updating}
                  >
                    {submitting || creating || updating ? 'Saving…' : 'Save transition'}
                  </form.Submit>
                )}
              </form.Subscribe>
            </div>
          </PanelFooter>
        </form.Root>
      </form.AppForm>
    </AppDialog>
  );
}
