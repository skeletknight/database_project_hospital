"use client";
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Signup() {
  const [form, setForm] = useState({ first_name: '', last_name: '', national_id: '', password: '', age: '' });
  const router = useRouter();
  const API_URL = "http://127.0.0.1:8000";

  const register = async () => {
    try {
        await axios.post(`${API_URL}/patients`, { ...form, date_of_birth: "2000-01-01" });
        alert("Registration Successful! Please Login.");
        router.push('/login');
    } catch (e) { alert("Registration failed"); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Patient Registration</h2>
            <div className="space-y-3">
                <input placeholder="First Name" className="w-full border p-3 rounded" onChange={e => setForm({...form, first_name: e.target.value})} />
                <input placeholder="Last Name" className="w-full border p-3 rounded" onChange={e => setForm({...form, last_name: e.target.value})} />
                <input placeholder="National ID" className="w-full border p-3 rounded" onChange={e => setForm({...form, national_id: e.target.value})} />
                <input type="password" placeholder="Password" className="w-full border p-3 rounded" onChange={e => setForm({...form, password: e.target.value})} />
                <button onClick={register} className="w-full bg-brand-teal text-white py-3 rounded font-bold">Register</button>
            </div>
        </div>
    </div>
  );
}
