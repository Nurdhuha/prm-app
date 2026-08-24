'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UserSession } from '@/types';
import { IconLogOut, GeminiIconLogo, IconUserCheck, IconX, IconShieldCheck } from './NeoIcons';

interface NavbarProps {
  session: UserSession;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ session, onLogout }) => {
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const isSuperadmin = session.email?.toLowerCase().includes('nurdhuha.23100') || session.role === 'superadmin';

  return (
    <header className="relative sm:sticky sm:top-0 z-40 px-2.5 sm:px-4 py-2 sm:py-3 bg-[#FAF7F2] border-b-3 sm:border-b-4 border-[#1D1C1C]">
      <div className="max-w-6xl mx-auto flex flex-row items-center justify-between gap-2">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <Link href="/" className="flex items-center gap-1.5 sm:gap-3 hover:opacity-90 transition-opacity">
            <GeminiIconLogo className="w-7 h-7 sm:w-10 sm:h-10 shrink-0" />
            <div>
              <div className="flex items-center gap-1 sm:gap-2">
                <h1 className="font-black text-[11px] sm:text-lg md:text-xl tracking-tight text-[#1D1C1C] uppercase leading-tight">
                  PEKAN RAYA MAHASISWA
                </h1>
                <span className="inline-block bg-[#1D1C1C] text-[#FFF48D] text-[8px] sm:text-[10px] font-black uppercase px-1.5 py-0.5 rounded-full transform -rotate-2 border border-[#1D1C1C]">
                  2026
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* User Session & Account Trigger Button */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {session.isLoggedIn && (
            <>
              {/* Quick Navigation Link for Superadmin */}
              {isSuperadmin && (
                <Link
                  href="/pengurus"
                  className="hidden md:flex items-center gap-1 bg-[#FFF48D] border-2 border-[#1D1C1C] px-2.5 py-1.5 rounded-xl text-xs font-black text-[#1D1C1C] shadow-[2px_2px_0px_#1D1C1C] hover:-translate-y-0.5 transition-all uppercase"
                >
                  <IconShieldCheck className="w-4 h-4" /> Kelola Pengurus
                </Link>
              )}

              {/* Ultra-Compact Responsive Account Button */}
              <div className="relative">
                <button
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  className={`flex items-center gap-1.5 border-2 sm:border-3 border-[#1D1C1C] px-2 py-1 sm:px-3 sm:py-1.5 rounded-xl text-xs font-black shadow-[1.5px_1.5px_0px_#1D1C1C] sm:shadow-[2px_2px_0px_#1D1C1C] hover:bg-stone-50 active:translate-y-0.5 transition-all ${
                    isSuperadmin ? 'bg-[#FFF48D] text-[#1D1C1C]' : 'bg-white text-stone-900'
                  }`}
                  title="Buka Informasi Akun"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-[#1D1C1C] shrink-0"></span>
                  <IconUserCheck className="w-4 h-4 text-[#1D1C1C] shrink-0" />
                  
                  {/* Text Label: Compact "Akun" on Mobile, Full Username on Desktop */}
                  <span className="hidden sm:inline font-mono">
                    {session.email.split('@')[0]}
                  </span>
                  <span className="sm:hidden font-black text-[11px]">
                    Akun
                  </span>

                  {isSuperadmin && (
                    <span className="bg-[#1D1C1C] text-[#FFF48D] text-[8px] sm:text-[9px] font-black uppercase px-1 py-0.5 rounded shrink-0 flex items-center gap-0.5">
                      <IconShieldCheck className="w-3 h-3 text-[#FFF48D]" />
                    </span>
                  )}
                </button>

                {/* Account Popover Panel (Highest Z-Index Layer) */}
                {isAccountMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 max-w-[calc(100vw-24px)] bg-[#FAF7F2] border-3 border-[#1D1C1C] rounded-2xl p-4 shadow-[6px_6px_0px_#1D1C1C] z-[100] animate-fade-in">
                    <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-[#1D1C1C]">
                      <span className="font-black text-xs uppercase text-[#1D1C1C] flex items-center gap-1.5">
                        <IconUserCheck className="w-4 h-4 text-emerald-700" /> Panel Akun Saya
                      </span>
                      <button
                        onClick={() => setIsAccountMenuOpen(false)}
                        className="p-1 text-stone-600 hover:text-black rounded-lg border border-transparent hover:border-[#1D1C1C]"
                      >
                        <IconX className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mb-3 bg-white p-3 border-2 border-[#1D1C1C] rounded-xl text-xs font-bold space-y-1.5 shadow-[2px_2px_0px_#1D1C1C]">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] text-stone-500 font-extrabold uppercase">Email UNESA Terhubung</p>
                        {isSuperadmin && (
                          <span className="bg-[#FFF48D] border border-[#1D1C1C] text-[9px] font-black uppercase px-1.5 py-0.5 rounded flex items-center gap-1">
                            <IconShieldCheck className="w-3 h-3 text-[#1D1C1C]" /> SUPERADMIN
                          </span>
                        )}
                      </div>
                      <p className="font-mono text-[#1D1C1C] text-xs break-all">{session.email}</p>
                    </div>

                    {/* Quick Links for Superadmin */}
                    {isSuperadmin && (
                      <div className="mb-3.5 space-y-1.5">
                        <p className="text-[10px] text-stone-500 font-extrabold uppercase mb-1">Pintasan Navigasi</p>
                        <Link
                          href="/"
                          onClick={() => setIsAccountMenuOpen(false)}
                          className="w-full block text-center py-2 bg-white hover:bg-stone-100 font-black text-xs uppercase rounded-xl border-2 border-[#1D1C1C] shadow-[2px_2px_0px_#1D1C1C]"
                        >
                          📋 Form Pendaftaran Mahasiswa
                        </Link>
                        <Link
                          href="/pengurus"
                          onClick={() => setIsAccountMenuOpen(false)}
                          className="w-full block text-center py-2 bg-[#83F582] hover:bg-[#68e067] font-black text-xs uppercase rounded-xl border-2 border-[#1D1C1C] shadow-[2px_2px_0px_#1D1C1C]"
                        >
                          📊 Dashboard Pengurus UKM
                        </Link>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        setIsAccountMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full py-2.5 bg-[#D64545] hover:bg-red-600 text-white font-black text-xs uppercase rounded-xl border-2 border-[#1D1C1C] shadow-[3px_3px_0px_#1D1C1C] active:translate-y-0.5 active:shadow-[1px_1px_0px_#1D1C1C] transition-all flex items-center justify-center gap-2"
                    >
                      <IconLogOut className="w-4 h-4" /> Keluar Akun (Logout)
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
