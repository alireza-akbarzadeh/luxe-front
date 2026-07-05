'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type HouseholdMember = {
  id: string;
  name: string;
  relationship: string;
  sizes: string;
  preferences: string;
  interests: string;
};

interface HouseholdProfilesState {
  members: HouseholdMember[];
}

interface HouseholdProfilesActions {
  addMember: (member: Omit<HouseholdMember, 'id'>) => void;
  updateMember: (id: string, patch: Partial<Omit<HouseholdMember, 'id'>>) => void;
  removeMember: (id: string) => void;
  reset: () => void;
}

type HouseholdProfilesStore = HouseholdProfilesState & HouseholdProfilesActions;

const initialState: HouseholdProfilesState = {
  members: []
};

/** Client-only household member profiles for personalized shopping (persisted locally). */
export const useHouseholdProfilesStore = create<HouseholdProfilesStore>()(
  persist(
    (set) => ({
      ...initialState,

      addMember: (member) =>
        set((state) => ({
          members: [
            ...state.members,
            {
              ...member,
              id: crypto.randomUUID()
            }
          ].slice(0, 8)
        })),

      updateMember: (id, patch) =>
        set((state) => ({
          members: state.members.map((item) =>
            item.id === id ? { ...item, ...patch, id: item.id } : item
          )
        })),

      removeMember: (id) =>
        set((state) => ({
          members: state.members.filter((item) => item.id !== id)
        })),

      reset: () => set({ ...initialState })
    }),
    {
      name: 'luxe-household-profiles',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ members: state.members })
    }
  )
);
