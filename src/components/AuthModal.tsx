'use client';

import React, { useState } from 'react';
import { GeminiIconLogo, IconKey, IconSparkles, IconCheck, IconX, IconInfo } from './NeoIcons';

interface AuthModalProps {
  isOpen: boolean;
  onSuccessLogin: (email: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onSuccessLogin }) => {
  const [activeTab, setActiveTab] = useState<'LOGIN' | 'REGISTER' | 'FORGOT'>('REGISTER');

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Forgot Password State
  const [forgotSent, setForgotSent] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // Generic Email Format Check
  const isValidEmailFormat = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  const hasMinLength = (pass: string) => pass.length >= 8;
  const hasNumber = (pass: string) => /[0-9]/.test(pass);
  const hasSymbol = (pass: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pass);
  const isStrictPasswordValid = (pass: string) =>
    hasMinLength(pass) && hasNumber(pass) && hasSymbol(pass);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!isValidEmailFormat(email)) {
      setErrorMsg('Masukkan Email UNESA Anda dengan format yang benar.');
      return;
    }

    if (!isStrictPasswordValid(password)) {
      setErrorMsg('Password akun PRM belum memenuhi syarat (Min 8 Karakter, Angka & Simbol).');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Konfirmasi password akun PRM tidak cocok.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onSuccessLogin(email.trim().toLowerCase());
    }, 600);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!isValidEmailFormat(email)) {
      setErrorMsg('Masukkan Email UNESA Anda dengan format yang benar.');
      return;
    }

    if (!password) {
      setErrorMsg('Password akun PRM Anda tidak boleh kosong.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onSuccessLogin(email.trim().toLowerCase());
    }, 600);
  };

  const handleSendResetEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!isValidEmailFormat(email)) {
      setErrorMsg('Masukkan Email UNESA Anda dengan format yang benar.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setForgotSent(true);
      setSuccessMsg(`Kode reset 6-digit telah dikirim ke ${email}. Silakan cek inbox email Anda.`);
    }, 600);
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!resetCode || resetCode.length < 6) {
      setErrorMsg('Masukkan kode verifikasi 6-digit yang dikirim ke email Anda.');
      return;
    }

    if (!isStrictPasswordValid(newPassword)) {
      setErrorMsg('Password baru wajib mengandung minimal 8 Karakter, Angka & Simbol.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('Password akun PRM berhasil diperbarui! Silakan login.');
      setActiveTab('LOGIN');
      setPassword('');
      setForgotSent(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-[#FAF7F2] border-3 sm:border-4 border-[#1D1C1C] rounded-2xl max-w-md w-full p-4 sm:p-6 shadow-[4px_4px_0px_#1D1C1C] sm:shadow-[8px_8px_0px_#1D1C1C] relative my-auto max-h-[92vh] overflow-y-auto">
        {/* Header Icon Logo */}
        <div className="flex justify-center pt-1 mb-3">
          <div className="p-2 bg-white rounded-2xl border-3 border-[#1D1C1C] shadow-[3px_3px_0px_#1D1C1C]">
            <GeminiIconLogo className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>
        </div>

        <div className="text-center mb-3">
          <h2 className="font-black text-lg sm:text-xl uppercase tracking-tight text-[#1D1C1C]">
            PEKAN RAYA MAHASISWA
          </h2>
        </div>

        {/* Informational Banner Explaining PRM Account Concept */}
        <div className="mb-4 p-3 bg-[#FFF48D] border-2 border-[#1D1C1C] rounded-xl text-xs font-bold text-[#1D1C1C] flex items-start gap-2 shadow-[2px_2px_0px_#1D1C1C]">
          <IconInfo className="w-4 h-4 text-[#1D1C1C] shrink-0 mt-0.5" />
          <div>
            <p className="font-black uppercase text-[11px]">Akun Khusus Pendaftaran PRM 2026</p>
            <p className="text-[11px] text-stone-800 mt-0.5 leading-snug">
              {activeTab === 'REGISTER'
                ? 'Buat akun & password khusus untuk pendaftaran PRM 2026. (Terpisah dari akun SSO).'
                : 'Masuk dengan email UNESA dan password akun PRM 2026 yang telah Anda daftarkan.'}
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Buat Akun PRM vs Masuk Akun PRM) */}
        {activeTab !== 'FORGOT' && (
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#EFECE6] border-2 sm:border-3 border-[#1D1C1C] rounded-xl mb-4 sm:mb-5">
            <button
              type="button"
              onClick={() => {
                setActiveTab('REGISTER');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`py-2 rounded-lg font-black text-[11px] sm:text-xs uppercase transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'REGISTER'
                  ? 'bg-[#83F582] text-[#1D1C1C] border-2 border-[#1D1C1C] shadow-[2px_2px_0px_#1D1C1C]'
                  : 'text-stone-600 hover:text-[#1D1C1C]'
              }`}
            >
              <IconSparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Buat Akun PRM
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('LOGIN');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`py-2 rounded-lg font-black text-[11px] sm:text-xs uppercase transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'LOGIN'
                  ? 'bg-[#FFF48D] text-[#1D1C1C] border-2 border-[#1D1C1C] shadow-[2px_2px_0px_#1D1C1C]'
                  : 'text-stone-600 hover:text-[#1D1C1C]'
              }`}
            >
              <IconKey className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Masuk Akun PRM
            </button>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-3.5 p-2.5 sm:p-3 bg-[#FFD1D1] border-2 border-[#1D1C1C] rounded-xl text-xs font-bold text-red-900 flex items-center gap-2 shadow-[2px_2px_0px_#1D1C1C]">
            <IconX className="w-4 h-4 text-red-700 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-3.5 p-2.5 sm:p-3 bg-[#83F582] border-2 border-[#1D1C1C] rounded-xl text-xs font-bold text-[#1D1C1C] flex items-start gap-2 shadow-[2px_2px_0px_#1D1C1C]">
            <IconCheck className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Container */}
        {activeTab === 'LOGIN' && (
          <form onSubmit={handleLoginSubmit} className="space-y-3.5 sm:space-y-4">
            <div>
              <label className="block text-xs font-black uppercase text-[#1D1C1C] mb-1">
                Email UNESA Mahasiswa
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan Email UNESA Anda"
                className="w-full px-3 py-2.5 bg-white border-2 sm:border-3 border-[#1D1C1C] rounded-xl text-xs sm:text-sm font-bold text-[#1D1C1C] focus:outline-none focus:ring-2 focus:ring-[#FFF48D] shadow-[2px_2px_0px_#1D1C1C]"
              />
              {email && (
                <p className={`text-[10px] sm:text-[11px] font-bold mt-1 flex items-center gap-1 ${isValidEmailFormat(email) ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {isValidEmailFormat(email) ? (
                    <>
                      <IconCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      Format Email UNESA Valid
                    </>
                  ) : (
                    '⚠️ Format Email UNESA tidak valid'
                  )}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-black uppercase text-[#1D1C1C]">
                  Password Akun PRM
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('FORGOT');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="text-[11px] sm:text-xs font-bold text-stone-700 hover:text-[#1D1C1C] underline"
                >
                  Lupa Password?
                </button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password akun PRM Anda"
                className="w-full px-3 py-2.5 bg-white border-2 sm:border-3 border-[#1D1C1C] rounded-xl text-xs sm:text-sm font-bold text-[#1D1C1C] focus:outline-none focus:ring-2 focus:ring-[#FFF48D] shadow-[2px_2px_0px_#1D1C1C]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#FFF48D] hover:bg-[#ffe945] text-[#1D1C1C] font-black text-xs uppercase rounded-xl border-2 sm:border-3 border-[#1D1C1C] shadow-[3px_3px_0px_#1D1C1C] sm:shadow-[4px_4px_0px_#1D1C1C] active:translate-y-0.5 active:shadow-[1px_1px_0px_#1D1C1C] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? 'Memproses Login...' : 'Masuk Ke Sistem PRM'}
            </button>
          </form>
        )}

        {activeTab === 'REGISTER' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3 sm:space-y-3.5">
            <div>
              <label className="block text-xs font-black uppercase text-[#1D1C1C] mb-1">
                Email UNESA Mahasiswa
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan Email UNESA Anda"
                className="w-full px-3 py-2 bg-white border-2 sm:border-3 border-[#1D1C1C] rounded-xl text-xs sm:text-sm font-bold text-[#1D1C1C] focus:outline-none focus:ring-2 focus:ring-[#83F582] shadow-[2px_2px_0px_#1D1C1C]"
              />
              {email && (
                <p className={`text-[10px] sm:text-[11px] font-bold mt-1 flex items-center gap-1 ${isValidEmailFormat(email) ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {isValidEmailFormat(email) ? (
                    <>
                      <IconCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      Format Email UNESA Valid
                    </>
                  ) : (
                    '⚠️ Format Email UNESA tidak valid'
                  )}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-[#1D1C1C] mb-1">
                Buat Password Akun PRM
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 8 Karakter, Angka & Simbol"
                className="w-full px-3 py-2 bg-white border-2 sm:border-3 border-[#1D1C1C] rounded-xl text-xs sm:text-sm font-bold text-[#1D1C1C] focus:outline-none focus:ring-2 focus:ring-[#83F582] shadow-[2px_2px_0px_#1D1C1C]"
              />
              {/* Password Indicator Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 mt-1.5 text-[10px] font-bold">
                <span className={`px-1.5 py-0.5 rounded border text-center ${hasMinLength(password) ? 'bg-emerald-100 text-emerald-800 border-emerald-400' : 'bg-stone-100 text-stone-500 border-stone-300'}`}>
                  {hasMinLength(password) ? '✓' : '○'} Min 8 Karakter
                </span>
                <span className={`px-1.5 py-0.5 rounded border text-center ${hasNumber(password) ? 'bg-emerald-100 text-emerald-800 border-emerald-400' : 'bg-stone-100 text-stone-500 border-stone-300'}`}>
                  {hasNumber(password) ? '✓' : '○'} Mengandung Angka
                </span>
                <span className={`px-1.5 py-0.5 rounded border text-center ${hasSymbol(password) ? 'bg-emerald-100 text-emerald-800 border-emerald-400' : 'bg-stone-100 text-stone-500 border-stone-300'}`}>
                  {hasSymbol(password) ? '✓' : '○'} Mengandung Simbol
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-[#1D1C1C] mb-1">
                Konfirmasi Password Akun PRM
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi password akun PRM Anda"
                className="w-full px-3 py-2 bg-white border-2 sm:border-3 border-[#1D1C1C] rounded-xl text-xs sm:text-sm font-bold text-[#1D1C1C] focus:outline-none focus:ring-2 focus:ring-[#83F582] shadow-[2px_2px_0px_#1D1C1C]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#83F582] hover:bg-[#68e067] text-[#1D1C1C] font-black text-xs uppercase rounded-xl border-2 sm:border-3 border-[#1D1C1C] shadow-[3px_3px_0px_#1D1C1C] sm:shadow-[4px_4px_0px_#1D1C1C] active:translate-y-0.5 active:shadow-[1px_1px_0px_#1D1C1C] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? 'Mendaftarkan Akun PRM...' : 'Daftar Akun PRM & Lanjut'}
            </button>
          </form>
        )}

        {/* Forgot Password View */}
        {activeTab === 'FORGOT' && (
          <div className="space-y-3.5 sm:space-y-4">
            <div className="p-2.5 sm:p-3 bg-[#7AF7F7] border-2 border-[#1D1C1C] rounded-xl text-xs font-bold text-[#1D1C1C] flex items-center justify-between">
              <span>🔐 Reset Password Akun PRM</span>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('LOGIN');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="text-xs font-black underline text-stone-800 hover:text-black"
              >
                Kembali
              </button>
            </div>

            {!forgotSent ? (
              <form onSubmit={handleSendResetEmail} className="space-y-3">
                <div>
                  <label className="block text-xs font-black uppercase text-[#1D1C1C] mb-1">
                    Email UNESA Anda
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Masukkan Email UNESA Anda"
                    className="w-full px-3 py-2.5 bg-white border-2 sm:border-3 border-[#1D1C1C] rounded-xl text-xs sm:text-sm font-bold text-[#1D1C1C] focus:outline-none focus:ring-2 focus:ring-[#7AF7F7] shadow-[2px_2px_0px_#1D1C1C]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-[#7AF7F7] hover:bg-[#5eebeb] text-[#1D1C1C] font-black text-xs uppercase rounded-xl border-2 sm:border-3 border-[#1D1C1C] shadow-[3px_3px_0px_#1D1C1C] sm:shadow-[4px_4px_0px_#1D1C1C] active:translate-y-0.5 active:shadow-[1px_1px_0px_#1D1C1C] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? 'Mengirim Kode...' : 'Kirim Kode Reset Ke Email'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-black uppercase text-[#1D1C1C] mb-1">
                    Kode Verifikasi 6-Digit
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    placeholder="Contoh: 849201"
                    className="w-full px-3 py-2 bg-white border-2 sm:border-3 border-[#1D1C1C] rounded-xl text-xs sm:text-sm font-bold font-mono tracking-widest text-[#1D1C1C] text-center focus:outline-none shadow-[2px_2px_0px_#1D1C1C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-[#1D1C1C] mb-1">
                    Password Akun PRM Baru
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 8 Karakter, Angka & Simbol"
                    className="w-full px-3 py-2 bg-white border-2 sm:border-3 border-[#1D1C1C] rounded-xl text-xs sm:text-sm font-bold text-[#1D1C1C] focus:outline-none shadow-[2px_2px_0px_#1D1C1C]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-[#83F582] hover:bg-[#68e067] text-[#1D1C1C] font-black text-xs uppercase rounded-xl border-2 sm:border-3 border-[#1D1C1C] shadow-[3px_3px_0px_#1D1C1C] sm:shadow-[4px_4px_0px_#1D1C1C] active:translate-y-0.5 active:shadow-[1px_1px_0px_#1D1C1C] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? 'Memperbarui...' : 'Simpan Password Baru'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
