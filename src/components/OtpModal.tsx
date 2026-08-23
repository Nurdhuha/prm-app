'use client';

import React, { useState, useEffect } from 'react';
import { IconPhone, IconKey, IconAlert, IconCheck, IconSend } from './NeoIcons';

interface OtpModalProps {
  isOpen: boolean;
  onSuccessLogin: (noHp: string) => void;
}

export const OtpModal: React.FC<OtpModalProps> = ({ isOpen, onSuccessLogin }) => {
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [noHp, setNoHp] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Cooldown countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  if (!isOpen) return null;

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanNo = noHp.trim();
    if (!cleanNo || cleanNo.length < 10 || !cleanNo.startsWith('08')) {
      setErrorMsg('Nomor HP tidak valid. Masukkan nomor WhatsApp Indonesia (Contoh: 081234567890)');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const code = '123456';
      setGeneratedOtp(code);
      setStep('OTP');
      setCooldown(60);
      setIsLoading(false);
    }, 800);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (otpInput.trim() !== generatedOtp) {
      setErrorMsg('Kode OTP salah. Silakan periksa kembali pesan WhatsApp Anda (Default OTP Testing: 123456)');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccessLogin(noHp.trim());
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white border-4 border-[#1D1C1C] rounded-2xl shadow-[8px_8px_0px_#1D1C1C] p-6 relative overflow-hidden">
        {/* Decorative Top Accent */}
        <div className="h-3 bg-[linear-gradient(90deg,#83F582_0%,#FFF48D_50%,#FFB88C_100%)] border-b-3 border-[#1D1C1C] -mx-6 -mt-6 mb-6"></div>

        {/* Title */}
        <div className="text-center mb-6">
          <span className="inline-block bg-[#FFF48D] border-2 border-[#1D1C1C] text-[#1D1C1C] font-black text-xs uppercase px-3 py-1 rounded-full shadow-[2px_2px_0px_#1D1C1C] transform -rotate-2 mb-2">
            🔐 Otentikasi Aman Non-SSO
          </span>
          <h2 className="font-black text-2xl uppercase tracking-tight text-[#1D1C1C]">
            {step === 'PHONE' ? 'Login via WhatsApp OTP' : 'Masukkan Kode OTP'}
          </h2>
          <p className="text-xs font-bold text-stone-600 mt-1">
            {step === 'PHONE'
              ? 'Masukkan nomor WhatsApp Anda untuk menerima 6-digit kode OTP.'
              : `Kode OTP 6-digit telah dikirim via WhatsApp ke nomor ${noHp}`}
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 bg-[#D64545] text-white border-2 border-[#1D1C1C] p-3 rounded-xl shadow-[3px_3px_0px_#1D1C1C] text-xs font-extrabold flex items-start gap-2">
            <IconAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Step 1: Input Phone Form */}
        {step === 'PHONE' && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase text-[#1D1C1C] mb-1.5 flex items-center gap-1.5">
                <IconPhone className="w-4 h-4" /> Nomor WhatsApp Mahasiswa
              </label>
              <input
                type="tel"
                value={noHp}
                onChange={(e) => setNoHp(e.target.value)}
                placeholder="Contoh: 081234567890"
                className="w-full bg-stone-50 border-3 border-[#1D1C1C] p-3.5 font-bold text-lg text-[#1D1C1C] rounded-xl shadow-[3px_3px_0px_#1D1C1C] focus:outline-none focus:bg-[#FFF48D]/30 transition-all"
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#83F582] hover:bg-[#68ef67] text-[#1D1C1C] font-black py-3.5 px-6 rounded-xl border-3 border-[#1D1C1C] shadow-[4px_4px_0px_#1D1C1C] hover:-translate-y-0.5 active:translate-x-0.5 active:shadow-none transition-all uppercase tracking-wider flex items-center justify-center gap-2"
            >
              {isLoading ? 'Mengirim OTP...' : 'Kirim Kode OTP'}
              <IconSend className="w-5 h-5" />
            </button>
          </form>
        )}

        {/* Step 2: Input OTP Form */}
        {step === 'OTP' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            {/* Simulated WhatsApp Notification Box */}
            <div className="bg-[#83F582]/20 border-2 border-[#1D1C1C] p-3 rounded-xl shadow-[2px_2px_0px_#1D1C1C] text-xs text-[#1D1C1C] font-bold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconCheck className="w-4 h-4 text-emerald-700" />
                <span>Simulasi OTP WhatsApp:</span>
              </div>
              <span className="bg-[#FFF48D] border border-[#1D1C1C] font-black px-2 py-0.5 rounded text-sm tracking-widest">
                {generatedOtp}
              </span>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-[#1D1C1C] mb-1.5 flex items-center gap-1.5">
                <IconKey className="w-4 h-4" /> Kode OTP (6 Digit)
              </label>
              <input
                type="text"
                maxLength={6}
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                placeholder="123456"
                className="w-full bg-stone-50 border-3 border-[#1D1C1C] p-3.5 font-black text-2xl tracking-widest text-center text-[#1D1C1C] rounded-xl shadow-[3px_3px_0px_#1D1C1C] focus:outline-none focus:bg-[#FFF48D]/30 transition-all"
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#FFF48D] hover:bg-[#ffe63d] text-[#1D1C1C] font-black py-3.5 px-6 rounded-xl border-3 border-[#1D1C1C] shadow-[4px_4px_0px_#1D1C1C] hover:-translate-y-0.5 active:translate-x-0.5 active:shadow-none transition-all uppercase tracking-wider"
            >
              {isLoading ? 'Memverifikasi...' : 'Verifikasi & Masuk'}
            </button>

            {/* Resend Cooldown */}
            <div className="flex items-center justify-between pt-2 text-xs font-extrabold text-stone-600">
              <button
                type="button"
                onClick={() => setStep('PHONE')}
                className="hover:underline text-stone-800"
              >
                ← Ganti Nomor HP
              </button>
              {cooldown > 0 ? (
                <span className="text-stone-500">Kirim ulang dalam {cooldown}s</span>
              ) : (
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  className="text-emerald-700 hover:underline flex items-center gap-1 font-black"
                >
                  Kirim Ulang OTP
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
