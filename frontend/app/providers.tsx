"use client";
import { AuthProvider } from '../context/AuthContext';
import { SocketProvider } from '../context/SocketContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SocketProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </SocketProvider>
  );
}
