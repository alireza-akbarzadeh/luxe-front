'use client';

import { create } from 'zustand';

interface ProfileDrawerState {
  isOpen: boolean;
}

interface ProfileDrawerActions {
  setOpen: (open: boolean) => void;
  openProfileDrawer: () => void;
  closeProfileDrawer: () => void;
  reset: () => void;
}

type ProfileDrawerStore = ProfileDrawerState & ProfileDrawerActions;

const initialState: ProfileDrawerState = {
  isOpen: false
};

/** Global account menu drawer — opened from bottom nav or navbar profile button. */
export const useProfileDrawerStore = create<ProfileDrawerStore>()((set) => ({
  ...initialState,
  setOpen: (open) => set({ isOpen: open }),
  openProfileDrawer: () => set({ isOpen: true }),
  closeProfileDrawer: () => set({ isOpen: false }),
  reset: () => set(initialState)
}));
