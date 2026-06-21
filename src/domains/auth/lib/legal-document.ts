/** Setting keys and parsed shape for legal documents from GET /settings/{key}. */
export const LEGAL_SETTING_KEYS = {
  terms: 'legal.terms',
  privacy: 'legal.privacy'
} as const;

export type LegalDocumentKind = keyof typeof LEGAL_SETTING_KEYS;

export interface LegalDocumentSection {
  heading?: string;
  body?: string;
}

export interface LegalDocument {
  title?: string;
  version?: string;
  content?: string;
  sections?: LegalDocumentSection[];
}

export function parseLegalDocument(value: unknown): LegalDocument | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const doc = value as LegalDocument;
  if (doc.title || doc.content || (Array.isArray(doc.sections) && doc.sections.length > 0)) {
    return doc;
  }

  return null;
}
