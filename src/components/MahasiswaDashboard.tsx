'use client';

import React from 'react';
import { PendaftaranUKM } from '@/types';
import { LIST_UKM } from '@/data/mockData';
import { IconClock, IconCheck, IconX, IconAlert, IconBook } from './NeoIcons';

interface MahasiswaDashboardProps {
  registration: PendaftaranUKM | null;
  onCancelPendaftaran: () => void;
  onGoToRegistration: () => void;
}

export const MahasiswaDashboard: React.FC<MahasiswaDashboardProps> = ({
  registration,
  onCancelPendaftaran,
  onGoToRegistration,
}) => {
  if (!registration) {
    return (
      <div className="w-full max-w-3xl mx-auto text-center brutalist-card p-10 bg-white space-y-4">
        <div className="w-16 h-16 bg-[#FFF48D] border-3 border-[#1D1C1C] rounded-2xl flex items-center justify-center mx-auto shadow-[4px_4px_0px_#1D1C1C] text-3xl">
          📋
        </div>
        <h2 className="font-black text-2xl uppercase text-[#1D1C1C]">Belum Terdaftar Di UKM Manapun</h2>
        <p className="text-xs md:text-sm font-bold text-stone-600 max-w-md mx-auto">
          Anda belum memiliki pendaftaran aktif. Silakan pilih 1 UKM dari formulir pendaftaran untuk bergabung.
        </p>
        <button
          onClick={onGoToRegistration}
          className="mt-2 bg-[#83F582] hover:bg-[#68ef67] text-[#1D1C1C] font-black py-3.5 px-6 rounded-xl border-3 border-[#1D1C1C] shadow-[4px_4px_0px_#1D1C1C] hover:-translate-y-0.5 active:translate-x-0.5 active:shadow-none transition-all uppercase tracking-wider inline-flex items-center gap-2"
        >
          Isi Form Pendaftaran UKM Sekarang
        </button>
      </div>
    );
  }

  const ukmDetail = LIST_UKM.find((u) => u.id === registration.ukmId);

  const statusConfig = {
    PENDING: {
      bg: 'bg-[#FFF48D]',
      textColor: 'text-[#1D1C1C]',
      icon: IconClock,
      badge: '⏳ MENUNGGU VERIFIKASI',
      desc: 'Pendaftaran Anda sedang ditinjau oleh Pengurus/Pembina UKM. Harap periksa halaman ini secara berkala.',
    },
    ACCEPTED: {
      bg: 'bg-[#83F582]',
      textColor: 'text-[#1D1C1C]',
      icon: IconCheck,
      badge: '✅ DISETUJUI (RESMI ANGGOTA)',
      desc: 'Selamat! Pendaftaran Anda telah disetujui. Anda resmi menjadi anggota UKM ini.',
    },
    REJECTED: {
      bg: 'bg-[#D64545]',
      textColor: 'text-white',
      icon: IconX,
      badge: '❌ PENDAFTARAN DITOLAK',
      desc: 'Pendaftaran Anda ditolak. Anda kini diperbolehkan untuk memilih dan mendaftar di UKM lain.',
    },
    CANCELLED: {
      bg: 'bg-stone-200',
      textColor: 'text-stone-800',
      icon: IconAlert,
      badge: '🚫 DIBATALKAN',
      desc: 'Pendaftaran ini telah dibatalkan. Anda dapat mendaftar kembali.',
    },
  };

  const currentStatus = statusConfig[registration.status];
  const StatusIcon = currentStatus.icon;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Status Hero Card */}
      <div className={`brutalist-card p-6 md:p-8 ${currentStatus.bg} relative overflow-hidden`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-block bg-[#1D1C1C] text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider transform -rotate-1 border border-[#1D1C1C]">
              Status Pendaftaran Utama
            </div>

            <div className="flex items-center gap-3">
              <StatusIcon className={`w-8 h-8 ${currentStatus.textColor}`} />
              <h2 className={`font-black text-2xl md:text-3xl uppercase tracking-tight ${currentStatus.textColor}`}>
                {currentStatus.badge}
              </h2>
            </div>

            <p className={`text-xs md:text-sm font-bold ${currentStatus.textColor} opacity-90 max-w-xl`}>
              {currentStatus.desc}
            </p>

            {/* Rejection Note */}
            {registration.status === 'REJECTED' && registration.catatanPenolakan && (
              <div className="mt-3 bg-white/90 border-2 border-[#1D1C1C] p-3 rounded-xl shadow-[2px_2px_0px_#1D1C1C] text-xs font-extrabold text-[#1D1C1C]">
                📌 Alasan Penolakan: "{registration.catatanPenolakan}"
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 shrink-0">
            {registration.status === 'PENDING' && (
              <button
                onClick={onCancelPendaftaran}
                className="bg-[#D64545] text-white font-black text-xs py-3 px-4 rounded-xl border-2 border-[#1D1C1C] shadow-[3px_3px_0px_#1D1C1C] hover:bg-red-600 active:translate-x-0.5 active:shadow-none uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                <IconX className="w-4 h-4" /> Batalkan Pendaftaran
              </button>
            )}

            {(registration.status === 'REJECTED' || registration.status === 'CANCELLED') && (
              <button
                onClick={onGoToRegistration}
                className="bg-[#83F582] text-[#1D1C1C] font-black text-xs py-3 px-5 rounded-xl border-2 border-[#1D1C1C] shadow-[3px_3px_0px_#1D1C1C] hover:bg-emerald-400 active:translate-x-0.5 active:shadow-none uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                Daftar UKM Lain
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Detail Record Card */}
      <div className="brutalist-card p-6 md:p-8 bg-white space-y-6">
        <div className="flex items-center justify-between border-b-3 border-[#1D1C1C] pb-4">
          <h3 className="font-black text-xl uppercase tracking-tight text-[#1D1C1C] flex items-center gap-2">
            <IconBook className="w-5 h-5" /> Detail Pendaftaran
          </h3>
          <span className="text-xs font-black uppercase text-stone-500">ID: {registration.id}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mahasiswa Profile Info */}
          <div className="bg-stone-50 border-2 border-[#1D1C1C] p-4 rounded-xl shadow-[3px_3px_0px_#1D1C1C] space-y-2">
            <h4 className="font-black text-xs uppercase text-stone-500 border-b border-stone-300 pb-1">
              Data Mahasiswa
            </h4>
            <div className="text-sm font-bold text-[#1D1C1C]">
              <p className="text-base font-black">{registration.mahasiswa.nama}</p>
              <p className="text-xs font-mono text-stone-600">NIM: {registration.mahasiswa.nim}</p>
              <p className="text-xs text-stone-600 mt-1">{registration.mahasiswa.fakultas}</p>
              <p className="text-xs text-stone-600">{registration.mahasiswa.prodi}</p>
              <p className="text-xs text-emerald-700 mt-1 font-mono">WA: {registration.mahasiswa.noHp}</p>
            </div>
          </div>

          {/* Selected UKM Info */}
          <div className="bg-[#7AF7F7]/20 border-2 border-[#1D1C1C] p-4 rounded-xl shadow-[3px_3px_0px_#1D1C1C] space-y-2">
            <h4 className="font-black text-xs uppercase text-stone-500 border-b border-stone-300 pb-1 flex items-center justify-between">
              <span>UKM Yang Dipilih</span>
              <span className="text-2xl">{ukmDetail?.logo || '🏛️'}</span>
            </h4>
            <div className="text-sm font-bold text-[#1D1C1C]">
              <p className="text-base font-black">{registration.ukmNama}</p>
              <p className="text-xs text-stone-700 mt-1">{ukmDetail?.deskripsi}</p>
              <p className="text-xs text-stone-600 mt-2">Pembina: {ukmDetail?.pembina}</p>
              <p className="text-xs text-stone-500 mt-1">Tanggal Daftar: {registration.tanggalDaftar}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
