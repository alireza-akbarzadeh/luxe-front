import { create } from 'zustand';

import { toISODate } from '@/domains/store-calendar/lib/calendar-format';
import type { CalendarViewMode } from '@/domains/store-calendar/types/store-calendar.types';

interface StoreCalendarState {
  selectedDate: string;
  viewMode: CalendarViewMode;
  drawerOpen: boolean;
  contextMenuDate: string | null;
}

interface StoreCalendarActions {
  selectDate: (date: string) => void;
  openDrawer: (date?: string) => void;
  closeDrawer: () => void;
  setViewMode: (mode: CalendarViewMode) => void;
  setContextMenuDate: (date: string | null) => void;
  reset: () => void;
}

type StoreCalendarStore = StoreCalendarState & StoreCalendarActions;

const initialState: StoreCalendarState = {
  selectedDate: toISODate(new Date()),
  viewMode: 'month',
  drawerOpen: false,
  contextMenuDate: null
};

/** Client UI state for the store calendar dashboard — selection, drawer, and view mode only. */
export const useStoreCalendarStore = create<StoreCalendarStore>()((set) => ({
  ...initialState,
  selectDate: (date) => set({ selectedDate: date }),
  openDrawer: (date) =>
    set((state) => ({ drawerOpen: true, selectedDate: date ?? state.selectedDate })),
  closeDrawer: () => set({ drawerOpen: false }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setContextMenuDate: (date) => set({ contextMenuDate: date }),
  reset: () => set(initialState)
}));
