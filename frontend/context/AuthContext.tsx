"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: str;
  role: 'patient' | 'doctor' | 'admin';
  details?: any;
}

interface AuthContextType {
  user: User | null;
  login: (u: string, p: string, role: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const API_URL = "http://127.0.0.1:8000";

  useEffect(() => {
    const stored = localStorage.getItem('hms_user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = async (username: string, pass: string, role: string) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { username, password: pass, role });
      setUser(res.data);
      localStorage.setItem('hms_user', JSON.stringify(res.data));
      router.push('/dashboard');
    } catch (e) {
      throw new Error("Login failed. Check credentials.");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hms_user');
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext)!; }
