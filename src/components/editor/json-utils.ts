export function safeParse(value: string) {
  try {
    return { ok: true as const, value: JSON.parse(value) };
  } catch (e) {
    return {
      ok: false as const,
      error: e instanceof Error ? e.message : 'Invalid JSON'
    };
  }
}

export function formatJson(value: string) {
  return JSON.stringify(JSON.parse(value), null, 2);
}

export function minifyJson(value: string) {
  return JSON.stringify(JSON.parse(value));
}

export function toJson(value: unknown) {
  if (typeof value === 'string') return value;
  return JSON.stringify(value ?? {}, null, 2);
}
