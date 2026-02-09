"use client";
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';

export default function Login() {
  const { login } = useAuth();
  const [role, setRole] = useState('patient');
  const [username, setUsername] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await login(username, pass, role); } catch (e: any) { setErr(e.message); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold text-center mb-6 text-slate-800">Portal Login</h2>
            {err && <div className="bg-red-50 text-red-500 p-3 rounded mb-4 text-sm">{err}</div>}
            
            <div className="flex bg-slate-100 p-1 rounded-lg mb-6">
                {['patient', 'doctor', 'staff'].map(r => (
                    <button key={r} onClick={() => setRole(r)} 
                        className={`flex-1 py-2 text-sm font-bold uppercase rounded-md transition-all ${role === r ? 'bg-white shadow text-brand-blue' : 'text-slate-400'}`}>
                        {r}
                    </button>
                ))}
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                        {role === 'patient' ? 'National ID' : 'Username'}
                    </label>
                    <input className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none" 
                        value={username} onChange={e => setUsername(e.target.value)} required />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Password</label>
                    <input type="password" className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none" 
                        value={pass} onChange={e => setPass(e.target.value)} required />
                </div>
                <button className="w-full bg-brand-blue text-white py-3 rounded-lg font-bold hover:opacity-90">Sign In</button>
            </form>
            {role === 'patient' && (
                <p className="text-center text-sm text-slate-500 mt-4">
                    New Patient? <Link href="/signup" className="text-brand-blue hover:underline">Register Here</Link>
                </p>
            )}
        </div>
    </div>
  );
}
