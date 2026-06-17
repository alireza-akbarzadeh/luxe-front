import { create } from 'zustand';

import type { WorkflowTransitionEdgeData } from '@/domains/workflows/types';
import type { DtoStateView } from '@/services/-workflows-{key}-get.schemas';

type EditorPanel =
  | { type: 'closed' }
  | { type: 'create-state' }
  | { type: 'edit-state'; state: DtoStateView }
  | { type: 'create-transition'; fromNodeId: string; toNodeId: string }
  | { type: 'edit-transition'; edgeData: WorkflowTransitionEdgeData };

interface WorkflowEditorState {
  panel: EditorPanel;
  openCreateState: () => void;
  openEditState: (state: DtoStateView) => void;
  openCreateTransition: (fromNodeId: string, toNodeId: string) => void;
  openEditTransition: (edgeData: WorkflowTransitionEdgeData) => void;
  closePanel: () => void;
  reset: () => void;
}

export const useWorkflowEditorStore = create<WorkflowEditorState>((set) => ({
  panel: { type: 'closed' },
  openCreateState: () => set({ panel: { type: 'create-state' } }),
  openEditState: (state) => set({ panel: { type: 'edit-state', state } }),
  openCreateTransition: (fromNodeId, toNodeId) =>
    set({ panel: { type: 'create-transition', fromNodeId, toNodeId } }),
  openEditTransition: (edgeData) => set({ panel: { type: 'edit-transition', edgeData } }),
  closePanel: () => set({ panel: { type: 'closed' } }),
  reset: () => set({ panel: { type: 'closed' } })
}));

interface CreateWorkflowDialogState {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useCreateWorkflowDialogStore = create<CreateWorkflowDialogState>((set) => ({
  open: false,
  setOpen: (open) => set({ open })
}));
