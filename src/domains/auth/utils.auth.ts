export type PasswordStrengthKey = 'weak' | 'fair' | 'good' | 'strong' | 'veryStrong';

export type PasswordRequirementKey = 'minLength' | 'mixedCase' | 'number' | 'special';

interface PasswordStrength {
  score: number;
  labelKey: PasswordStrengthKey;
  color: string;
}

export function getPasswordStrength(password: string): PasswordStrength {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

  if (score <= 1) return { score: 1, labelKey: 'weak', color: 'bg-red-500' };
  if (score <= 2) return { score: 2, labelKey: 'fair', color: 'bg-orange-500' };
  if (score <= 3) return { score: 3, labelKey: 'good', color: 'bg-yellow-500' };
  if (score <= 4) return { score: 4, labelKey: 'strong', color: 'bg-green-500' };
  return { score: 5, labelKey: 'veryStrong', color: 'bg-emerald-500' };
}

export const passwordRequirementKeys: Array<{
  key: PasswordRequirementKey;
  test: (password: string) => boolean;
}> = [
  { key: 'minLength', test: (p) => p.length >= 8 },
  { key: 'mixedCase', test: (p) => /[a-z]/.test(p) && /[A-Z]/.test(p) },
  { key: 'number', test: (p) => /\d/.test(p) },
  { key: 'special', test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) }
];
