import { ensureClientAccessToken } from '@/lib/auth/auth-token-client';

export const SALES_FEED_ROOM = 'admin_sales_feed';

/** Resolve the backend WebSocket upgrade URL. */
export function getWebSocketUrl(): string {
  const explicit = process.env['NEXT_PUBLIC_WS_URL'];
  if (explicit) return explicit;

  const apiUrl = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:8080/api/v1';
  return `${apiUrl.replace(/^http/i, 'ws')}/ws/connect`;
}

interface RealtimeSocketOptions {
  rooms?: string[];
  onMessage: (payload: unknown) => void;
  onOpen?: () => void;
  onClose?: () => void;
}

/**
 * Opens an authenticated WebSocket to the Go backend.
 * Token is passed via query string because browser WebSocket cannot set headers.
 */
export async function connectRealtimeSocket(
  options: RealtimeSocketOptions
): Promise<WebSocket | null> {
  const token = await ensureClientAccessToken();
  if (!token) return null;

  const url = `${getWebSocketUrl()}?token=${encodeURIComponent(token)}`;
  const socket = new WebSocket(url);

  socket.addEventListener('open', () => {
    for (const room of options.rooms ?? []) {
      socket.send(JSON.stringify({ type: 'join_room', data: room }));
    }
    options.onOpen?.();
  });

  socket.addEventListener('message', (event) => {
    try {
      options.onMessage(JSON.parse(event.data as string));
    } catch {
      // Ignore malformed frames.
    }
  });

  socket.addEventListener('close', () => {
    options.onClose?.();
  });

  return socket;
}
