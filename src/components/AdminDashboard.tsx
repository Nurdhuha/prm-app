'use client';

import React, { useState, useEffect } from 'react';
import { PendaftaranUKM, UserSession } from '@/types';
import { LIST_UKM } from '@/data/mockData';
import { IconSearch, IconExcel, IconCheck, IconX, IconAlert, IconShieldCheck, IconKey, IconEye, IconEyeOff, IconPlus, IconEdit, IconTrash, IconGrid, IconChartLine, IconLock } from './NeoIcons';
import * as XLSX from 'xlsx';

interface OfficerAccount {
  id: string;
  ukmId: string;
  ukmNama: string;
  kategori: string;
  email: string;
  hasCustomPassword?: boolean;
}

interface AdminDashboardProps {
  session?: UserSession;
  pendaftaranList: PendaftaranUKM[];
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  onRefreshData?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  session,
  pendaftaranList,
  onApprove,
  onReject,
  onRefreshData,
}) => {
  const isPengurus = session?.role === 'pengurus' && session.managedUkmId;
  const isSuperadmin = session?.role === 'superadmin' || session?.email?.toLowerCase().includes('nurdhuha.23100');

  const [activeSubTab, setActiveSubTab] = useState<'MONITORING' | 'OFFICERS' | 'UKM_MASTER'>('MONITORING');

  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterUkm, setFilterUkm] = useState<string>(isPengurus && session?.managedUkmId ? session.managedUkmId : 'ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Superadmin Officer Management State
  const [officersList, setOfficersList] = useState<OfficerAccount[]>([]);
  const [isLoadingOfficers, setIsLoadingOfficers] = useState(false);
  const [officerSearch, setOfficerSearch] = useState('');
  const [editingOfficer, setEditingOfficer] = useState<OfficerAccount | null>(null);
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [isSavingOfficer, setIsSavingOfficer] = useState(false);
  const [officerSuccessMsg, setOfficerSuccessMsg] = useState('');

  // Superadmin Master UKM Management State
  const [ukmMasterList, setUkmMasterList] = useState<any[]>([]);
  const [isLoadingUkms, setIsLoadingUkms] = useState(false);
  const [ukmSearch, setUkmSearch] = useState('');
  const [editingUkm, setEditingUkm] = useState<any | null>(null);
  const [isNewUkm, setIsNewUkm] = useState(false);
  const [ukmForm, setUkmForm] = useState({
    id: '',
    nama: '',
    kategori: 'Olahraga',
    deskripsi: '',
    pembina: 'UNESA',
    status: 'open',
  });
  const [isSavingUkm, setIsSavingUkm] = useState(false);
  const [ukmSuccessMsg, setUkmSuccessMsg] = useState('');

  // Fetch UKMs list from PostgreSQL Backend
  const fetchUkmMasterList = async () => {
    if (!isSuperadmin) return;
    try {
      setIsLoadingUkms(true);
      const res = await fetch('/api/ukm');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setUkmMasterList(data.data);
      }
    } catch (e) {
      console.error('Fetch UKM Master Error:', e);
    } finally {
      setIsLoadingUkms(false);
    }
  };

  // Lock filter to managed UKM if user is UKM officer
  useEffect(() => {
    if (isPengurus && session?.managedUkmId) {
      setFilterUkm(session.managedUkmId);
    }
  }, [isPengurus, session?.managedUkmId]);

  // Fetch Officers List for Superadmin
  const fetchOfficersList = async () => {
    if (!isSuperadmin) return;
    try {
      setIsLoadingOfficers(true);
      const res = await fetch('/api/pengurus');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setOfficersList(data.data);
      }
    } catch (e) {
      console.error('Fetch Officers Error:', e);
    } finally {
      setIsLoadingOfficers(false);
    }
  };

  useEffect(() => {
    if (isSuperadmin) {
      fetchOfficersList();
      fetchUkmMasterList();
    }
  }, [isSuperadmin]);

  // UKM Master CRUD Handlers
  const handleOpenNewUkmModal = () => {
    setIsNewUkm(true);
    setUkmForm({
      id: `ukm-${(ukmMasterList.length > 0 ? ukmMasterList.length : LIST_UKM.length) + 1}`,
      nama: '',
      kategori: 'Olahraga',
      deskripsi: '',
      pembina: 'UNESA',
      status: 'open',
    });
    setEditingUkm({});
    setUkmSuccessMsg('');
  };

  const handleOpenEditUkmModal = (ukm: any) => {
    setIsNewUkm(false);
    setEditingUkm(ukm);
    setUkmForm({
      id: ukm.id,
      nama: ukm.nama,
      kategori: ukm.kategori,
      deskripsi: ukm.deskripsi,
      pembina: ukm.pembina || 'UNESA',
      status: ukm.status || 'open',
    });
    setUkmSuccessMsg('');
  };

  const handleSaveUkm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ukmForm.nama.trim() || !ukmForm.kategori) {
      alert('Nama dan Kategori UKM wajib diisi.');
      return;
    }

    try {
      setIsSavingUkm(true);
      const method = isNewUkm ? 'POST' : 'PUT';
      const res = await fetch('/api/ukm', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ukmForm),
      });

      const json = await res.json();
      if (!json.success) {
        alert(`Gagal menyimpan UKM: ${json.error}`);
        return;
      }

      setUkmSuccessMsg(`UKM "${ukmForm.nama}" berhasil disimpan!`);
      await fetchUkmMasterList();
      await fetchOfficersList();
      if (onRefreshData) onRefreshData();

      setTimeout(() => {
        setEditingUkm(null);
        setUkmSuccessMsg('');
      }, 1000);
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menyimpan data UKM.');
    } finally {
      setIsSavingUkm(false);
    }
  };

  const handleDeleteUkm = async (ukmId: string, ukmNama: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus UKM "${ukmNama}"? Data pendaftaran UKM ini juga akan terhapus.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/ukm?id=${ukmId}`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.success) {
        alert(`Gagal menghapus UKM: ${json.error}`);
        return;
      }

      alert(`UKM "${ukmNama}" berhasil dihapus.`);
      await fetchUkmMasterList();
      await fetchOfficersList();
      if (onRefreshData) onRefreshData();
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menghapus UKM.');
    }
  };

  // Reject Modal State
  const [rejectingItem, setRejectingItem] = useState<PendaftaranUKM | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');

  // UKM list scoped to current session
  const scopedList = pendaftaranList.filter((item) => {
    if (isPengurus && session?.managedUkmId) {
      return item.ukmId === session.managedUkmId;
    }
    return true;
  });

  // Statistics based on scope
  const totalPendaftar = scopedList.length;
  const countPending = scopedList.filter((p) => p.status === 'PENDING').length;
  const countAccepted = scopedList.filter((p) => p.status === 'ACCEPTED').length;
  const countRejected = scopedList.filter((p) => p.status === 'REJECTED').length;

  // Filtered List for Table View
  const filteredList = scopedList.filter((item) => {
    const matchStatus = filterStatus === 'ALL' || item.status === filterStatus;
    const matchUkm = filterUkm === 'ALL' || item.ukmId === filterUkm;
    const q = searchQuery.toLowerCase().trim();
    const matchQuery =
      !q ||
      item.mahasiswa.nama.toLowerCase().includes(q) ||
      item.mahasiswa.nim.toLowerCase().includes(q) ||
      item.mahasiswa.prodi.toLowerCase().includes(q) ||
      item.ukmNama.toLowerCase().includes(q);

    return matchStatus && matchUkm && matchQuery;
  });

  // Filtered Officers List
  const filteredOfficers = officersList.filter((o) => {
    const q = officerSearch.toLowerCase().trim();
    return (
      !q ||
      o.ukmNama.toLowerCase().includes(q) ||
      o.email.toLowerCase().includes(q) ||
      o.kategori.toLowerCase().includes(q)
    );
  });

  // Handle Export Excel
  const handleExportExcel = () => {
    const exportData = filteredList.map((item, idx) => ({
      No: idx + 1,
      'Nama Mahasiswa': item.mahasiswa.nama,
      NIM: item.mahasiswa.nim,
      Fakultas: item.mahasiswa.fakultas,
      'Program Studi': item.mahasiswa.prodi,
      'Nomor WhatsApp': item.mahasiswa.noHp,
      Email: item.mahasiswa.email || '-',
      'UKM Pilihan': item.ukmNama,
      'Status Pendaftaran': item.status,
      'Catatan Penolakan': item.catatanPenolakan || '-',
      'Tanggal Daftar': item.tanggalDaftar,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    const sheetName = isPengurus ? (session?.managedUkmNama?.substring(0, 25) || 'Anggota UKM') : 'Rekap Pendaftaran';
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Auto-fit column width
    const max_width = exportData.reduce((w, r) => {
      return Object.keys(r).reduce((w2, k) => {
        const val = String((r as any)[k]);
        return Math.max(w2, val.length + 3);
      }, w);
    }, 10);
    worksheet['!cols'] = [{ wch: max_width }];

    const fileName = isPengurus
      ? `Rekap_Anggota_${session?.managedUkmId}_2026.xlsx`
      : `Rekap_Pendaftaran_UKM_UNESA_2026.xlsx`;

    XLSX.writeFile(workbook, fileName);
  };

  const openRejectModal = (item: PendaftaranUKM) => {
    setRejectingItem(item);
    setRejectionReason('');
  };

  const confirmReject = () => {
    if (!rejectingItem) return;
    if (!rejectionReason.trim()) {
      alert('Silakan berikan alasan penolakan untuk mahasiswa.');
      return;
    }
    onReject(rejectingItem.id, rejectionReason.trim());
    setRejectingItem(null);
    setRejectionReason('');
  };

  const openEditOfficerModal = (officer: OfficerAccount) => {
    setEditingOfficer(officer);
    setEditEmail(officer.email);
    setEditPassword('');
    setOfficerSuccessMsg('');
  };

  const handleSaveOfficerAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOfficer) return;

    if (!editEmail.trim() || !editEmail.includes('@')) {
      alert('Masukkan email pengurus yang valid.');
      return;
    }

    try {
      setIsSavingOfficer(true);
      const res = await fetch('/api/pengurus', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ukmId: editingOfficer.ukmId,
          email: editEmail.trim().toLowerCase(),
          password: editPassword.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (!json.success) {
        alert(`Gagal memperbarui akun: ${json.error}`);
        return;
      }

      setOfficerSuccessMsg(`Akun & password untuk ${editingOfficer.ukmNama} berhasil diperbarui!`);
      await fetchOfficersList();
      setTimeout(() => {
        setEditingOfficer(null);
        setOfficerSuccessMsg('');
      }, 1000);
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menyimpan akun pengurus.');
    } finally {
      setIsSavingOfficer(false);
    }
  };

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      {/* Header Banner with Scoped UKM Title */}
      <div className="brutalist-card p-4 sm:p-6 bg-gradient-to-r from-[#7AF7F2] via-[#FFF48D] to-[#83F582] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#1D1C1C] text-[#7AF7F2] px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1">
              {isPengurus ? `DEDICATED OFFICER: ${session?.managedUkmNama}` : isSuperadmin ? 'MASTER SUPERADMIN CONTROL' : 'DASHBOARD PENGURUS'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase text-[#1D1C1C] tracking-tight leading-tight">
            {isPengurus ? `Dashboard Monitoring — ${session?.managedUkmNama}` : 'Dashboard Monitoring UKM'}
          </h2>
          <p className="text-xs sm:text-sm font-bold text-stone-800 mt-1">
            {isPengurus
              ? `Kelola & verifikasi mahasiswa pendaftar baru khusus untuk ${session?.managedUkmNama}.`
              : 'Verifikasi pendaftaran mahasiswa, kelola akun pengurus, dan pantau kuota 65 UKM UNESA.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportExcel}
            className="w-full sm:w-auto px-4 py-2.5 bg-[#83F582] hover:bg-[#68e067] text-[#1D1C1C] font-black text-xs uppercase rounded-xl border-3 border-[#1D1C1C] shadow-[3px_3px_0px_#1D1C1C] active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            <IconExcel className="w-4 h-4" /> Ekspor Excel (.xlsx)
          </button>
        </div>
      </div>

      {/* Superadmin Sub-Tab Switcher */}
      {isSuperadmin && (
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 p-1 bg-[#EFECE6] border-3 border-[#1D1C1C] rounded-2xl max-w-xl shadow-[3px_3px_0px_#1D1C1C]">
          <button
            onClick={() => setActiveSubTab('MONITORING')}
            className={`flex-1 py-2.5 px-3 rounded-xl font-black text-xs uppercase transition-all flex items-center justify-center gap-1.5 ${
              activeSubTab === 'MONITORING'
                ? 'bg-[#FFF48D] text-[#1D1C1C] border-2 border-[#1D1C1C] shadow-[2px_2px_0px_#1D1C1C]'
                : 'text-stone-700 hover:text-black'
            }`}
          >
            <IconChartLine className="w-4 h-4" /> Monitoring Pendaftaran
          </button>

          <button
            onClick={() => setActiveSubTab('OFFICERS')}
            className={`flex-1 py-2.5 px-3 rounded-xl font-black text-xs uppercase transition-all flex items-center justify-center gap-1.5 ${
              activeSubTab === 'OFFICERS'
                ? 'bg-[#83F582] text-[#1D1C1C] border-2 border-[#1D1C1C] shadow-[2px_2px_0px_#1D1C1C]'
                : 'text-stone-700 hover:text-black'
            }`}
          >
            <IconKey className="w-4 h-4" /> Kelola Akun Pengurus ({LIST_UKM.length})
          </button>

          <button
            onClick={() => setActiveSubTab('UKM_MASTER')}
            className={`flex-1 py-2.5 px-3 rounded-xl font-black text-xs uppercase transition-all flex items-center justify-center gap-1.5 ${
              activeSubTab === 'UKM_MASTER'
                ? 'bg-[#7AF7F2] text-[#1D1C1C] border-2 border-[#1D1C1C] shadow-[2px_2px_0px_#1D1C1C]'
                : 'text-stone-700 hover:text-black'
            }`}
          >
            <IconGrid className="w-4 h-4" /> Kelola Master UKM
          </button>
        </div>
      )}

      {/* SUB-TAB 1: MONITORING PENDAFTARAN */}
      {activeSubTab === 'MONITORING' && (
        <>
          {/* Statistics Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white border-3 border-[#1D1C1C] p-3 sm:p-4 rounded-xl shadow-[3px_3px_0px_#1D1C1C]">
              <p className="text-[10px] sm:text-xs font-black uppercase text-stone-500">Total Pendaftar</p>
              <p className="text-xl sm:text-3xl font-black text-[#1D1C1C] mt-1">{totalPendaftar}</p>
            </div>

            <div className="bg-[#FFF48D] border-3 border-[#1D1C1C] p-3 sm:p-4 rounded-xl shadow-[3px_3px_0px_#1D1C1C]">
              <p className="text-[10px] sm:text-xs font-black uppercase text-[#1D1C1C]">Menunggu Approval</p>
              <p className="text-xl sm:text-3xl font-black text-[#1D1C1C] mt-1">{countPending}</p>
            </div>

            <div className="bg-[#83F582] border-3 border-[#1D1C1C] p-3 sm:p-4 rounded-xl shadow-[3px_3px_0px_#1D1C1C]">
              <p className="text-[10px] sm:text-xs font-black uppercase text-[#1D1C1C]">Diterima (Accepted)</p>
              <p className="text-xl sm:text-3xl font-black text-[#1D1C1C] mt-1">{countAccepted}</p>
            </div>

            <div className="bg-[#FFD1D1] border-3 border-[#1D1C1C] p-3 sm:p-4 rounded-xl shadow-[3px_3px_0px_#1D1C1C]">
              <p className="text-[10px] sm:text-xs font-black uppercase text-red-900">Ditolak (Rejected)</p>
              <p className="text-xl sm:text-3xl font-black text-red-900 mt-1">{countRejected}</p>
            </div>
          </div>

          {/* Filter & Search Bar Toolbar */}
          <div className="brutalist-card p-4 space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari Nama, NIM, Prodi, atau UKM..."
                  className="w-full bg-stone-50 border-2 sm:border-3 border-[#1D1C1C] pl-9 pr-3 py-2 font-bold text-xs sm:text-sm text-[#1D1C1C] rounded-xl shadow-[2px_2px_0px_#1D1C1C] focus:outline-none focus:ring-2 focus:ring-[#7AF7F7]"
                />
                <IconSearch className="w-4 h-4 text-stone-500 absolute left-3 top-2.5 sm:top-3" />
              </div>

              {/* Filter Status */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-white border-2 sm:border-3 border-[#1D1C1C] px-3 py-2 font-bold text-xs text-[#1D1C1C] rounded-xl shadow-[2px_2px_0px_#1D1C1C] cursor-pointer"
              >
                <option value="ALL">Semua Status</option>
                <option value="PENDING">PENDING (Menunggu)</option>
                <option value="ACCEPTED">ACCEPTED (Diterima)</option>
                <option value="REJECTED">REJECTED (Ditolak)</option>
              </select>

              {/* Filter UKM Selector */}
              {!isPengurus ? (
                <select
                  value={filterUkm}
                  onChange={(e) => setFilterUkm(e.target.value)}
                  className="bg-white border-2 sm:border-3 border-[#1D1C1C] px-3 py-2 font-bold text-xs text-[#1D1C1C] rounded-xl shadow-[2px_2px_0px_#1D1C1C] cursor-pointer"
                >
                  <option value="ALL">Semua 65 UKM (Master View)</option>
                  {LIST_UKM.map((ukm) => (
                    <option key={ukm.id} value={ukm.id}>
                      {ukm.nama}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="bg-[#FFF48D] border-2 sm:border-3 border-[#1D1C1C] px-3 py-2 rounded-xl text-xs font-black uppercase shadow-[2px_2px_0px_#1D1C1C] flex items-center gap-1.5 shrink-0">
                  <IconShieldCheck className="w-4 h-4 text-[#1D1C1C]" />
                  <span>UKM: {session?.managedUkmNama}</span>
                </div>
              )}
            </div>
          </div>

          {/* Main Data Table Wrapper */}
          <div className="brutalist-card overflow-hidden">
            {filteredList.length === 0 ? (
              <div className="p-6 sm:p-10 text-center bg-stone-50 space-y-2">
                <div className="inline-block p-3 bg-[#FFF48D] border-2 border-[#1D1C1C] rounded-2xl mb-1 shadow-[2px_2px_0px_#1D1C1C]">
                  <span className="text-xl">📭</span>
                </div>
                <h3 className="font-black text-sm sm:text-base text-[#1D1C1C] uppercase">
                  Tidak Ada Data Pendaftar
                </h3>
                <p className="text-xs font-bold text-stone-600 max-w-md mx-auto leading-relaxed px-2">
                  Belum ada data pendaftar mahasiswa yang sesuai dengan filter pencarian saat ini.
                </p>
              </div>
            ) : (
              <div className="max-w-full overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-[#1D1C1C] text-white text-[11px] font-black uppercase tracking-wider">
                      <th className="py-3 px-4">No</th>
                      <th className="py-3 px-4">Mahasiswa & NIM</th>
                      <th className="py-3 px-4">Fakultas & Prodi</th>
                      <th className="py-3 px-4">WhatsApp</th>
                      <th className="py-3 px-4">UKM Pilihan</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-center">Aksi Verifikasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-[#1D1C1C] text-xs font-bold text-[#1D1C1C]">
                    {filteredList.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-[#FAF7F2] transition-colors">
                        <td className="py-3 px-4 font-mono font-black">{idx + 1}</td>
                        <td className="py-3 px-4">
                          <p className="font-black uppercase text-stone-900">{item.mahasiswa.nama}</p>
                          <p className="text-[11px] font-mono text-stone-600">NIM: {item.mahasiswa.nim}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-stone-900">{item.mahasiswa.prodi}</p>
                          <p className="text-[10px] text-stone-500 font-semibold">{item.mahasiswa.fakultas}</p>
                        </td>
                        <td className="py-3 px-4 font-mono">
                          <a
                            href={`https://wa.me/${item.mahasiswa.noHp.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 bg-[#83F582] border border-[#1D1C1C] px-2 py-0.5 rounded text-[11px] font-black text-[#1D1C1C] hover:bg-[#68e067]"
                          >
                            📱 {item.mahasiswa.noHp}
                          </a>
                        </td>
                        <td className="py-3 px-4 font-black">{item.ukmNama}</td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border border-[#1D1C1C] ${
                              item.status === 'ACCEPTED'
                                ? 'bg-[#83F582] text-[#1D1C1C]'
                                : item.status === 'REJECTED'
                                ? 'bg-[#FFD1D1] text-red-900'
                                : 'bg-[#FFF48D] text-[#1D1C1C]'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {item.status !== 'ACCEPTED' && (
                              <button
                                onClick={() => onApprove(item.id)}
                                className="px-2.5 py-1 bg-[#83F582] hover:bg-[#68e067] text-[#1D1C1C] font-black text-[11px] uppercase rounded-lg border border-[#1D1C1C] shadow-[1.5px_1.5px_0px_#1D1C1C] active:translate-y-0.5 flex items-center gap-1"
                                title="Setujui Pendaftaran"
                              >
                                <IconCheck className="w-3.5 h-3.5" /> Approve
                              </button>
                            )}

                            {item.status !== 'REJECTED' && (
                              <button
                                onClick={() => openRejectModal(item)}
                                className="px-2.5 py-1 bg-[#FFD1D1] hover:bg-red-200 text-red-900 font-black text-[11px] uppercase rounded-lg border border-[#1D1C1C] shadow-[1.5px_1.5px_0px_#1D1C1C] active:translate-y-0.5 flex items-center gap-1"
                                title="Tolak Pendaftaran"
                              >
                                <IconX className="w-3.5 h-3.5" /> Reject
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* SUB-TAB 2: KELOLA AKUN PENGURUS UKM (SUPERADMIN ONLY) */}
      {activeSubTab === 'OFFICERS' && isSuperadmin && (
        <div className="space-y-4">
          <div className="brutalist-card p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={officerSearch}
                onChange={(e) => setOfficerSearch(e.target.value)}
                placeholder="Cari Nama UKM atau Email Pengurus..."
                className="w-full bg-stone-50 border-2 sm:border-3 border-[#1D1C1C] pl-9 pr-3 py-2 font-bold text-xs sm:text-sm text-[#1D1C1C] rounded-xl shadow-[2px_2px_0px_#1D1C1C] focus:outline-none focus:ring-2 focus:ring-[#83F582]"
              />
              <IconSearch className="w-4 h-4 text-stone-500 absolute left-3 top-2.5 sm:top-3" />
            </div>

            <div className="bg-[#FFF48D] border-2 border-[#1D1C1C] px-3 py-2 rounded-xl text-xs font-black uppercase shadow-[2px_2px_0px_#1D1C1C] text-center">
              Total 65 Akun Pengurus UKM
            </div>
          </div>

          <div className="brutalist-card overflow-hidden">
            <div className="max-w-full overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[650px]">
                <thead>
                  <tr className="bg-[#1D1C1C] text-white text-[11px] font-black uppercase tracking-wider">
                    <th className="py-3 px-4">No</th>
                    <th className="py-3 px-4">Nama UKM & Kategori</th>
                    <th className="py-3 px-4">Email Login Pengurus</th>
                    <th className="py-3 px-4 text-center">Status Password</th>
                    <th className="py-3 px-4 text-center">Aksi Manajemen</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-[#1D1C1C] text-xs font-bold text-[#1D1C1C]">
                  {isLoadingOfficers ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-stone-500 font-bold">
                        Memuat daftar akun pengurus dari PostgreSQL...
                      </td>
                    </tr>
                  ) : filteredOfficers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-stone-500 font-bold">
                        Tidak ada akun pengurus yang sesuai pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredOfficers.map((off, idx) => (
                      <tr key={off.id} className="hover:bg-[#FAF7F2] transition-colors">
                        <td className="py-3 px-4 font-mono font-black">{idx + 1}</td>
                        <td className="py-3 px-4">
                          <p className="font-black uppercase text-stone-900">{off.ukmNama}</p>
                          <span className="inline-block bg-[#FFF48D] border border-[#1D1C1C] px-1.5 py-0.2 rounded text-[9px] font-black uppercase text-[#1D1C1C]">
                            {off.kategori}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-black text-emerald-800">
                          {off.email}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {off.hasCustomPassword ? (
                            <span className="bg-[#83F582] border border-[#1D1C1C] px-2 py-0.5 rounded text-[10px] font-black text-[#1D1C1C]">
                              ✓ Password Kustom (Diset)
                            </span>
                          ) : (
                            <span className="bg-stone-100 border border-stone-300 text-stone-500 px-2 py-0.5 rounded text-[10px]">
                              Password Default
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => openEditOfficerModal(off)}
                            className="px-3 py-1.5 bg-[#FFF48D] hover:bg-[#ffe945] text-[#1D1C1C] font-black text-[11px] uppercase rounded-lg border-2 border-[#1D1C1C] shadow-[1.5px_1.5px_0px_#1D1C1C] active:translate-y-0.5 flex items-center gap-1.5 mx-auto cursor-pointer"
                          >
                            <IconKey className="w-3.5 h-3.5" /> Edit Akun & Password
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: KELOLA MASTER UKM (SUPERADMIN ONLY) */}
      {activeSubTab === 'UKM_MASTER' && isSuperadmin && (
        <div className="space-y-4">
          <div className="brutalist-card p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-gradient-to-r from-white via-[#7AF7F2]/20 to-[#FFF48D]/20">
            <div className="relative flex-1">
              <input
                type="text"
                value={ukmSearch}
                onChange={(e) => setUkmSearch(e.target.value)}
                placeholder="Cari UKM, Kategori, atau Pembina..."
                className="w-full bg-white border-2 sm:border-3 border-[#1D1C1C] pl-9 pr-3 py-2 font-bold text-xs sm:text-sm text-[#1D1C1C] rounded-xl shadow-[2px_2px_0px_#1D1C1C] focus:outline-none focus:ring-2 focus:ring-[#7AF7F2]"
              />
              <IconSearch className="w-4 h-4 text-stone-500 absolute left-3 top-2.5 sm:top-3" />
            </div>

            <button
              onClick={handleOpenNewUkmModal}
              className="px-4 py-2.5 bg-[#83F582] hover:bg-[#68e067] text-[#1D1C1C] font-black text-xs uppercase rounded-xl border-3 border-[#1D1C1C] shadow-[3px_3px_0px_#1D1C1C] active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <IconPlus className="w-4 h-4" /> Tambah UKM Baru
            </button>
          </div>

          <div className="brutalist-card overflow-hidden">
            <div className="max-w-full overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-[#1D1C1C] text-white text-[11px] font-black uppercase tracking-wider">
                    <th className="py-3 px-4">No</th>
                    <th className="py-3 px-4">ID & Nama UKM</th>
                    <th className="py-3 px-4">Kategori</th>
                    <th className="py-3 px-4">Pembina</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Aksi Manajemen</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-[#1D1C1C] text-xs font-bold text-[#1D1C1C]">
                  {isLoadingUkms ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-stone-500 font-bold">
                        Memuat daftar master UKM dari PostgreSQL...
                      </td>
                    </tr>
                  ) : (ukmMasterList.length > 0 ? ukmMasterList : LIST_UKM)
                      .filter(
                        (u) =>
                          u.nama.toLowerCase().includes(ukmSearch.toLowerCase()) ||
                          u.kategori.toLowerCase().includes(ukmSearch.toLowerCase()) ||
                          u.id.toLowerCase().includes(ukmSearch.toLowerCase())
                      )
                      .length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-stone-500 font-bold">
                        Tidak ada UKM yang sesuai dengan kata kunci.
                      </td>
                    </tr>
                  ) : (
                    (ukmMasterList.length > 0 ? ukmMasterList : LIST_UKM)
                      .filter(
                        (u) =>
                          u.nama.toLowerCase().includes(ukmSearch.toLowerCase()) ||
                          u.kategori.toLowerCase().includes(ukmSearch.toLowerCase()) ||
                          u.id.toLowerCase().includes(ukmSearch.toLowerCase())
                      )
                      .map((ukm, idx) => (
                        <tr key={ukm.id} className="hover:bg-[#FAF7F2] transition-colors">
                          <td className="py-3 px-4 font-mono font-black">{idx + 1}</td>
                          <td className="py-3 px-4">
                            <p className="font-black uppercase text-stone-900">{ukm.nama}</p>
                            <span className="font-mono text-[10px] text-stone-500 font-bold">
                              ID: {ukm.id}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-block bg-[#FFF48D] border border-[#1D1C1C] px-2 py-0.5 rounded text-[10px] font-black uppercase text-[#1D1C1C]">
                              {ukm.kategori}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-bold text-stone-700">
                            {ukm.pembina || 'UNESA'}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black uppercase border ${
                                ukm.status === 'closed'
                                  ? 'bg-red-100 text-red-800 border-red-400'
                                  : 'bg-emerald-100 text-emerald-800 border-emerald-400'
                              }`}
                            >
                              {ukm.status === 'closed' ? (
                                <>
                                  <IconLock className="w-3 h-3 text-red-700 shrink-0" /> Tutup
                                </>
                              ) : (
                                <>
                                  <IconCheck className="w-3 h-3 text-emerald-700 shrink-0" /> Buka
                                </>
                              )}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleOpenEditUkmModal(ukm)}
                                className="px-2.5 py-1 bg-[#FFF48D] hover:bg-[#ffe945] text-[#1D1C1C] font-black text-[11px] uppercase rounded-lg border-2 border-[#1D1C1C] shadow-[1.5px_1.5px_0px_#1D1C1C] active:translate-y-0.5 flex items-center gap-1"
                              >
                                <IconEdit className="w-3.5 h-3.5" /> Edit
                              </button>
                              <button
                                onClick={() => handleDeleteUkm(ukm.id, ukm.nama)}
                                className="px-2.5 py-1 bg-[#FFD1D1] hover:bg-red-200 text-red-900 font-black text-[11px] uppercase rounded-lg border-2 border-[#1D1C1C] shadow-[1.5px_1.5px_0px_#1D1C1C] active:translate-y-0.5 flex items-center gap-1"
                              >
                                <IconTrash className="w-3.5 h-3.5" /> Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit UKM Modal (Superadmin Only) */}
      {editingUkm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-[#FAF7F2] border-4 border-[#1D1C1C] rounded-2xl max-w-lg w-full p-6 shadow-[8px_8px_0px_#1D1C1C] space-y-4 my-auto">
            <div className="flex items-center justify-between pb-2 border-b-2 border-[#1D1C1C]">
              <div className="flex items-center gap-2">
                <IconGrid className="w-5 h-5 text-[#1D1C1C]" />
                <h3 className="font-black text-base uppercase text-[#1D1C1C]">
                  {isNewUkm ? 'Tambah UKM Baru UNESA' : `Edit Master UKM — ${ukmForm.nama}`}
                </h3>
              </div>
              <button
                onClick={() => setEditingUkm(null)}
                className="p-1 text-stone-600 hover:text-black"
              >
                <IconX className="w-4 h-4" />
              </button>
            </div>

            {ukmSuccessMsg && (
              <div className="p-3 bg-[#83F582] border-2 border-[#1D1C1C] rounded-xl text-xs font-bold text-[#1D1C1C]">
                ✓ {ukmSuccessMsg}
              </div>
            )}

            <form onSubmit={handleSaveUkm} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase text-[#1D1C1C] mb-1">
                    ID UKM
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!isNewUkm}
                    value={ukmForm.id}
                    onChange={(e) => setUkmForm({ ...ukmForm, id: e.target.value })}
                    placeholder="ukm-66"
                    className="w-full bg-stone-100 border-2 border-[#1D1C1C] p-2 font-mono font-bold text-xs text-[#1D1C1C] rounded-xl focus:outline-none disabled:opacity-75"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-[#1D1C1C] mb-1">
                    Kategori UKM
                  </label>
                  <select
                    value={ukmForm.kategori}
                    onChange={(e) => setUkmForm({ ...ukmForm, kategori: e.target.value })}
                    className="w-full bg-white border-2 border-[#1D1C1C] p-2 font-bold text-xs text-[#1D1C1C] rounded-xl focus:outline-none"
                  >
                    <option value="Olahraga">Olahraga</option>
                    <option value="Seni">Seni & Budaya</option>
                    <option value="Penalaran">Penalaran & Keilmuan</option>
                    <option value="Keagamaan">Keagamaan</option>
                    <option value="Keterampilan">Keterampilan / Khusus</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-[#1D1C1C] mb-1">
                  Nama Resmi UKM
                </label>
                <input
                  type="text"
                  required
                  value={ukmForm.nama}
                  onChange={(e) => setUkmForm({ ...ukmForm, nama: e.target.value })}
                  placeholder="Contoh: UKM Futsal UNESA"
                  className="w-full bg-white border-2 border-[#1D1C1C] p-2 font-bold text-xs text-[#1D1C1C] rounded-xl focus:outline-none shadow-[1.5px_1.5px_0px_#1D1C1C]"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-[#1D1C1C] mb-1">
                  Deskripsi Singkat UKM
                </label>
                <textarea
                  rows={3}
                  value={ukmForm.deskripsi}
                  onChange={(e) => setUkmForm({ ...ukmForm, deskripsi: e.target.value })}
                  placeholder="Jelaskan profil dan kegiatan utama UKM..."
                  className="w-full bg-white border-2 border-[#1D1C1C] p-2 font-bold text-xs text-[#1D1C1C] rounded-xl focus:outline-none shadow-[1.5px_1.5px_0px_#1D1C1C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase text-[#1D1C1C] mb-1">
                    Pembina UKM
                  </label>
                  <input
                    type="text"
                    value={ukmForm.pembina}
                    onChange={(e) => setUkmForm({ ...ukmForm, pembina: e.target.value })}
                    placeholder="Dosen / Pembina UNESA"
                    className="w-full bg-white border-2 border-[#1D1C1C] p-2 font-bold text-xs text-[#1D1C1C] rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-[#1D1C1C] mb-1">
                    Status Pendaftaran
                  </label>
                  <select
                    value={ukmForm.status}
                    onChange={(e) => setUkmForm({ ...ukmForm, status: e.target.value })}
                    className="w-full bg-white border-2 border-[#1D1C1C] p-2 font-bold text-xs text-[#1D1C1C] rounded-xl focus:outline-none"
                  >
                    <option value="open">🟢 Terbuka (Open)</option>
                    <option value="closed">🔒 Ditutup (Closed)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t-2 border-[#1D1C1C]">
                <button
                  type="button"
                  onClick={() => setEditingUkm(null)}
                  className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 font-black text-xs uppercase rounded-xl border-2 border-[#1D1C1C]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingUkm}
                  className="px-5 py-2 bg-[#83F582] hover:bg-[#68e067] text-[#1D1C1C] font-black text-xs uppercase rounded-xl border-2 border-[#1D1C1C] shadow-[3px_3px_0px_#1D1C1C] active:translate-y-0.5 cursor-pointer"
                >
                  {isSavingUkm ? 'Menyimpan...' : isNewUkm ? 'Tambah UKM Baru' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Officer Account & Password Modal (Superadmin Only) */}
      {editingOfficer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FAF7F2] border-4 border-[#1D1C1C] rounded-2xl max-w-md w-full p-6 shadow-[8px_8px_0px_#1D1C1C] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b-2 border-[#1D1C1C]">
              <div className="flex items-center gap-2">
                <IconKey className="w-5 h-5 text-emerald-700" />
                <h3 className="font-black text-base uppercase text-[#1D1C1C]">
                  Edit Akun — {editingOfficer.ukmNama}
                </h3>
              </div>
              <button
                onClick={() => setEditingOfficer(null)}
                className="p-1 text-stone-600 hover:text-black"
              >
                <IconX className="w-4 h-4" />
              </button>
            </div>

            {officerSuccessMsg && (
              <div className="p-3 bg-[#83F582] border-2 border-[#1D1C1C] rounded-xl text-xs font-bold text-[#1D1C1C]">
                ✓ {officerSuccessMsg}
              </div>
            )}

            <form onSubmit={handleSaveOfficerAccount} className="space-y-3.5">
              <div>
                <label className="block text-xs font-black uppercase text-[#1D1C1C] mb-1">
                  Email Login Pengurus UKM
                </label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="Contoh: pengurus.menwa@unesa.ac.id"
                  className="w-full bg-white border-3 border-[#1D1C1C] p-2.5 font-bold text-xs text-[#1D1C1C] rounded-xl focus:outline-none shadow-[2px_2px_0px_#1D1C1C]"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-[#1D1C1C] mb-1">
                  Reset Password Pengurus Baru (Opsional)
                </label>
                <div className="relative">
                  <input
                    type={showEditPassword ? 'text' : 'password'}
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    placeholder="Isi jika ingin mengganti password baru"
                    className="w-full bg-white border-3 border-[#1D1C1C] p-2.5 pr-10 font-bold text-xs text-[#1D1C1C] rounded-xl focus:outline-none shadow-[2px_2px_0px_#1D1C1C]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPassword(!showEditPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-stone-600 hover:text-[#1D1C1C] transition-colors"
                    title={showEditPassword ? 'Sembunyikan Password' : 'Lihat Password'}
                  >
                    {showEditPassword ? <IconEyeOff className="w-4 h-4" /> : <IconEye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] font-bold text-stone-500 mt-1">
                  Biarkan kosong jika tidak ingin mengubah password saat ini.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t-2 border-[#1D1C1C]">
                <button
                  type="button"
                  onClick={() => setEditingOfficer(null)}
                  className="px-4 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-800 font-black text-xs uppercase rounded-xl border-2 border-[#1D1C1C]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingOfficer}
                  className="px-5 py-2.5 bg-[#83F582] hover:bg-[#68e067] text-[#1D1C1C] font-black text-xs uppercase rounded-xl border-2 border-[#1D1C1C] shadow-[3px_3px_0px_#1D1C1C] active:translate-y-0.5"
                >
                  {isSavingOfficer ? 'Menyimpan...' : 'Simpan Perubahan Akun'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FAF7F2] border-4 border-[#1D1C1C] rounded-2xl max-w-md w-full p-6 shadow-[8px_8px_0px_#1D1C1C] space-y-4">
            <div className="flex items-center gap-2 text-red-600">
              <IconAlert className="w-6 h-6 shrink-0" />
              <h3 className="font-black text-lg uppercase text-[#1D1C1C]">Konfirmasi Penolakan</h3>
            </div>

            <p className="text-xs font-bold text-stone-700">
              Anda akan menolak pendaftaran <span className="font-black text-[#1D1C1C]">{rejectingItem.mahasiswa.nama}</span> ({rejectingItem.mahasiswa.nim}) di UKM <span className="font-black text-[#1D1C1C]">{rejectingItem.ukmNama}</span>.
            </p>

            <div>
              <label className="block text-xs font-black uppercase text-[#1D1C1C] mb-1">
                Alasan / Catatan Penolakan
              </label>
              <textarea
                required
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Contoh: Kuota UKM periode ini telah terpenuhi."
                className="w-full bg-white border-3 border-[#1D1C1C] p-2.5 font-bold text-xs text-[#1D1C1C] rounded-xl focus:outline-none shadow-[2px_2px_0px_#1D1C1C]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectingItem(null)}
                className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 font-black text-xs uppercase rounded-xl border-2 border-[#1D1C1C]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmReject}
                className="px-4 py-2 bg-[#D64545] hover:bg-red-600 text-white font-black text-xs uppercase rounded-xl border-2 border-[#1D1C1C] shadow-[2px_2px_0px_#1D1C1C]"
              >
                Tolak Pendaftaran
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
