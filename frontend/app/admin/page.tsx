"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';

export default function AdminPanel() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    specialty: '',
    username: '',
    password: '',
    national_id: '',
    date_of_birth: '1980-01-01'
  });

  // ← Key change here too
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  const load = async () => {
    const res = await axios.get(`${API_URL}/doctors`);
    setDoctors(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const addDoctor = async () => {
    try {
      await axios.post(`${API_URL}/doctors`, form);
      alert("Doctor Added");
      load();
    } catch (e) {
      alert("Error adding doctor");
    }
  };

  const seed = async () => {
    await axios.post(`${API_URL}/seed`);
    load();
    alert("Database Reset & Seeded");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-6xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Admin Administration</h1>
          <button onClick={seed} className="bg-red-600 text-white px-4 py-2 rounded shadow">
            Reset System Data
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Add Doctor Form */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-xl mb-4">Add New Doctor</h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="First Name"
                className="border p-2 rounded"
                onChange={e => setForm({ ...form, first_name: e.target.value })}
                suppressHydrationWarning
              />
              <input
                placeholder="Last Name"
                className="border p-2 rounded"
                onChange={e => setForm({ ...form, last_name: e.target.value })}
                suppressHydrationWarning
              />
              <input
                placeholder="Specialty"
                className="border p-2 rounded"
                onChange={e => setForm({ ...form, specialty: e.target.value })}
                suppressHydrationWarning
              />
              <input
                placeholder="National ID"
                className="border p-2 rounded"
                onChange={e => setForm({ ...form, national_id: e.target.value })}
                suppressHydrationWarning
              />
              <input
                placeholder="Username"
                className="border p-2 rounded"
                onChange={e => setForm({ ...form, username: e.target.value })}
                suppressHydrationWarning
              />
              <input
                placeholder="Password"
                className="border p-2 rounded"
                onChange={e => setForm({ ...form, password: e.target.value })}
                suppressHydrationWarning
              />
            </div>
            <button
              onClick={addDoctor}
              className="mt-4 w-full bg-slate-800 text-white py-2 rounded font-bold"
            >
              Create Profile
            </button>
          </div>

          {/* Staff List (Doctors) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-xl mb-4">Medical Staff</h3>
            <div className="overflow-y-auto max-h-96 space-y-2">
              {doctors.map(d => (
                <div
                  key={d.doctor_id}
                  className="flex justify-between p-3 bg-slate-50 rounded border border-slate-100"
                >
                  <span>Dr. {d.first_name} {d.last_name}</span>
                  <span className="text-slate-500 text-sm">{d.specialty}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}