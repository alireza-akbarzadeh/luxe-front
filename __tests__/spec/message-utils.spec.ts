import { describe, expect, it } from 'vitest';

import {
  isRecord,
  isTypedMessage,
  readMessagePayload,
  readMessageType
} from '@/lib/realtime/message-utils';

describe('message-utils', () => {
  it('guards record types', () => {
    expect(isRecord(null)).toBe(false);
    expect(isRecord('hello')).toBe(false);
    expect(isRecord({ type: 'ping' })).toBe(true);
  });

  it('reads message type from websocket frames', () => {
    expect(readMessageType({ type: 'cart.updated' })).toBe('cart.updated');
    expect(readMessageType({ payload: {} })).toBeUndefined();
    expect(readMessageType('raw')).toBeUndefined();
  });

  it('reads payload from websocket frames', () => {
    expect(readMessagePayload({ type: 'order', payload: { id: 42 } })).toEqual({ id: 42 });
    expect(readMessagePayload({ type: 'ping' })).toBeUndefined();
  });

  it('identifies typed messages', () => {
    expect(isTypedMessage({ type: 'inventory', payload: { sku: 'SKU-1' } })).toBe(true);
    expect(isTypedMessage({ event: 'noop' })).toBe(false);
  });
});
