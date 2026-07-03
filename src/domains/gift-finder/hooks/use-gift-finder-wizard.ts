'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import {
  budgetKeyToRange,
  GIFT_BUDGETS,
  GIFT_OCCASIONS,
  GIFT_RECIPIENTS,
  GIFT_STYLE_TAGS,
  WIZARD_STEPS
} from '../lib/gift-finder-options';
import { useGiftFinderStore } from '../stores/gift-finder-store';
import { useGiftFinder } from './use-gift-finder';

function buildInterestsText(
  interests: string,
  styleTags: string[],
  labelForTag: (tag: string) => string
) {
  const tagLabels = styleTags.map(labelForTag).filter(Boolean);
  const parts = [interests.trim(), tagLabels.length > 0 ? `Style: ${tagLabels.join(', ')}` : '']
    .filter(Boolean)
    .join('. ');
  return parts;
}

/** Step navigation and gift-finder API submission. */
export function useGiftFinderWizard() {
  const t = useTranslations('giftFinder');
  const { findGifts, offlineReply } = useGiftFinder();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const step = useGiftFinderStore((s) => s.step);
  const draft = useGiftFinderStore((s) => s.draft);
  const followUpQuestions = useGiftFinderStore((s) => s.followUpQuestions);
  const followUpAnswers = useGiftFinderStore((s) => s.followUpAnswers);
  const result = useGiftFinderStore((s) => s.result);
  const setStep = useGiftFinderStore((s) => s.setStep);
  const updateDraft = useGiftFinderStore((s) => s.updateDraft);
  const setFollowUpQuestions = useGiftFinderStore((s) => s.setFollowUpQuestions);
  const setFollowUpAnswer = useGiftFinderStore((s) => s.setFollowUpAnswer);
  const setResult = useGiftFinderStore((s) => s.setResult);
  const reset = useGiftFinderStore((s) => s.reset);

  const wizardIndex = WIZARD_STEPS.indexOf(step as (typeof WIZARD_STEPS)[number]);
  const progressStep =
    step === 'followUp'
      ? WIZARD_STEPS.length
      : step === 'results'
        ? WIZARD_STEPS.length + 1
        : wizardIndex + 1;
  const progressTotal = WIZARD_STEPS.length + 1;

  const canGoNext = () => {
    switch (step) {
      case 'recipient':
        return draft.recipient.length > 0;
      case 'occasion':
        return draft.occasion.length > 0;
      case 'budget':
        return draft.budgetKey.length > 0;
      case 'interests':
        return draft.interests.trim().length > 0 || draft.styleTags.length > 0;
      case 'followUp':
        return followUpQuestions.every((q) => (followUpAnswers[q] ?? '').trim().length > 0);
      default:
        return false;
    }
  };

  const submitFinder = async (includeFollowUps: boolean) => {
    const interests = buildInterestsText(draft.interests, draft.styleTags, (tag) =>
      t(`options.styles.${tag}` as never)
    );

    const payload = {
      recipient: t(`options.recipients.${draft.recipient}` as never),
      occasion: t(`options.occasions.${draft.occasion}` as never),
      budget_min: draft.budgetMin > 0 ? draft.budgetMin : undefined,
      budget_max: draft.budgetMax > 0 ? draft.budgetMax : undefined,
      interests: interests || undefined,
      additional_notes: draft.additionalNotes.trim() || undefined,
      follow_up_answers: includeFollowUps
        ? followUpQuestions.map((question) => ({
            question,
            answer: followUpAnswers[question]?.trim() ?? ''
          }))
        : undefined
    };

    setIsSubmitting(true);
    try {
      const response = await findGifts(payload);
      if (!response) {
        toast.error(offlineReply);
        return null;
      }
      return response;
    } finally {
      setIsSubmitting(false);
    }
  };

  const goNext = async () => {
    if (!canGoNext()) {
      return;
    }

    if (step === 'interests') {
      const response = await submitFinder(false);
      if (!response) {
        return;
      }
      setResult(response);
      const questions = response.follow_up_questions ?? [];
      if (questions.length > 0 && (response.recommendations?.length ?? 0) === 0) {
        setFollowUpQuestions(questions);
        setStep('followUp');
        return;
      }
      setStep('results');
      return;
    }

    if (step === 'followUp') {
      const response = await submitFinder(true);
      if (!response) {
        return;
      }
      setResult(response);
      setStep('results');
      return;
    }

    const idx = WIZARD_STEPS.indexOf(step as (typeof WIZARD_STEPS)[number]);
    if (idx >= 0 && idx < WIZARD_STEPS.length - 1) {
      setStep(WIZARD_STEPS[idx + 1]!);
    }
  };

  const goBack = () => {
    if (step === 'results') {
      setStep('interests');
      return;
    }
    if (step === 'followUp') {
      setStep('interests');
      return;
    }
    const idx = WIZARD_STEPS.indexOf(step as (typeof WIZARD_STEPS)[number]);
    if (idx > 0) {
      setStep(WIZARD_STEPS[idx - 1]!);
    }
  };

  const selectRecipient = (value: string) => updateDraft({ recipient: value });
  const selectOccasion = (value: string) => updateDraft({ occasion: value });
  const selectBudget = (key: string) => {
    const range = budgetKeyToRange(key as (typeof GIFT_BUDGETS)[number]);
    updateDraft({
      budgetKey: key,
      budgetMin: range.min,
      budgetMax: range.max
    });
  };

  const toggleStyleTag = (tag: string) => {
    const has = draft.styleTags.includes(tag);
    updateDraft({
      styleTags: has ? draft.styleTags.filter((t) => t !== tag) : [...draft.styleTags, tag]
    });
  };

  const startOver = () => reset();

  return {
    step,
    draft,
    followUpQuestions,
    followUpAnswers,
    result,
    isPending: isSubmitting,
    progressStep,
    progressTotal,
    canGoNext: canGoNext(),
    isFirst: step === 'recipient',
    isResults: step === 'results',
    goNext,
    goBack,
    startOver,
    selectRecipient,
    selectOccasion,
    selectBudget,
    toggleStyleTag,
    setInterests: (interests: string) => updateDraft({ interests }),
    setAdditionalNotes: (additionalNotes: string) => updateDraft({ additionalNotes }),
    setFollowUpAnswer,
    recipientOptions: GIFT_RECIPIENTS,
    occasionOptions: GIFT_OCCASIONS,
    budgetOptions: GIFT_BUDGETS,
    styleOptions: GIFT_STYLE_TAGS
  };
}
