'use client';

import React, { useState, useEffect } from 'react';
import { PendaftaranUKM, UserSession } from '@/types';
import { LIST_UKM } from '@/data/mockData';
import { Navbar } from '@/components/Navbar';
import { AdminDashboard } from '@/components/AdminDashboard';
import { AuthModal } from '@/components/AuthModal';

export const dynamic = 'force-dynamic';

export default function PengurusPage() {
  const [session, setSession] = useState<UserSession>({
    isLoggedIn: false,
    email: '',
    role: 'pengurus',
  });

  const [pendaftaranList, setPendaftaranList] = useState<PendaftaranUKM[]>([]);
  const [isLoadingDb, setIsLoadingDb] = useState(true);

  // Helper to extract managed UKM from officer email
  const inferManagedUkmFromEmail = (emailStr: string) => {
    const cleanEmail = emailStr.toLowerCase().trim();
    if (cleanEmail.includes('nurdhuha.23100')) {
      return { id: undefined, nama: undefined };
    }

    // Try to match email username to UKM ID or UKM Name slug
    // e.g. pengurus.menwa@... => UKM Menwa
    // e.g. pengurus.futsal@... => UKM Futsal
    const prefix = cleanEmail.split('@')[0]; // e.g. "pengurus.menwa" or "menwa"
    const matchedUkm = LIST_UKM.find((ukm) => {
      const ukmSlug = ukm.id.toLowerCase();
      const ukmNamaLower = ukm.nama.toLowerCase();
      return (
        prefix.includes(ukmSlug) ||
        ukmNamaLower.includes(prefix.replace('pengurus.', '').replace('pengurus_', ''))
      );
    });

    if (matchedUkm) {
      return { id: matchedUkm.id, nama: matchedUkm.nama };
    }

    // Default fallback to first UKM if unmatched specific officer email
    return { id: LIST_UKM[0].id, nama: LIST_UKM[0].nama };
  };

  // Restore saved session from LocalStorage on mount
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem('prm_unesa_user_session');
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed && parsed.isLoggedIn && parsed.email) {
          const isSuper = parsed.email.toLowerCase().includes('nurdhuha.23100');
          const ukmInfo = inferManagedUkmFromEmail(parsed.email);

          setSession({
            isLoggedIn: true,
            email: parsed.email,
            role: isSuper ? 'superadmin' : 'pengurus',
            managedUkmId: ukmInfo.id,
            managedUkmNama: ukmInfo.nama,
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

  const handleSuccessLogin = (email: string) => {
    const isSuper = email.toLowerCase().includes('nurdhuha.23100');
    const ukmInfo = inferManagedUkmFromEmail(email);

    const newSession: UserSession = {
      isLoggedIn: true,
      email,
      role: isSuper ? 'superadmin' : 'pengurus',
      managedUkmId: ukmInfo.id,
      managedUkmNama: ukmInfo.nama,
    };

    setSession(newSession);
    try {
      localStorage.setItem('prm_unesa_user_session', JSON.stringify(newSession));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    setSession({
      isLoggedIn: false,
      email: '',
      role: 'pengurus',
    });
    try {
      localStorage.removeItem('prm_unesa_user_session');
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdminApprove = async (id: string) => {
    try {
      const res = await fetch('/api/pendaftaran', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'APPROVE' }),
      });
      const json = await res.json();
      if (json.success) {
        await fetchPendaftaranList();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdminReject = async (id: string, reason: string) => {
    try {
      const res = await fetch('/api/pendaftaran', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'REJECT', catatanPenolakan: reason }),
      });
      const json = await res.json();
      if (json.success) {
        await fetchPendaftaranList();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col animated-gradient">
      {/* Noise Overlay */}
      <div className="absolute inset-0 opacity-[0.05] noise-overlay pointer-events-none z-0"></div>

      {/* Navbar */}
      <Navbar session={session} onLogout={handleLogout} />

      {/* Main Content */}
      <main className="relative z-10 flex-1 px-4 py-8 max-w-6xl mx-auto w-full">
        <AuthModal isOpen={!session.isLoggedIn} onSuccessLogin={handleSuccessLogin} />

        {session.isLoggedIn && (
          <AdminDashboard
            session={session}
            pendaftaranList={pendaftaranList}
            onApprove={handleAdminApprove}
            onReject={handleAdminReject}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-3 sm:py-4 px-3 sm:px-4 bg-white/90 border-t-3 border-[#1D1C1C] text-center text-[10px] sm:text-xs font-black text-stone-800 leading-snug">
        <p>© 2026 PEKAN RAYA MAHASISWA — Direktorat Kemahasiswaan dan Alumni Universitas Negeri Surabaya</p>
      </footer>
    </div>
  );
}
