# Catatan Rancangan Sistem Informasi Pendaftaran & Monitoring UKM (PRM)

## 1. Pendahuluan
Dokumen ini berisi rancangan kebutuhan dan alur kerja untuk Sistem Informasi Pendaftaran dan Monitoring Unit Kegiatan Mahasiswa (UKM) Universitas Negeri Surabaya (UNESA). 

> [!NOTE]
> Dokumentasi lengkap Arsitektur Sistem, Diagram Flow, Skema Database, dan Blueprint Struktur Folder telah dirangkum dalam [ARCHITECTURE.md](file:///D:/PRM/ARCHITECTURE.md). 
> Panduan Desain Visual UI Neo-Brutalism Hijau telah dirangkum dalam [DESIGN_SYSTEM.md](file:///D:/PRM/DESIGN_SYSTEM.md).

---

## 2. Aktor & Hak Akses (User Roles)

### A. Mahasiswa
- **Otentikasi:**
  - Login / Registrasi menggunakan verifikasi OTP Nomor Telepon (tanpa email).
  - Melengkapi biodata (Nama, NIM, Program Studi, Fakultas, UKM Pilihan).
- **Fitur Utama:**
  - **Eksplorasi UKM:** Melihat daftar UKM yang tersedia beserta deskripsi dan persyaratannya.
  - **Pendaftaran UKM:** Memilih/mendaftar pada UKM yang diinginkan.
  - **Dashboard Mahasiswa:** 
    - Menampilkan status pendaftaran (Pending / Diterima / Ditolak).
    - Menampilkan detail UKM yang telah diikuti.
    - Riwayat pendaftaran UKM.

### B. Pembina UKM
- **Otentikasi:**
  - Login menggunakan akun resmi Pembina / Dosen (`@unesa.ac.id`).
- **Fitur Utama:**
  - **Monitoring Mahasiswa:** Memantau daftar mahasiswa yang mendaftar atau aktif di UKM yang dibina.
  - **Filter Data:** Menyaring data mahasiswa berdasarkan angkatan, fakultas, prodi, dan status keanggotaan.
  - **Export Data:** Mengunduh laporan data anggota UKM dalam format **Excel (.xlsx)** yang rapi dan terstruktur.

### C. Pengurus UKM / Admin UKM (Rekomendasi Tambahan)
- **Fitur Utama:**
  - Mengelola profil UKM (deskripsi, logo, kontak, jadwal seleksi).
  - Melakukan validasi/approval pendaftaran mahasiswa baru.

---

### 3. Keputusan Teknis & Aturan Bisnis (Finalized Requirements)

1. **Otentikasi & Profil Mahasiswa (Login OTP Telepon):**
   - **Alur Login & Pengisian Data:**
     1. User memasukkan nomor telepon & verifikasi via kode OTP.
     2. **User Baru (Belum Mengisi Profil):** Diarahkan mengisi formulir pendaftaran dengan 5 data wajib:
        - **Nama** (Nama Lengkap Mahasiswa)
        - **NIM** (Nomor Induk Mahasiswa - *Must be unique*)
        - **Fakultas** (Fakultas Mahasiswa)
        - **Prodi** (Program Studi Mahasiswa)
        - **UKM** (Pilihan 1 UKM yang ingin didaftari)
     3. **User Lama:** Langsung masuk ke Dashboard untuk melihat status persetujuan UKM yang dipilih.

2. **Aturan Ketat 1 Mahasiswa = 1 Akun (Single Account Enforcement):**
   - **Constraint Nomor HP:** 1 Nomor HP hanya dapat dipakai oleh 1 akun pengguna (`UNIQUE(no_hp)`).
   - **Constraint NIM:** 1 NIM hanya dapat terdaftar 1 kali dalam sistem (`UNIQUE(nim)`).
   - **Pencegahan Akun Ganda:** Jika seseorang mencoba mendaftar profil baru dengan NIM yang sudah ada di database (meski nomor HP berbeda), sistem menolak dengan pesan *"NIM sudah terdaftar pada akun lain"*.

3. **Aturan Ketat 1 Mahasiswa = 1 UKM (Single UKM Enforcement):**
   - Setiap mahasiswa **hanya diperbolehkan mendaftar di 1 UKM**.
   - **Mekanisme Pencegahan Berlapis:**
     1. **Layer UI (Frontend):** Jika mahasiswa memiliki status pendaftaran `PENDING` atau `ACCEPTED`, form pemilihan UKM akan dikunci (disabled) dan halaman berpindah ke *Dashboard Status Pendaftaran*.
     2. **Layer Backend (API Guard):** Sebelum insert ke tabel `pendaftaran_ukm`, backend mengecek apakah ada record dengan status `PENDING` atau `ACCEPTED`. Jika ada, server melempar error `HTTP 422 Unprocessable Entity`.
     3. **Layer Database (Constraint):** Menjaga integritas data agar tidak terjadi *race condition* pendaftaran ganda secara bersamaan.
   - **Kondisi Pergantian UKM:** Mahasiswa baru bisa memilih UKM lain jika pendaftaran sebelumnya berstatus `REJECTED` (Ditolak) atau `CANCELLED` (Dibatalkan).

4. **Alur Persetujuan (Approval Workflow):**
   - **State Machine Pendaftaran:**
     - `PENDING` (Baru mendaftar, menunggu verifikasi pengurus/pembina).
     - `ACCEPTED` (Disetujui, resmi menjadi anggota UKM).
     - `REJECTED` (Ditolak, dilengkapi catatan alasan).
   - **Aktor Penyetuju (Approver):** Pengurus UKM / Pembina UKM.

---

## 4. Usulan Skema Database & Constraint

### A. Tabel Utama

1. **`users`** (Akun Pengguna)
   - `id` (PK, UUID / Auto Increment)
   - `no_hp` (VARCHAR, UNIQUE, Indexed, Nullable - *Primary login identifier saat ini*)
   - `sso_id` (VARCHAR, UNIQUE, Nullable, Indexed - *Untuk integrasi SSO masa depan*)
   - `auth_provider` (ENUM: `'OTP'`, `'SSO'`, default `'OTP'`)
   - `role` (ENUM: `'mahasiswa'`, `'pengurus_ukm'`, `'pembina'`, `'super_admin'`)
   - `is_profile_completed` (BOOLEAN, default `false`)
   - `created_at`, `updated_at`

2. **`otp_codes`** (Penyimpanan & Validasi Kode OTP)
   - `id` (PK)
   - `no_hp` (VARCHAR, Indexed)
   - `code` (VARCHAR / Hashed 6-digit OTP)
   - `expired_at` (DATETIME - Misal 5 menit)
   - `is_used` (BOOLEAN, default `false`)
   - `attempts` (INT, default `0`, Max 3-5 kali percobaan)
   - `created_at`

3. **`mahasiswa`** (Profil Mahasiswa)
   - `id` (PK)
   - `user_id` (FK -> `users.id`, UNIQUE)
   - `nama` (VARCHAR)
   - `nim` (VARCHAR, UNIQUE - *Guarantees 1 Student = 1 Profile*)
   - `fakultas` (VARCHAR)
   - `prodi` (VARCHAR)
   - `created_at`, `updated_at`

4. **`ukm`** (Data UKM)
   - `id` (PK)
   - `nama_ukm` (VARCHAR)
   - `slug` (VARCHAR, UNIQUE)
   - `deskripsi` (TEXT)
   - `logo` (VARCHAR)
   - `status_pendaftaran` (ENUM: `'open'`, `'closed'`)

5. **`pengurus_ukm` / `pembina`** (Relasi Akun ke UKM)
   - `id` (PK)
   - `user_id` (FK -> `users.id`)
   - `ukm_id` (FK -> `ukm.id`)
   - `nip_or_id` (VARCHAR)

6. **`pendaftaran_ukm`** (Transaksi Pendaftaran)
   - `id` (PK)
   - `mahasiswa_id` (FK -> `mahasiswa.id`)
   - `ukm_id` (FK -> `ukm.id`)
   - `status` (ENUM: `'PENDING'`, `'ACCEPTED'`, `'REJECTED'`, `'CANCELLED'`)
   - `catatan_penolakan` (TEXT, nullable)
   - `approved_by` (FK -> `users.id`, nullable)
   - `approved_at` (DATETIME, nullable)
   - `created_at`, `updated_at`

---

## 5. Rekomendasi Fitur Keamanan & Validasi Tambahan

1. **Pengamanan OTP (Rate Limiting & Cooldown):**
   - **Cooldown Resend:** Minimum 60 detik sebelum user dapat meminta OTP baru.
   - **Max OTP Request:** Maksimal 3-5 permintaan OTP per nomor per jam.
   - **Expiration Time:** Kode OTP hanya berlaku selama 3 - 5 menit.

2. **Proteksi Integritas Data (1 Akun & 1 UKM):**
   - **Aturan 1 Akun:** `UNIQUE(no_hp)` pada `users` + `UNIQUE(nim)` pada `mahasiswa`.
   - **Aturan 1 UKM:**
     Query validasi backend sebelum insert:
     ```sql
     SELECT COUNT(*) FROM pendaftaran_ukm 
     WHERE mahasiswa_id = :mahasiswa_id AND status IN ('PENDING', 'ACCEPTED');
     ```
     Jika `COUNT > 0`, lempar HTTP Error 422: *"Anda sudah terdaftar atau memiliki pendaftaran aktif di UKM lain."*

3. **Verifikasi Alasan Penolakan:**
   - Menyediakan kolom input alasan penolakan agar mahasiswa paham mengapa pendaftarannya ditolak.

---

## 6. Prinsip Keandalan Sistem (Google Forms-Level Reliability)

Untuk memastikan sistem se-reliable Google Forms dalam menangani lonjakan pendaftaran mahasiswa tanpa data hilang atau *server crash*:

### A. Resiliensi Client-Side (Frontend & Formulir)
1. **Auto-Save Draft (Penyimpanan Lokal Otomatis):**
   - Saat mahasiswa mengisi form (Nama, NIM, Fakultas, Prodi, UKM), data disimpan secara otomatis ke `localStorage` browser secara *real-time*.
   - Jika HP mati, browser tertutup, atau sinyal terputus, data tidak hilang dan otomatis terisi kembali saat halaman dibuka ulang.
2. **Anti Double-Submit (Idempotency Key):**
   - Tombol "Kirim Pendaftaran" otomatis di-disable seketika saat diklik untuk mencegah klik ganda (*double-click spam*).
   - Setiap pengiriman formulir menyertakan **Idempotency Token / Request UUID**. Jika request yang sama terkirim 2 kali akibat koneksi lambat, server hanya memproses request pertama.
3. **Validasi Real-Time (Instant Feedback):**
   - Format nomor HP, panjang NIM, dan kelengkapan field divalidasi langsung di browser sebelum request dikirim ke backend.

### B. Resiliensi Server-Side & Database (Backend & Concurrency)
1. **Transaksi Atomik (Atomic Database Transactions):**
   - Proses pembuatan akun `users`, pembuatan profil `mahasiswa`, dan pengajuan `pendaftaran_ukm` dibungkus dalam **1 Database Transaction (`BEGIN ... COMMIT`)**. Jika terjadi kegagalan di tengah jalan, seluruh perubahan akan di-*rollback* total sehingga tidak ada *dirty data*.
2. **Pencegahan Race Condition (Row-Level Locking):**
   - Saat mengecek batasan 1 UKM di bawah beban trafik tinggi (ratusan mahasiswa mendaftar bersamaan), query menggunakan `SELECT ... FOR UPDATE` atau *Atomic Constraint* agar tidak ada race condition.
3. **Pencegahan Overload Server (Graceful Rate Limiting & Queue):**
   - API dilindungi oleh *Rate Limiter* (misal max 60 request/menit per IP) untuk mencegah bot/attack.
   - Pesan error disajikan dengan jelas dan ramah user (contoh: *"Koneksi terganggu, mencoba mengirim ulang dalam 5 detik..."*).

---

## 7. Kesiapan Skalabilitas & Integrasi SSO Masa Depan (Future-Proof SSO)

### A. Kesiapan Integrasi SSO Kampus (Zero Refactoring Core Logic)
1. **Auth Strategy / Adapter Pattern:**
   - Modul autentikasi dibungkus menggunakan antarmuka terpisah (`AuthServiceInterface`).
   - Mode saat ini: `PhoneOTPAuthProvider`.
   - Mode SSO nanti: `UnesaSSOAuthProvider` (OAuth2 / SAML / OIDC).
2. **Skema Identitas Fleksibel (`auth_provider` & `sso_id`):**
   - Kolom `sso_id` dipersiapkan di tabel `users`.
   - Ketika SSO UNESA sudah aktif, mahasiswa cukup memilih *"Login via SSO UNESA"*. Sistem akan mengambil `NIM` & profil dari SSO, lalu memetakan (*account linking*) ke record `mahasiswa` yang sudah ada atau membuatkan profil baru secara otomatis tanpa merusak data pendaftaran UKM yang sudah berjalan.

### B. Skalabilitas Tinggi (High Scalability Architecture)
1. **Stateless Authentication (JWT / Session Store):**
   - Autentikasi menggunakan JWT Token atau Redis Session Store, sehingga instance server backend dapat di-*scale horizontally* (ditambah instance server baru di belakang Load Balancer) tanpa ada masalah session hilang.
2. **Caching Layer (Redis):**
   - Daftar UKM, status pendaftaran terbuka/tutup, dan rate limit OTP disimpan di Redis Cache agar backend tidak perlu terus-menerus membebankan query ke Database utama.
3. **Database Indexing Strategy:**
   - Indexing dilakukan pada kolom kritis: `users.no_hp`, `users.sso_id`, `mahasiswa.nim`, `pendaftaran_ukm.mahasiswa_id`, dan `pendaftaran_ukm.status`.
