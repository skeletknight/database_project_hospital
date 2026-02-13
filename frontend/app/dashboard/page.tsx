"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import Navbar from '../../components/Navbar';
import axios from 'axios';
import { Clock, CheckCircle, XCircle, CalendarPlus } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { lastDataUpdate } = useSocket(); // Real-time triggers
  const [appointments, setAppointments] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoc, setSelectedDoc] = useState("");
  const [date, setDate] = useState("");
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  const refreshData = async () => {
    if(!user) return;
    // Load Appointments
    const res = await axios.get(`${API_URL}/appointments/my/${user.role}/${user.id}`);
    setAppointments(res.data);
    // Load Doctors if patient
    if(user.role === 'patient') {
        const dRes = await axios.get(`${API_URL}/doctors`);
        setDoctors(dRes.data);
    }
  };

  useEffect(() => { refreshData(); }, [user, lastDataUpdate]);

  const book = async () => {
    try {
        await axios.post(`${API_URL}/appointments`, {
            patient_id: user?.id, doctor_id: parseInt(selectedDoc), appointment_datetime: date
        });
        alert("Request Sent"); refreshData();
    } catch (e) { alert("Error booking"); }
  };

  const updateStatus = async (id: number, status: string) => {
      await axios.put(`${API_URL}/appointments/${id}`, { status });
      refreshData();
  };

  if (!user) return <div>Access Denied</div>;

  return (
    <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-7xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8 text-slate-800">Dashboard: <span className="capitalize">{user.role}</span></h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* --- Left Panel: Action / Profile --- */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h3 className="font-bold text-lg mb-4">Profile Info</h3>
                        <div className="text-sm space-y-2 text-slate-600">
                            <p>ID: {user.id}</p>
                            <p>Name: {user.name}</p>
                            {user.details && Object.entries(user.details).map(([k,v]) => (
                                <p key={k} className="capitalize">{k}: {String(v)}</p>
                            ))}
                        </div>
                    </div>

                    {user.role === 'patient' && (
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><CalendarPlus size={20}/> New Appointment</h3>
                            <div className="space-y-3">
                                <select className="w-full border p-2 rounded" onChange={e=>setSelectedDoc(e.target.value)}>
                                    <option value="">Select Doctor</option>
                                    {doctors.map(d => <option key={d.doctor_id} value={d.doctor_id}>Dr. {d.last_name} ({d.specialty})</option>)}
                                </select>
                                <input type="datetime-local" className="w-full border p-2 rounded" onChange={e=>setDate(e.target.value)} />
                                <button onClick={book} className="w-full bg-brand-blue text-white py-2 rounded font-bold">Book Now</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* --- Right Panel: Appointments List --- */}
                <div className="lg:col-span-2">
                    <h3 className="font-bold text-xl mb-4 text-slate-700">Appointments & Schedule</h3>
                    <div className="space-y-4">
                        {appointments.length === 0 && <div className="text-slate-400 italic">No appointments found.</div>}
                        {appointments.map(apt => (
                            <div key={apt.appointment_id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center">
                                <div>
                                    <div className="font-bold text-slate-800">
                                        {user.role === 'patient' ? `Dr. ${apt.doctor?.last_name}` : `Patient: ${apt.patient?.first_name} ${apt.patient?.last_name}`}
                                    </div>
                                    <div className="text-sm text-slate-500 flex items-center gap-2">
                                        <Clock size={14}/> {new Date(apt.appointment_datetime).toLocaleString()}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`px-3 py-1 rounded text-xs font-bold uppercase ${apt.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : apt.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {apt.status}
                                    </span>
                                    {user.role === 'doctor' && apt.status === 'Pending' && (
                                        <div className="flex gap-2">
                                            <button onClick={() => updateStatus(apt.appointment_id, 'Confirmed')} className="p-2 bg-green-50 text-green-600 rounded hover:bg-green-100"><CheckCircle size={18}/></button>
                                            <button onClick={() => updateStatus(apt.appointment_id, 'Cancelled')} className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100"><XCircle size={18}/></button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
