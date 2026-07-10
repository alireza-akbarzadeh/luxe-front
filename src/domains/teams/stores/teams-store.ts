import { create } from 'zustand';

interface TeamsStoreState {
  selectedTeamId: number | null;
  createDialogOpen: boolean;
  editTeamId: number | null;
  addMemberDialogOpen: boolean;
}

interface TeamsStoreActions {
  selectTeam: (id: number | null) => void;
  openCreateDialog: () => void;
  openEditDialog: (id: number) => void;
  openAddMemberDialog: () => void;
  closeDialogs: () => void;
  reset: () => void;
}

type TeamsStore = TeamsStoreState & TeamsStoreActions;

const initialState: TeamsStoreState = {
  selectedTeamId: null,
  createDialogOpen: false,
  editTeamId: null,
  addMemberDialogOpen: false
};

export const useTeamsStore = create<TeamsStore>()((set) => ({
  ...initialState,
  selectTeam: (id) => set({ selectedTeamId: id }),
  openCreateDialog: () => set({ createDialogOpen: true, editTeamId: null }),
  openEditDialog: (id) => set({ editTeamId: id, createDialogOpen: false }),
  openAddMemberDialog: () => set({ addMemberDialogOpen: true }),
  closeDialogs: () =>
    set({ createDialogOpen: false, editTeamId: null, addMemberDialogOpen: false }),
  reset: () => set(initialState)
}));
