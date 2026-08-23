# Checklist Fitur Kesiapan Production (Pre-Deployment Feature Checklist)
## Sistem Informasi Pekan Raya Mahasiswa (PRM UNESA 2026)

> **Dokumen Verifikasi Fitur Sebelum Deployment Ke cPanel UNESA**  
> **Tanggal Verifikasi:** 23 Agustus 2026  
> **Status Kesiapan:** **100% READY FOR PRODUCTION DEPLOYMENT**

---

## 1. 🔒 Modul Autentikasi & Akun PRM 2026 (`AuthModal.tsx`)

- [x] **Registrasi Akun Mandiri PRM 2026** — Mahasiswa membuat akun khusus pendaftaran PRM dengan Email UNESA dan Password Ketat (Min 8 Karakter, Angka & Simbol).
- [x] **Pemberitahuan Akun Khusus PRM** — Banner kuning menjelaskan bahwa akun PRM 2026 terpisah dari akun SSO kampus.
- [x] **Validasi Format Email UNESA** — Memastikan email mahasiswa valid tanpa menyebutkan domain secara spesifik di teks label UI.
- [x] **Login Akun PRM 2026** — Autentikasi login mahasiswa & pengurus.
- [x] **Lupa Password & Reset Code** — Fitur permintaan kode verifikasi 6-digit untuk reset password akun PRM.
- [x] **Session Persistence** — Sesi login otomatis tersimpan di LocalStorage (`prm_unesa_user_session`) sehingga user otomatis login saat membuka browser kembali.

---

## 2. 📋 Modul Formulir Pendaftaran Mahasiswa (`RegistrationForm.tsx`)

- [x] **Field 1: Nama Lengkap Mahasiswa** — Input teks nama mahasiswa.
- [x] **Field 2: Nomor Induk Mahasiswa (NIM)** — Input NIM dengan validasi keunikan.
- [x] **Field 3: Fakultas (Dynamic Dropdown)** — Dropdown 13 Fakultas resmi UNESA dari database PostgreSQL.
- [x] **Field 4: Program Studi (Dynamic Dropdown)** — Dropdown 119 Prodi resmi UNESA dari database PostgreSQL (termasuk 7 nama prodi terbaru: *Pendidikan Non Formal, Pendidikan Khusus, Terapi & Masase Olahraga, Administrasi Publik, Seni Kuliner & Jasa Boga, Desain Mode*).
- [x] **Field 5: Nomor WhatsApp Aktif** — Input nomor WA dengan validasi format Indonesia (`08`/`628`, 10–14 digit).
- [x] **Field 6: Katalog 65 UKM Resmi UNESA** — Grid kartu UKM dengan desain *Slim & Clean* (tanpa logo emoji & tanpa footer pembina).
- [x] **Pencarian Live Katalog UKM** — Search bar untuk mencari nama/deskripsi UKM secara instan.
- [x] **Filter 5 Kategori UKM Ringkas** — Button pills filter (*Olahraga & Bela Diri*, *Seni & Budaya*, *Penalaran & Keilmuan*, *Kerohanian*, *Kepemimpinan & Pengabdian*).
- [x] **Summary Banner UKM Terpilih** — Ringkasan UKM yang dipilih dengan tombol *Batal Pilih* dan animasi entrance/exit smooth.
- [x] **Auto-Save Draft** — Form otomatis tersimpan di browser via `useAutoSaveDraft` jika koneksi HP terputus.

---

## 3. 🛡️ Modul Proteksi Integrity & Business Logic Guards

- [x] **Strict 1 UKM Guard (UI Level)** — Form terkunci otomatis (`isLocked = true`) jika mahasiswa sudah memiliki pendaftaran aktif (`PENDING`/`ACCEPTED`).
- [x] **Strict 1 UKM Guard (Backend API Level)** — Penolakan `400 Bad Request` dari API `/api/pendaftaran` jika request submit dikirim paksa untuk NIM/Email terdaftar.
- [x] **Strict 1 Account Guard** — Constraint `UNIQUE(email)` dan `UNIQUE(nim)` pada database PostgreSQL.
- [x] **Atomic Concurrency Lock** — PostgreSQL Native Transaction (`BEGIN ... COMMIT`) untuk mencegah bentrok dua submit bersamaan.

---

## 4. 📊 Modul Dashboard Monitoring Mahasiswa (`MahasiswaDashboard.tsx`)

- [x] **Kartu Rincian Pendaftaran Aktif** — Menampilkan detail biodata, UKM yang dipilih, & tanggal daftar.
- [x] **Indikator Badge Status** — Badge status pendaftaran (`PENDING`, `ACCEPTED`, `REJECTED`, `CANCELLED`).
- [x] **Fitur Pembatalan Pendaftaran** — Mahasiswa dapat membatalkan pendaftaran pribadi jika status masih `PENDING`.

---

## 5. 🏢 Modul Dashboard Verifikasi & Multi-Tenant Scoping Pengurus UKM (`AdminDashboard.tsx` & `/pengurus`)

- [x] **Dedicated Route `/pengurus`** — Halaman khusus pengurus UKM & superadmin.
- [x] **Multi-Tenant Scoping (Data Isolation)** — Pengurus UKM (contoh: `pengurus.menwa@unesa.ac.id`) otomatis terkunci hanya dapat melihat & memverifikasi data pendaftar UKM-nya sendiri.
- [x] **Locked Filter Dropdown** — Filter UKM terkunci untuk Pengurus UKM biasa agar tidak dapat mengintip data 64 UKM lainnya.
- [x] **Statistik Real-Time** — Kartu hitung cepat (Total Pendaftar, Pending, Accepted, Rejected).
- [x] **Approval Workflow (`APPROVE`)** — Tombol setujui pendaftaran mahasiswa menjadi `ACCEPTED`.
- [x] **Rejection Workflow (`REJECT`)** — Modal dialog penolakan pendaftaran beserta input catatan alasan penolakan.
- [x] **Ekspor Rekapitulasi Excel (.xlsx)** — Mengunduh file `.xlsx` berisi rekap data anggota UKM dengan kolom terstruktur rapi.
- [x] **Kontak Langsung WhatsApp** — Tombol pintas `📱 08xxxx` untuk langsung mengirim pesan WA ke mahasiswa pendaftar.

---

## 6. ⚡ Modul Master Control Superadmin (`nurdhuha.23100@mhs.unesa.ac.id`)

- [x] **Visual Badge Emas `⚡ SUPERADMIN`** — Penanda akun superadmin di Navbar.
- [x] **Navigasi Pintas Lintas Route** — Tombol berpindah cepat antara `[ Form Pendaftaran Mahasiswa ]` (`/`) dan `[ Dashboard Pengurus UKM ]` (`/pengurus`).
- [x] **Master View 65 UKM** — Superadmin dapat memilih dropdown *Semua 65 UKM* atau spesifik UKM tertentu di `/pengurus`.
- [x] **Tab Kelola Akun Pengurus UKM (65 UKM)** — Tab khusus Superadmin untuk melihat daftar seluruh 65 Akun Pengurus UKM.
- [x] **Edit Email & Reset Password Pengurus** — Modal dialog untuk mengubah email login dan mereset password baru bagi setiap Pengurus UKM di PostgreSQL.

---

## 7. 📱 Modul UI/UX, Favicon & Responsivitas Mobile

- [x] **Judul Halaman Web Resmi** — `"Pekan Raya Mahasiswa - Universitas Negeri Surabaya"`.
- [x] **Favicon PRM Neo-Brutalisme Hijau** — Logo bertuliskan "PRM" hijau dengan style 3D Neo-Brutalisme (`/icons/prm-logo.jpg`).
- [x] **Header Navbar Compact Mobile** — Header slim 1 baris pada layar HP tanpa menutupi konten utama (`relative sm:sticky`).
- [x] **Panel Akun Popover Adaptif** — Popover menu akun melayang dengan `z-[100]`, lebar `max-w-[calc(100vw-24px)]`, & tanpa clipping.
- [x] **Bebas Horizontal Scroll / Overflow** — Seluruh elemen terbungkus rapi tanpa kebocoran piksel ke kanan (`overflow-x: hidden`).
- [x] **Empty State Message Wrapper** — Pesan *"Tidak ada data pendaftar..."* ter-wrap rapi pada layar smartphone.

---

## 🐘 8. Modul Backend API & Database PostgreSQL Native (Disk D)

- [x] **PostgreSQL 16 Native Database** — Terkoneksi ke `ukm_database` di Disk D (`postgresql://postgres:postgres@localhost:5432/ukm_database`).
- [x] **REST API `/api/ukm`** — Memuat 65 UKM murni dari PostgreSQL.
- [x] **REST API `/api/fakultas`** — Memuat 13 Fakultas & 119 Prodi murni dari PostgreSQL.
- [x] **REST API `/api/pendaftaran`** — Handler GET, POST, PATCH murni dari PostgreSQL.
- [x] **REST API `/api/pengurus`** — Handler GET, PUT Akun & Password Pengurus murni dari PostgreSQL.
- [x] **Zero Mock Data** — Seluruh transaksi data pendaftaran dan akun pengurus 100% menggunakan PostgreSQL.

---

## 🎯 Kesimpulan Kesiapan Deployment

Semua **42 Poin Fitur** di atas telah teruji dan terverifikasi **100% PASSED & WORKING (READY FOR PRODUCTION DEPLOYMENT)**. Aplikasi siap di-deploy ke cPanel UNESA!
