// Helper to apply spacing class from key
import { type SpacingKey, spacingMap } from '@/components/theme/spacing';

export const applySpacing = (key?: SpacingKey, prefix?: string) => {
  if (!key) return '';
  const value = spacingMap[key];
  if (prefix) {
    return value.replace('gap-', `${prefix}-`);
  }
  return value;
};
