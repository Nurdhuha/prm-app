'use client';

import React, { useState } from 'react';
import { LIST_UKM, FAKULTAS_UNESA, PRODI_UNESA } from '@/data/mockData';
import { MahasiswaProfile, PendaftaranUKM } from '@/types';
import { useAutoSaveDraft } from '@/hooks/useAutoSaveDraft';
import { IconSearch, IconCheck, IconSend, IconAlert, IconInfo, IconX } from './NeoIcons';

interface RegistrationFormProps {
  userEmail: string;
  existingRegistration: PendaftaranUKM | null;
  onSubmitPendaftaran: (profile: MahasiswaProfile, ukmId: string) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  userEmail,
  existingRegistration,
  onSubmitPendaftaran,
}) => {
  // Auto Save Draft Hook
  const { value: draft, setDraftValue, clearDraft } = useAutoSaveDraft('prm_registration_draft', {
    nama: '',
    nim: '',
    fakultas: FAKULTAS_UNESA[0],
    prodi: PRODI_UNESA[FAKULTAS_UNESA[0]][0],
    noHp: '',
    ukmId: LIST_UKM[0].id,
  });

  // UKM Search & Category Filter State
  const [ukmSearch, setUkmSearch] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('ALL');
  const [showAllMobileUkms, setShowAllMobileUkms] = useState(false);

  // Dynamic Fakultas & Prodi State fetched live from PostgreSQL Database
  const [fakultasOptions, setFakultasOptions] = useState<string[]>(FAKULTAS_UNESA);
  const [prodiOptions, setProdiOptions] = useState<Record<string, string[]>>(PRODI_UNESA);

  // Dynamic UKM Catalog State fetched live from PostgreSQL Database
  const [ukmOptions, setUkmOptions] = useState<typeof LIST_UKM>(LIST_UKM);

  // Fetch live UKM catalog & Fakultas/Prodi from PostgreSQL Native Database (/api/ukm & /api/fakultas)
  React.useEffect(() => {
    fetch('/api/ukm')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setUkmOptions(data.data);
        }
      })
      .catch((err) => console.error('Fetch PostgreSQL UKM Error:', err));

    fetch('/api/fakultas')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.fakultas) && data.prodi) {
          setFakultasOptions(data.fakultas);
          setProdiOptions(data.prodi);
        }
      })
      .catch((err) => console.error('Fetch PostgreSQL Fakultas Error:', err));
  }, []);

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 5 Clear Standard Categories
  const categories = [
    'ALL',
    'Olahraga',
    'Seni & Budaya',
    'Penalaran & Keilmuan',
    'Kerohanian',
    'Kesejahteraan & Pengabdian',
  ];

  // Filtered UKM list for search & category
  const filteredUkms = ukmOptions.filter((ukm) => {
    const ukmKat = (ukm.kategori || '').toLowerCase();
    const selKat = selectedKategori.toLowerCase();

    let matchCategory = selectedKategori === 'ALL';
    if (!matchCategory) {
      if (selKat.includes('olahraga')) {
        matchCategory = ukmKat.includes('olahraga');
      } else if (selKat.includes('seni')) {
        matchCategory = ukmKat.includes('seni') || ukmKat.includes('budaya');
      } else if (selKat.includes('penalaran')) {
        matchCategory = ukmKat.includes('penalaran') || ukmKat.includes('ilmiah');
      } else if (selKat.includes('kerohanian')) {
        matchCategory = ukmKat.includes('kerohanian') || ukmKat.includes('agama');
      } else if (selKat.includes('kesejahteraan') || selKat.includes('pengabdian') || selKat.includes('kepemimpinan')) {
        matchCategory = ukmKat.includes('kesejahteraan') || ukmKat.includes('pengabdian') || ukmKat.includes('kepemimpinan');
      } else {
        matchCategory = ukmKat.includes(selKat);
      }
    }

    const q = ukmSearch.toLowerCase().trim();
    const matchSearch =
      !q ||
      ukm.nama.toLowerCase().includes(q) ||
      ukm.deskripsi.toLowerCase().includes(q) ||
      (ukm.kategori || '').toLowerCase().includes(q);

    return matchCategory && matchSearch;
  });

  // Reset showAllMobileUkms state when filter changes
  React.useEffect(() => {
    setShowAllMobileUkms(false);
  }, [selectedKategori, ukmSearch]);

  const selectedUkmObject = ukmOptions.find((u) => u.id === draft.ukmId);

  // Managed state for smooth Entrance and Exit animation of summary banner
  const [renderedUkm, setRenderedUkm] = useState<typeof selectedUkmObject | null>(selectedUkmObject || null);
  const [isExiting, setIsExiting] = useState(false);

  React.useEffect(() => {
    if (selectedUkmObject) {
      setRenderedUkm(selectedUkmObject);
      setIsExiting(false);
    } else if (renderedUkm) {
      setIsExiting(true);
      const timer = setTimeout(() => {
        setRenderedUkm(null);
        setIsExiting(false);
      }, 240);
      return () => clearTimeout(timer);
    }
  }, [selectedUkmObject]);

  // Handle Faculty Change
  const handleFakultasChange = (newFakultas: string) => {
    const prodiList = prodiOptions[newFakultas] || [];
    setDraftValue((prev) => ({
      ...prev,
      fakultas: newFakultas,
      prodi: prodiList[0] || '',
    }));
  };

  // Lock status if student already has PENDING or ACCEPTED status
  const isLocked = Boolean(
    existingRegistration &&
      (existingRegistration.status === 'PENDING' || existingRegistration.status === 'ACCEPTED')
  );

  // Toggle Selection
  const handleToggleSelectUkm = (targetUkmId: string) => {
    if (isLocked) return;
    setDraftValue((prev) => ({
      ...prev,
      ukmId: prev.ukmId === targetUkmId ? '' : targetUkmId,
    }));
  };

  const isValidWaNumber = (val: string) => {
    const clean = val.replace(/[^0-9]/g, '');
    return (clean.startsWith('08') || clean.startsWith('628')) && clean.length >= 10 && clean.length <= 14;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (isLocked) {
      setErrorMsg('Aturan Ketat 1 UKM: Anda sudah memiliki pendaftaran aktif (PENDING/ACCEPTED) di UKM lain.');
      return;
    }

    if (!draft.nama.trim()) {
      setErrorMsg('Nama lengkap mahasiswa wajib diisi.');
      return;
    }

    const cleanNim = draft.nim.trim();
    if (!cleanNim || cleanNim.length < 8) {
      setErrorMsg('NIM tidak valid. Masukkan minimal 8-12 digit NIM resmi.');
      return;
    }

    if (!isValidWaNumber(draft.noHp)) {
      setErrorMsg('Nomor WhatsApp tidak valid. Masukkan nomor WhatsApp aktif diawali 08 atau 628 (10-14 digit).');
      return;
    }

    if (!draft.ukmId) {
      setErrorMsg('Silakan pilih 1 UKM yang ingin Anda ikuti dari daftar di bawah.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      onSubmitPendaftaran(
        {
          nama: draft.nama.trim(),
          nim: cleanNim,
          fakultas: draft.fakultas,
          prodi: draft.prodi,
          noHp: draft.noHp.trim(),
          email: userEmail,
        },
        draft.ukmId
      );
      clearDraft();
    }, 600);
  };

  // Truncate list for mobile view if showAllMobileUkms is false
  const mobileSlicedUkms = showAllMobileUkms ? filteredUkms : filteredUkms.slice(0, 10);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-6">
      {/* Header Banner */}
      <div className="brutalist-card p-4 sm:p-6 bg-gradient-to-r from-[#83F582] via-[#FFF48D] to-[#FFB88C] relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#1D1C1C] text-[#FFF48D] px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-black uppercase border border-[#1D1C1C]">
                Langkah 2 dari 2
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase text-[#1D1C1C] tracking-tight leading-tight break-words">
              Formulir Pendaftaran UKM
            </h2>
            <p className="text-[11px] sm:text-xs md:text-sm font-bold text-stone-800 mt-1 leading-normal">
              Lengkapi biodata mahasiswa dan nomor WhatsApp aktif Anda untuk mengajukan pendaftaran UKM.
            </p>
          </div>

          <div className="hidden lg:flex flex-col items-end shrink-0">
            <span className="bg-[#7AF7F7] border-2 border-[#1D1C1C] px-3 py-1.5 rounded-xl font-black text-xs uppercase shadow-[2px_2px_0px_#1D1C1C]">
              1 Mahasiswa = 1 UKM
            </span>
          </div>
        </div>
      </div>

      {/* Disclaimer Notice Banner */}
      <div className="bg-[#FFF48D] border-3 sm:border-4 border-[#1D1C1C] p-4 sm:p-5 rounded-2xl shadow-[3px_3px_0px_#1D1C1C] sm:shadow-[5px_5px_0px_#1D1C1C] flex items-start gap-3">
        <IconInfo className="w-5 h-5 text-[#1D1C1C] shrink-0 mt-0.5" />
        <div>
          <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider text-[#1D1C1C]">
            Disclaimer Resmi Pendaftaran UKM
          </h3>
          <p className="text-xs font-bold text-stone-900 mt-1 leading-relaxed">
            Informasi terbaru mengenai seleksi & penerimaan anggota UKM berasal dari masing-masing UKM. Sistem ini berfungsi sebagai pendataan pendaftaran mahasiswa secara terpusat.
          </p>
        </div>
      </div>

      {/* Lock Notice if already registered */}
      {isLocked && (
        <div className="bg-[#FFF48D] border-3 sm:border-4 border-[#1D1C1C] p-4 sm:p-5 rounded-2xl shadow-[3px_3px_0px_#1D1C1C] sm:shadow-[5px_5px_0px_#1D1C1C] flex items-start gap-2.5">
          <IconInfo className="w-5 h-5 text-[#1D1C1C] shrink-0 mt-0.5" />
          <div>
            <h3 className="font-black text-base sm:text-lg uppercase text-[#1D1C1C]">Form Terkunci (Aturan 1 UKM)</h3>
            <p className="text-xs font-bold text-stone-800 mt-1">
              Anda saat ini terdaftar di <span className="font-black underline">{existingRegistration?.ukmNama}</span> dengan status{' '}
              <span className="bg-[#1D1C1C] text-[#FFF48D] px-2 py-0.5 rounded font-black uppercase text-[10px] sm:text-[11px]">
                {existingRegistration?.status}
              </span>
              . Sesuai aturan kampus, Anda hanya diperbolehkan mendaftar di 1 UKM.
            </p>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {errorMsg && (
        <div className="bg-[#D64545] text-white border-3 border-[#1D1C1C] p-3.5 rounded-xl shadow-[3px_3px_0px_#1D1C1C] text-xs font-extrabold flex items-center gap-2">
          <IconAlert className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} className="brutalist-card p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 w-full">
        {/* Section 1-5: Biodata Mahasiswa */}
        <div className="w-full">
          <h3 className="font-black text-sm sm:text-base uppercase text-[#1D1C1C] mb-3 sm:mb-4 pb-2 border-b-3 border-[#1D1C1C] flex items-center gap-2 break-words">
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#1D1C1C] rounded-full shrink-0"></span> Data Diri & Kontak Mahasiswa
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Field 1: Nama Lengkap */}
            <div>
              <label className="block text-[11px] sm:text-xs font-black uppercase text-[#1D1C1C] mb-1.5">
                1. Nama Lengkap Mahasiswa
              </label>
              <input
                type="text"
                disabled={isLocked}
                value={draft.nama}
                onChange={(e) => setDraftValue((prev) => ({ ...prev, nama: e.target.value }))}
                placeholder="Contoh: Nur Dhuha"
                className="w-full bg-stone-50 border-2 sm:border-3 border-[#1D1C1C] p-3 font-bold text-xs sm:text-sm text-[#1D1C1C] rounded-xl shadow-[2px_2px_0px_#1D1C1C] sm:shadow-[3px_3px_0px_#1D1C1C] focus:outline-none focus:bg-[#FFF48D]/20 disabled:opacity-60 transition-all"
                required
              />
            </div>

            {/* Field 2: NIM */}
            <div>
              <label className="block text-[11px] sm:text-xs font-black uppercase text-[#1D1C1C] mb-1.5">
                2. Nomor Induk Mahasiswa (NIM)
              </label>
              <input
                type="text"
                disabled={isLocked}
                value={draft.nim}
                onChange={(e) => setDraftValue((prev) => ({ ...prev, nim: e.target.value }))}
                placeholder="Contoh: 23051204100"
                className="w-full bg-stone-50 border-2 sm:border-3 border-[#1D1C1C] p-3 font-bold text-xs sm:text-sm text-[#1D1C1C] rounded-xl shadow-[2px_2px_0px_#1D1C1C] sm:shadow-[3px_3px_0px_#1D1C1C] focus:outline-none focus:bg-[#FFF48D]/20 disabled:opacity-60 transition-all"
                required
              />
            </div>

            {/* Field 3: Fakultas */}
            <div>
              <label className="block text-[11px] sm:text-xs font-black uppercase text-[#1D1C1C] mb-1.5">
                3. Fakultas
              </label>
              <select
                disabled={isLocked}
                value={draft.fakultas}
                onChange={(e) => handleFakultasChange(e.target.value)}
                className="w-full bg-stone-50 border-2 sm:border-3 border-[#1D1C1C] p-3 font-bold text-xs sm:text-sm text-[#1D1C1C] rounded-xl shadow-[2px_2px_0px_#1D1C1C] sm:shadow-[3px_3px_0px_#1D1C1C] focus:outline-none focus:bg-[#FFF48D]/20 disabled:opacity-60 cursor-pointer"
              >
                {fakultasOptions.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            {/* Field 4: Program Studi */}
            <div>
              <label className="block text-[11px] sm:text-xs font-black uppercase text-[#1D1C1C] mb-1.5">
                4. Program Studi (Prodi)
              </label>
              <select
                disabled={isLocked}
                value={draft.prodi}
                onChange={(e) => setDraftValue((prev) => ({ ...prev, prodi: e.target.value }))}
                className="w-full bg-stone-50 border-2 sm:border-3 border-[#1D1C1C] p-3 font-bold text-xs sm:text-sm text-[#1D1C1C] rounded-xl shadow-[2px_2px_0px_#1D1C1C] sm:shadow-[3px_3px_0px_#1D1C1C] focus:outline-none focus:bg-[#FFF48D]/20 disabled:opacity-60 cursor-pointer"
              >
                {(prodiOptions[draft.fakultas] || []).map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Field 5: Nomor WhatsApp Active Validation */}
            <div className="md:col-span-2">
              <label className="block text-[11px] sm:text-xs font-black uppercase text-[#1D1C1C] mb-1.5">
                5. Nomor WhatsApp Aktif (Untuk Koordinasi UKM)
              </label>
              <input
                type="text"
                disabled={isLocked}
                value={draft.noHp}
                onChange={(e) => setDraftValue((prev) => ({ ...prev, noHp: e.target.value }))}
                placeholder="Contoh: 081234567890 atau 6281234567890"
                className="w-full bg-stone-50 border-2 sm:border-3 border-[#1D1C1C] p-3 font-bold text-xs sm:text-sm text-[#1D1C1C] rounded-xl shadow-[2px_2px_0px_#1D1C1C] sm:shadow-[3px_3px_0px_#1D1C1C] focus:outline-none focus:bg-[#FFF48D]/20 disabled:opacity-60 transition-all"
                required
              />
              {draft.noHp && (
                <p className={`text-[10px] sm:text-[11px] font-bold mt-1 flex items-center gap-1 ${isValidWaNumber(draft.noHp) ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {isValidWaNumber(draft.noHp) ? (
                    <>
                      <IconCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      Nomor WhatsApp Valid (Format 08 / 628)
                    </>
                  ) : (
                    <>
                      <IconX className="w-3.5 h-3.5 text-amber-700 shrink-0 inline mr-1" />
                      Masukkan nomor WhatsApp aktif diawali 08 / 628 (Min 10 Digit)
                    </>
                  )}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 6: UKM Selection (SLIM & CLEAN CARDS DESIGN WITH MOBILE 10-CARD TRUNCATION) */}
        <div className="pt-1">
          {/* Header Toolbar */}
          <div className="bg-[#FAF7F2] border-2 sm:border-3 border-[#1D1C1C] p-3.5 sm:p-5 rounded-2xl shadow-[3px_3px_0px_#1D1C1C] sm:shadow-[4px_4px_0px_#1D1C1C] space-y-3 sm:space-y-4 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="font-black text-xs sm:text-base uppercase text-[#1D1C1C] flex items-center gap-2">
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#83F582] rounded-full border border-[#1D1C1C]"></span> 6. Pilih 1 UKM Yang Ingin Diikuti
              </h3>
              <span className="text-[10px] sm:text-xs font-bold text-stone-600 bg-white px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg border border-[#1D1C1C] shrink-0">
                Menampilkan <strong className="text-[#1D1C1C]">{filteredUkms.length}</strong> dari {ukmOptions.length} UKM
              </span>
            </div>

            {/* Search Input Bar */}
            <div className="relative">
              <input
                type="text"
                disabled={isLocked}
                value={ukmSearch}
                onChange={(e) => setUkmSearch(e.target.value)}
                placeholder="Cari nama UKM atau kata kunci..."
                className="w-full bg-white border-2 sm:border-3 border-[#1D1C1C] pl-9 pr-3 py-2 sm:py-2.5 font-bold text-xs sm:text-sm text-[#1D1C1C] rounded-xl shadow-[2px_2px_0px_#1D1C1C] focus:outline-none focus:ring-2 focus:ring-[#83F582]"
              />
              <IconSearch className="w-4 h-4 text-stone-600 absolute left-3 top-2.5 sm:top-3.5" />
            </div>

            {/* Consolidate 5 Categories Pills */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
              {categories.map((kat) => (
                <button
                  key={kat}
                  type="button"
                  disabled={isLocked}
                  onClick={() => setSelectedKategori(kat)}
                  className={`px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-lg border border-stone-800 sm:border-2 sm:border-[#1D1C1C] font-black text-[10px] sm:text-xs uppercase transition-all shadow-[1.5px_1.5px_0px_#1D1C1C] sm:shadow-[2px_2px_0px_#1D1C1C] ${
                    selectedKategori === kat
                      ? 'bg-[#1D1C1C] text-[#FFF48D] -translate-y-0.5'
                      : 'bg-white text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {kat === 'ALL' ? 'Semua Kategori' : kat}
                </button>
              ))}
            </div>
          </div>

          {/* Selected UKM Summary Banner */}
          {renderedUkm && (
            <div
              className={`mb-4 sm:mb-6 p-3.5 sm:p-4 bg-[#83F582] border-2 sm:border-3 border-[#1D1C1C] rounded-2xl shadow-[3px_3px_0px_#1D1C1C] sm:shadow-[4px_4px_0px_#1D1C1C] flex items-center justify-between gap-2.5 ${
                isExiting ? 'animate-slide-up-fade-out' : 'animate-slide-down-fade'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="bg-[#1D1C1C] text-[#83F582] text-[9px] sm:text-[10px] font-black uppercase px-1.5 py-0.5 rounded">
                      Pilihan Saat Ini
                    </span>
                  </div>
                  <h4 className="font-black text-sm sm:text-base uppercase text-[#1D1C1C] leading-tight">
                    {renderedUkm.nama}
                  </h4>
                </div>
              </div>

              {!isLocked && (
                <button
                  type="button"
                  onClick={() => handleToggleSelectUkm(renderedUkm.id)}
                  className="px-2.5 py-1 sm:px-3.5 sm:py-1.5 bg-white hover:bg-red-100 text-red-700 font-black text-[11px] sm:text-xs border border-stone-900 sm:border-2 border-[#1D1C1C] rounded-lg shadow-[1.5px_1.5px_0px_#1D1C1C] shrink-0"
                >
                  Batal Pilih
                </button>
              )}
            </div>
          )}

          {/* SLIM & CLEAN UKM CARDS GRID (10-Card Truncation on Mobile) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5">
            {/* Desktop shows all cards, Mobile shows mobileSlicedUkms */}
            {(showAllMobileUkms ? filteredUkms : filteredUkms).map((ukm, idx) => {
              const isSelected = draft.ukmId === ukm.id;
              const isHiddenOnMobile = !showAllMobileUkms && idx >= 10;

              return (
                <div
                  key={ukm.id}
                  onClick={() => handleToggleSelectUkm(ukm.id)}
                  className={`p-3.5 sm:p-4 rounded-xl border-2 sm:border-3 border-[#1D1C1C] transition-all relative flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-[#83F582] shadow-[3px_3px_0px_#1D1C1C] sm:shadow-[4px_4px_0px_#1D1C1C] -translate-y-0.5 ring-2 ring-[#1D1C1C]'
                      : 'bg-white shadow-[2px_2px_0px_#1D1C1C] sm:shadow-[2.5px_2.5px_0px_#1D1C1C] hover:-translate-y-0.5'
                  } ${isLocked ? 'opacity-60 cursor-not-allowed' : ''} ${
                    isHiddenOnMobile ? 'hidden md:flex' : 'flex'
                  }`}
                >
                  <div>
                    {/* Header Badge Row */}
                    <div className="flex items-center justify-between gap-2 mb-1.5 sm:mb-2">
                      <span className="bg-[#FFF48D] border border-[#1D1C1C] px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-black uppercase text-[#1D1C1C]">
                        {ukm.kategori}
                      </span>

                      {isSelected && (
                        <span className="bg-[#1D1C1C] text-[#83F582] px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-black uppercase flex items-center gap-1">
                          <IconCheck className="w-3 h-3 text-[#83F582]" /> Terpilih
                        </span>
                      )}
                    </div>

                    <h4 className="font-black text-xs sm:text-sm uppercase text-[#1D1C1C] mb-1 leading-snug">
                      {ukm.nama}
                    </h4>

                    <p className="text-[11px] sm:text-xs font-medium text-stone-700 line-clamp-2">
                      {ukm.deskripsi}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Neo-Brutalist Thick SVG Chevron Toggle Button */}
          {filteredUkms.length > 10 && (
            <div className="mt-5 text-center md:hidden flex justify-center">
              <button
                type="button"
                onClick={() => setShowAllMobileUkms(!showAllMobileUkms)}
                className="w-14 h-12 bg-[#FFF48D] hover:bg-[#ffe945] active:bg-[#83F582] rounded-2xl border-3 border-[#1D1C1C] shadow-[4px_4px_0px_#1D1C1C] active:translate-y-0.5 active:shadow-[1.5px_1.5px_0px_#1D1C1C] transition-all flex items-center justify-center cursor-pointer"
                title={showAllMobileUkms ? "Sembunyikan Sebagian UKM" : "Tampilkan Semua UKM"}
              >
                <svg
                  className={`w-6 h-6 text-[#1D1C1C] transition-transform duration-300 ${
                    showAllMobileUkms ? 'rotate-180' : 'rotate-0'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-3 sm:pt-4 border-t-2 sm:border-t-3 border-[#1D1C1C] flex justify-end">
          <button
            type="submit"
            disabled={isLocked || isSubmitting || !draft.ukmId}
            className="w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 bg-[#83F582] hover:bg-[#6be66a] disabled:bg-stone-300 disabled:text-stone-500 font-black text-xs sm:text-sm uppercase text-[#1D1C1C] border-2 sm:border-3 border-[#1D1C1C] rounded-xl shadow-[3px_3px_0px_#1D1C1C] sm:shadow-[4px_4px_0px_#1D1C1C] active:translate-y-0.5 active:shadow-[1px_1px_0px_#1D1C1C] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            <IconSend className="w-4 h-4 sm:w-5 sm:h-5" />
            {isSubmitting ? 'Mengirim Pendaftaran...' : 'Kirim Pendaftaran UKM'}
          </button>
        </div>
      </form>
    </div>
  );
};
