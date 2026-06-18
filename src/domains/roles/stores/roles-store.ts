import { create } from 'zustand';

interface RolesStoreState {
  selectedRoleId: number | null;
  createDialogOpen: boolean;
  editRoleId: number | null;
}

interface RolesStoreActions {
  selectRole: (id: number | null) => void;
  openCreateDialog: () => void;
  openEditDialog: (id: number) => void;
  closeDialogs: () => void;
  reset: () => void;
}

type RolesStore = RolesStoreState & RolesStoreActions;

const initialState: RolesStoreState = {
  selectedRoleId: null,
  createDialogOpen: false,
  editRoleId: null
};

export const useRolesStore = create<RolesStore>()((set) => ({
  ...initialState,
  selectRole: (id) => set({ selectedRoleId: id }),
  openCreateDialog: () => set({ createDialogOpen: true, editRoleId: null }),
  openEditDialog: (id) => set({ editRoleId: id, createDialogOpen: false }),
  closeDialogs: () => set({ createDialogOpen: false, editRoleId: null }),
  reset: () => set(initialState)
}));
