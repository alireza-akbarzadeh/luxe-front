import { create } from 'zustand';

import type { DtoAiGiftFinderResponse } from '@/services/-ai-gift-finder-post.schemas';

import type { GiftFinderStep } from '../lib/gift-finder-options';
import { emptyGiftFinderDraft, type GiftFinderDraft } from '../schemas/gift-finder-schema';

interface GiftFinderState {
  step: GiftFinderStep;
  draft: GiftFinderDraft;
  followUpQuestions: string[];
  followUpAnswers: Record<string, string>;
  result: DtoAiGiftFinderResponse | null;
}

interface GiftFinderActions {
  setStep: (step: GiftFinderStep) => void;
  updateDraft: (patch: Partial<GiftFinderDraft>) => void;
  setFollowUpQuestions: (questions: string[]) => void;
  setFollowUpAnswer: (question: string, answer: string) => void;
  setResult: (result: DtoAiGiftFinderResponse | null) => void;
  reset: () => void;
}

type GiftFinderStore = GiftFinderState & GiftFinderActions;

const initialState: GiftFinderState = {
  step: 'recipient',
  draft: { ...emptyGiftFinderDraft },
  followUpQuestions: [],
  followUpAnswers: {},
  result: null
};

/** Client UI state for the gift finder wizard (not server data). */
export const useGiftFinderStore = create<GiftFinderStore>((set) => ({
  ...initialState,

  setStep: (step) => set({ step }),
  updateDraft: (patch) => set((state) => ({ draft: { ...state.draft, ...patch } })),
  setFollowUpQuestions: (followUpQuestions) => set({ followUpQuestions }),
  setFollowUpAnswer: (question, answer) =>
    set((state) => ({
      followUpAnswers: { ...state.followUpAnswers, [question]: answer }
    })),
  setResult: (result) => set({ result }),
  reset: () => set({ ...initialState, draft: { ...emptyGiftFinderDraft } })
}));
