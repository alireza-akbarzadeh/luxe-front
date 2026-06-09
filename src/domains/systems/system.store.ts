// stores/settings-dialog-store.ts
import { create } from 'zustand';

import type { DtoSettingResponse } from '@/services/-settings-get.schemas';

export type ModalType = 'create' | 'update' | 'delete' | null;

interface SettingsDialogState {
  modalType: ModalType;
  selectedSetting: DtoSettingResponse | null;
}

interface SettingsDialogActions {
  openCreate: () => void;
  openUpdate: (setting: DtoSettingResponse) => void;
  openDelete: (setting: DtoSettingResponse) => void;
  close: () => void;
}

type SettingsDialogStore = SettingsDialogState & SettingsDialogActions;

export const useSettingsDialogStore = create<SettingsDialogStore>((set) => ({
  modalType: null,
  selectedSetting: null,
  openCreate: () => set({ modalType: 'create', selectedSetting: null }),
  openUpdate: (setting) => set({ modalType: 'update', selectedSetting: setting }),
  openDelete: (setting) => set({ modalType: 'delete', selectedSetting: setting }),
  close: () => set({ modalType: null, selectedSetting: null })
}));
