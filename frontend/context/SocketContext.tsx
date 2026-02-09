"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface SocketContextType {
  isConnected: boolean;
  lastDataUpdate: any | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastDataUpdate, setLastDataUpdate] = useState<any | null>(null);

  useEffect(() => {
    // Connect to FastAPI WebSocket
    const ws = new WebSocket("ws://127.0.0.1:8000/ws");

    ws.onopen = () => {
      console.log("MediCore Socket Connected");
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        // Handle Hospital Events
        if (["NEW_APPOINTMENT", "APPOINTMENT_UPDATE"].includes(msg.type)) {
          console.log("Socket Event:", msg.type);
          setLastDataUpdate({ type: msg.type, timestamp: new Date(), data: msg.data });
        }
      } catch (e) {
        console.error("WS Parse Error", e);
      }
    };

    ws.onclose = () => {
      console.log("MediCore Socket Disconnected");
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ isConnected, lastDataUpdate }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
