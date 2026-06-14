'use client';

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';

import { connectRealtimeSocket } from './ws-client';

type MessageListener = (message: unknown) => void;
type ConnectionStatus = 'connecting' | 'connected' | 'disconnected';

interface RealtimeContextValue {
  subscribe: (listener: MessageListener) => () => void;
  joinRoom: (room: string) => void;
  status: ConnectionStatus;
}

const RealtimeContext = createContext<RealtimeContextValue | null>(null);

/**
 * Maintains one authenticated WebSocket for the admin dashboard.
 * Features subscribe to messages instead of opening their own sockets.
 */
export function RealtimeProvider({ children }: { children: ReactNode }) {
  const listenersRef = useRef(new Set<MessageListener>());
  const socketRef = useRef<WebSocket | null>(null);
  const pendingRoomsRef = useRef(new Set<string>());
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');

  const subscribe = useCallback((listener: MessageListener) => {
    listenersRef.current.add(listener);
    return () => {
      listenersRef.current.delete(listener);
    };
  }, []);

  const joinRoom = useCallback((room: string) => {
    pendingRoomsRef.current.add(room);
    const socket = socketRef.current;
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'join_room', data: room }));
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined;

    const joinPendingRooms = (socket: WebSocket) => {
      for (const room of pendingRoomsRef.current) {
        socket.send(JSON.stringify({ type: 'join_room', data: room }));
      }
    };

    const connect = async () => {
      if (cancelled) return;

      setStatus('connecting');

      const socket = await connectRealtimeSocket({
        onOpen: () => {
          if (cancelled) return;
          setStatus('connected');
          joinPendingRooms(socket as WebSocket);
        },
        onMessage: (raw) => {
          listenersRef.current.forEach((listener) => listener(raw));
        },
        onClose: () => {
          socketRef.current = null;
          if (cancelled) return;
          setStatus('disconnected');
          reconnectTimer = setTimeout(() => {
            void connect();
          }, 3000);
        }
      });

      socketRef.current = socket;

      if (!socket && !cancelled) {
        setStatus('disconnected');
        reconnectTimer = setTimeout(() => {
          void connect();
        }, 3000);
      }
    };

    void connect();

    return () => {
      cancelled = true;
      clearTimeout(reconnectTimer);
      socketRef.current?.close();
      socketRef.current = null;
      setStatus('disconnected');
    };
  }, []);

  return (
    <RealtimeContext.Provider value={{ subscribe, joinRoom, status }}>
      {children}
    </RealtimeContext.Provider>
  );
}

export function useRealtime() {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within RealtimeProvider');
  }
  return context;
}

/** Subscribe to all realtime frames on the shared dashboard socket. */
export function useRealtimeSubscribe(onMessage: (message: unknown) => void) {
  const { subscribe } = useRealtime();
  const handlerRef = useRef(onMessage);

  useEffect(() => {
    handlerRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    return subscribe((message) => handlerRef.current(message));
  }, [subscribe]);
}
