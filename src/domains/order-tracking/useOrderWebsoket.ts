import { useEffect, useState } from 'react';

// hooks/useOrderWebSocket.ts (corrected)
export function useOrderWebSocket(orderId: number) {
  const [status, setStatus] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8080/api/v1/ws`);

    ws.onopen = () => {
      setConnected(true);
      ws.send(
        JSON.stringify({
          type: 'join_room',
          data: `order_${orderId}` // matches backend room ID
        })
      );
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      // Adjust to your backend's actual field name
      // @ts-expect-error proper socket
      if (msg.type === 'order_status_update') {
        // @ts-expect-error proper socket
        setStatus(msg.data.new_status || msg.data.status);
      }
    };

    ws.onclose = () => setConnected(false);
    return () => ws.close();
  }, [orderId]);

  return { status, connected };
}
