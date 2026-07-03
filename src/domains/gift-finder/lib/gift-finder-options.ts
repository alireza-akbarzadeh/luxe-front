/** Wizard option keys — labels come from next-intl `giftFinder.options.*`. */

export const GIFT_RECIPIENTS = [
  'partner',
  'parent',
  'friend',
  'sibling',
  'coworker',
  'child',
  'other'
] as const;

export const GIFT_OCCASIONS = [
  'birthday',
  'anniversary',
  'wedding',
  'holiday',
  'graduation',
  'thankYou',
  'housewarming',
  'justBecause',
  'other'
] as const;

export const GIFT_BUDGETS = [
  'under50',
  '50to100',
  '100to200',
  '200to500',
  'over500',
  'flexible'
] as const;

export const GIFT_STYLE_TAGS = [
  'minimalist',
  'luxury',
  'sporty',
  'tech',
  'cozy',
  'classic',
  'eco'
] as const;

export type GiftRecipient = (typeof GIFT_RECIPIENTS)[number];
export type GiftOccasion = (typeof GIFT_OCCASIONS)[number];
export type GiftBudgetKey = (typeof GIFT_BUDGETS)[number];
export type GiftStyleTag = (typeof GIFT_STYLE_TAGS)[number];

export type GiftFinderStep =
  | 'recipient'
  | 'occasion'
  | 'budget'
  | 'interests'
  | 'followUp'
  | 'results';

export const GIFT_FINDER_STEPS: GiftFinderStep[] = [
  'recipient',
  'occasion',
  'budget',
  'interests',
  'followUp',
  'results'
];

export const WIZARD_STEPS: GiftFinderStep[] = ['recipient', 'occasion', 'budget', 'interests'];

/** Maps budget chip to API min/max (0 max = open-ended). */
export function budgetKeyToRange(key: GiftBudgetKey): { min: number; max: number } {
  switch (key) {
    case 'under50':
      return { min: 0, max: 50 };
    case '50to100':
      return { min: 50, max: 100 };
    case '100to200':
      return { min: 100, max: 200 };
    case '200to500':
      return { min: 200, max: 500 };
    case 'over500':
      return { min: 500, max: 0 };
    default:
      return { min: 0, max: 0 };
  }
}
