'use client';

import React, { useState, useEffect } from 'react';
import { UserSession, PendaftaranUKM, MahasiswaProfile } from '@/types';
import { LIST_UKM } from '@/data/mockData';
import { Navbar } from '@/components/Navbar';
import { AuthModal } from '@/components/AuthModal';
import { RegistrationForm } from '@/components/RegistrationForm';
import { MahasiswaDashboard } from '@/components/MahasiswaDashboard';
import { IconBook, IconSparkles } from '@/components/NeoIcons';

export default function Home() {
  // Persistent User Session State
  const [session, setSession] = useState<UserSession>({
    isLoggedIn: false,
    email: '',
    role: 'mahasiswa',
  });

  const [activeTab, setActiveTab] = useState<'FORM' | 'STATUS'>('FORM');

  // Pendaftaran Database State
  const [pendaftaranList, setPendaftaranList] = useState<PendaftaranUKM[]>([]);
  const [isLoadingDb, setIsLoadingDb] = useState(true);

  // Restore saved session from LocalStorage on mount
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem('prm_unesa_user_session');
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed && parsed.isLoggedIn && parsed.email) {
          const isSuper = parsed.email.toLowerCase().includes('nurdhuha.23100');
          setSession({
            isLoggedIn: true,
            email: parsed.email,
            role: isSuper ? 'superadmin' : parsed.role || 'mahasiswa',
          });
        }
      }
    } catch (e) {
      console.error('Error restoring session:', e);
    }
  }, []);

  // Fetch data from PostgreSQL Backend API
  const fetchPendaftaranList = async () => {
    try {
      setIsLoadingDb(true);
      const res = await fetch('/api/pendaftaran');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setPendaftaranList(data.data);
      }
    } catch (e) {
      console.error('Fetch PostgreSQL Error:', e);
    } finally {
      setIsLoadingDb(false);
    }
  };

  useEffect(() => {
    fetchPendaftaranList();
  }, []);

  // Find active registration for current logged-in UNESA email
  const currentRegistration =
    session.isLoggedIn && session.email
      ? pendaftaranList.find(
          (p) =>
            p.mahasiswa.email?.toLowerCase() === session.email.toLowerCase() &&
            p.status !== 'CANCELLED'
        ) || null
      : null;

  const [isJustLoggedIn, setIsJustLoggedIn] = useState(false);

  // Handle Login & Register Success from AuthModal
  const handleSuccessLogin = (email: string) => {
    const isSuper = email.toLowerCase().includes('nurdhuha.23100');
    const newSession: UserSession = {
      isLoggedIn: true,
      email,
      role: isSuper ? 'superadmin' : 'mahasiswa',
    };

    setSession(newSession);
    setIsJustLoggedIn(true);
    setTimeout(() => setIsJustLoggedIn(false), 700);

    // Save session automatically for auto-login on return
    try {
      localStorage.setItem('prm_unesa_user_session', JSON.stringify(newSession));
    } catch (e) {
      console.error('Save session error:', e);
    }

    const existing = pendaftaranList.find(
      (p) => p.mahasiswa.email?.toLowerCase() === email.toLowerCase() && p.status !== 'CANCELLED'
    );

    if (existing) {
      setActiveTab('STATUS');
    } else {
      setActiveTab('FORM');
    }
  };

  const handleLogout = () => {
    setSession({
      isLoggedIn: false,
      email: '',
      role: 'mahasiswa',
    });
    try {
      localStorage.removeItem('prm_unesa_user_session');
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Submit Registration to PostgreSQL API
  const handleSubmitPendaftaran = async (profile: MahasiswaProfile, ukmId: string) => {
    const selectedUkm = LIST_UKM.find((u) => u.id === ukmId);
    const payload = {
      mahasiswa: {
        ...profile,
        email: session.email,
      },
      ukmId,
      ukmNama: selectedUkm?.nama || 'UKM UNESA',
    };

    try {
      const res = await fetch('/api/pendaftaran', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!json.success) {
        alert(`Gagal mendaftar: ${json.error}`);
        return;
      }

      await fetchPendaftaranList();
      setActiveTab('STATUS');
    } catch (err: any) {
      console.error('Submit Registration Error:', err);
      alert('Terjadi kesalahan saat menghubungi server PostgreSQL.');
    }
  };

  // Handle Cancel Pendaftaran in PostgreSQL
  const handleCancelPendaftaran = async () => {
    if (!currentRegistration) return;
    try {
      const res = await fetch('/api/pendaftaran', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: currentRegistration.id, action: 'CANCEL' }),
      });
      const json = await res.json();
      if (json.success) {
        await fetchPendaftaranList();
        setActiveTab('FORM');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col animated-gradient">
      {/* Noise Texture Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.05] noise-overlay pointer-events-none z-0"></div>

      {/* Navbar */}
      <Navbar session={session} onLogout={handleLogout} />

      {/* Main Content */}
      <main className="relative z-10 flex-1 px-4 py-8 max-w-6xl mx-auto w-full">
        {/* Auth Modal Trigger (Login / Daftar Email UNESA) */}
        <AuthModal isOpen={!session.isLoggedIn} onSuccessLogin={handleSuccessLogin} />

        {session.isLoggedIn && (
          <div className={`space-y-6 ${isJustLoggedIn ? 'animate-page-transition' : ''}`}>
            {/* Navigation Tabs for Mahasiswa & Superadmin View on Main Route / */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setActiveTab('FORM')}
                className={`px-5 py-2.5 rounded-xl border-3 border-[#1D1C1C] font-black text-xs uppercase shadow-[3px_3px_0px_#1D1C1C] transition-all flex items-center gap-2 ${
                  activeTab === 'FORM'
                    ? 'bg-[#FFF48D] text-[#1D1C1C] -translate-y-0.5 shadow-[5px_5px_0px_#1D1C1C]'
                    : 'bg-white text-stone-700 hover:bg-stone-50'
                }`}
              >
                <IconBook className="w-4 h-4" /> Form Pendaftaran
              </button>

              <button
                onClick={() => setActiveTab('STATUS')}
                className={`px-5 py-2.5 rounded-xl border-3 border-[#1D1C1C] font-black text-xs uppercase shadow-[3px_3px_0px_#1D1C1C] transition-all flex items-center gap-2 ${
                  activeTab === 'STATUS'
                    ? 'bg-[#83F582] text-[#1D1C1C] -translate-y-0.5 shadow-[5px_5px_0px_#1D1C1C]'
                    : 'bg-white text-stone-700 hover:bg-stone-50'
                }`}
              >
                <IconSparkles className="w-4 h-4" /> Status Pendaftaran Saya
                {currentRegistration && (
                  <span className="bg-[#1D1C1C] text-white px-2 py-0.5 rounded-full text-[10px] font-black">
                    {currentRegistration.status}
                  </span>
                )}
              </button>
            </div>

            {/* View Switcher: Route / ALWAYS displays RegistrationForm or MahasiswaDashboard */}
            {activeTab === 'FORM' ? (
              <RegistrationForm
                userEmail={session.email}
                existingRegistration={currentRegistration}
                onSubmitPendaftaran={handleSubmitPendaftaran}
              />
            ) : (
              <MahasiswaDashboard
                registration={currentRegistration}
                onCancelPendaftaran={handleCancelPendaftaran}
                onGoToRegistration={() => setActiveTab('FORM')}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-3 sm:py-4 px-3 sm:px-4 bg-white/90 border-t-3 border-[#1D1C1C] text-center text-[10px] sm:text-xs font-black text-stone-800 leading-snug">
        <p>© 2026 PEKAN RAYA MAHASISWA — Direktorat Kemahasiswaan dan Alumni Universitas Negeri Surabaya</p>
      </footer>
    </div>
  );
}
