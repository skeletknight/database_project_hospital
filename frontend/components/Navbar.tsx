"use client";
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { LogOut, Activity, UserCircle } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 text-brand-blue font-bold text-xl">
            <Activity size={24} /> MEDI<span className="text-slate-800">CORE</span>
        </Link>
        <div className="flex items-center gap-6">
            {user ? (
                <>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <UserCircle size={18} />
                        <span className="font-bold">{user.name}</span>
                        <span className="text-xs uppercase bg-slate-100 px-2 py-1 rounded">{user.role}</span>
                    </div>
                    <button onClick={logout} className="text-red-500 hover:bg-red-50 p-2 rounded"><LogOut size={18}/></button>
                </>
            ) : (
                <Link href="/login" className="bg-brand-blue text-white px-5 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all">Login</Link>
            )}
        </div>
    </nav>
  );
}
