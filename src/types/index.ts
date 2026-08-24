export type Role = 'mahasiswa' | 'pengurus' | 'superadmin';

export type StatusPendaftaran = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';

export interface UKM {
  id: string;
  nama: string;
  slug?: string;
  kategori: string;
  deskripsi: string;
  logo: string;
  pembina: string;
  status?: 'open' | 'closed' | 'tutup' | string;
}

export interface MahasiswaProfile {
  nama: string;
  nim: string;
  fakultas: string;
  prodi: string;
  noHp: string;
  email?: string;
}

export interface PendaftaranUKM {
  id: string;
  mahasiswa: MahasiswaProfile;
  ukmId: string;
  ukmNama: string;
  status: StatusPendaftaran;
  catatanPenolakan?: string;
  tanggalDaftar: string;
  updatedAt: string;
}

export interface UserSession {
  isLoggedIn: boolean;
  email: string;
  role: Role;
  managedUkmId?: string;
  managedUkmNama?: string;
  profile?: MahasiswaProfile;
}
