/** Returns true when value is a non-null object record. */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/** Reads a string message type from a WebSocket frame. */
export function readMessageType(value: unknown): string | undefined {
  if (!isRecord(value)) return undefined;
  return typeof value['type'] === 'string' ? value['type'] : undefined;
}

/** Reads the payload object from a typed WebSocket frame. */
export function readMessagePayload(value: unknown): unknown {
  if (!isRecord(value)) return undefined;
  return value['payload'];
}

/** Type guard for frames shaped as `{ type: string, payload?: unknown }`. */
export function isTypedMessage(value: unknown): value is { type: string; payload?: unknown } {
  return readMessageType(value) !== undefined;
}
