"use client";
import Navbar from '../components/Navbar';
import Link from 'next/link';
import { Calendar, Users, ShieldCheck } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <Navbar />
      <header className="px-8 py-20 text-center">
        <h1 className="text-5xl font-bold text-slate-900 mb-6">Modern Healthcare Management</h1>
        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">Streamlined appointments, patient records, and hospital administration in one secure platform.</p>
        <div className="flex justify-center gap-4">
            <Link href="/login" className="bg-brand-blue text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all">Patient Portal</Link>
            <Link href="/signup" className="bg-white text-slate-700 border border-slate-300 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all">New Registration</Link>
        </div>
      </header>
      
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 py-12 max-w-6xl mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <Calendar className="text-brand-blue mb-4" size={40} />
            <h3 className="text-xl font-bold mb-2">Instant Booking</h3>
            <p className="text-slate-500">Schedule appointments with top specialists in seconds.</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <ShieldCheck className="text-brand-teal mb-4" size={40} />
            <h3 className="text-xl font-bold mb-2">Secure Records</h3>
            <p className="text-slate-500">Your medical history stored with enterprise-grade security.</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <Users className="text-purple-500 mb-4" size={40} />
            <h3 className="text-xl font-bold mb-2">Expert Care</h3>
            <p className="text-slate-500">Connect with verified doctors and staff.</p>
        </div>
      </section>
    </div>
  );
}
