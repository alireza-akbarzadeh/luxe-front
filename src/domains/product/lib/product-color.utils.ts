export interface ColorToken {
  hex: string;
  label: string;
}

const COLOR_TOKENS: Record<string, ColorToken> = {
  silver: { hex: '#C8C8C8', label: 'Silver' },
  gold: { hex: '#D4AF37', label: 'Gold' },
  'midnight black': { hex: '#1A1A1A', label: 'Midnight Black' },
  'rose gold': { hex: '#B76E79', label: 'Rose Gold' },
  black: { hex: '#111111', label: 'Black' },
  white: { hex: '#F5F5F5', label: 'White' },
  navy: { hex: '#1E3A5F', label: 'Navy' },
  brown: { hex: '#6B4423', label: 'Brown' }
};

function isHexColor(value: string) {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value.trim());
}

/** Map attribute color value to swatch hex + human label. */
export function resolveColorToken(value: string): ColorToken {
  const trimmed = value.trim();
  if (isHexColor(trimmed)) {
    return { hex: trimmed, label: trimmed.toUpperCase() };
  }

  const token = COLOR_TOKENS[trimmed.toLowerCase()];
  if (token) return token;

  return { hex: '#D4D4D4', label: trimmed };
}

export { isHexColor };
