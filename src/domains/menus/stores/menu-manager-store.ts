import { create } from 'zustand';

import type { DtoNavItemResponse } from '@/services/-nav-menus-get.schemas';

interface MenuManagerState {
  selectedGroupId: number | null;
  groupDialogOpen: boolean;
  itemDialogOpen: boolean;
  editingGroupId: number | null;
  editingItemId: number | null;
  createItemParentId: number | null;
}

interface MenuManagerActions {
  selectGroup: (id: number | null) => void;
  openGroupDialog: (groupId?: number | null) => void;
  closeGroupDialog: () => void;
  openItemDialog: (options?: { itemId?: number | null; parentId?: number | null }) => void;
  closeItemDialog: () => void;
  reset: () => void;
}

type MenuManagerStore = MenuManagerState & MenuManagerActions;

const initialState: MenuManagerState = {
  selectedGroupId: null,
  groupDialogOpen: false,
  itemDialogOpen: false,
  editingGroupId: null,
  editingItemId: null,
  createItemParentId: null
};

export const useMenuManagerStore = create<MenuManagerStore>()((set) => ({
  ...initialState,
  selectGroup: (id) => set({ selectedGroupId: id }),
  openGroupDialog: (groupId = null) =>
    set({ groupDialogOpen: true, editingGroupId: groupId ?? null }),
  closeGroupDialog: () => set({ groupDialogOpen: false, editingGroupId: null }),
  openItemDialog: ({ itemId = null, parentId = null } = {}) =>
    set({
      itemDialogOpen: true,
      editingItemId: itemId,
      createItemParentId: parentId
    }),
  closeItemDialog: () =>
    set({ itemDialogOpen: false, editingItemId: null, createItemParentId: null }),
  reset: () => set(initialState)
}));

interface SiteMenuManagerState {
  dialogOpen: boolean;
  editingNavId: number | null;
  editingNavItem: DtoNavItemResponse | null;
}

interface SiteMenuManagerActions {
  openDialog: (item?: DtoNavItemResponse | null) => void;
  closeDialog: () => void;
  reset: () => void;
}

type SiteMenuManagerStore = SiteMenuManagerState & SiteMenuManagerActions;

export const useSiteMenuManagerStore = create<SiteMenuManagerStore>()((set) => ({
  dialogOpen: false,
  editingNavId: null,
  editingNavItem: null,
  openDialog: (item = null) =>
    set({
      dialogOpen: true,
      editingNavId: item?.id ?? null,
      editingNavItem: item ?? null
    }),
  closeDialog: () => set({ dialogOpen: false, editingNavId: null, editingNavItem: null }),
  reset: () => set({ dialogOpen: false, editingNavId: null, editingNavItem: null })
}));
