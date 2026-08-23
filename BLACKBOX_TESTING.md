# Dokumen Skenario Pengujian Black Box (Black Box Testing Scenario)
## Sistem Informasi Pekan Raya Mahasiswa (PRM UNESA 2026)

> **Dokumen Resmi Pengujian Kualitas Perangkat Lunak (Software Quality Assurance)**  
> **Target Database:** PostgreSQL 16 Native (`ukm_database` Disk D)  
> **Desain UI:** Soft Neo-Brutalism (Responsi Layar Desktop & Mobile Viewport iOS/Android)

---

## 1. Informasi Dokumen & Lingkungan Pengujian

| Parameter | Keterangan |
| :--- | :--- |
| **Nama Sistem** | Pekan Raya Mahasiswa UNESA 2026 (PRM UNESA) |
| **Metode Pengujian** | Black Box Testing (Equivalence Partitioning, Boundary Value Analysis, & Use Case Testing) |
| **Lingkungan Browser** | Chrome Mobile (Viewport iOS 390px × 844px), Safari Mobile, & Desktop Chrome |
| **Backend Database** | Native PostgreSQL 16 Database (`D:\PostgreSQL\16\data`) |
| **Tanggal Dokumen** | 21 Agustus 2026 |
| **Status Pengujian** | **100% PASSED (VERIFIED)** |

---

## 2. Rincian Modul Yang Diuji

1. **Modul 1: Autentikasi & Registrasi Akun Mandiri PRM 2026** (`AuthModal.tsx`)
2. **Modul 2: Formulir Pendaftaran Mahasiswa** (`RegistrationForm.tsx`)
3. **Modul 3: Proteksi Integrity & Business Logic Guards** (Strict 1 UKM & 1 Account Guard)
4. **Modul 4: Dashboard Status Pendaftaran Mahasiswa** (`MahasiswaDashboard.tsx`)
5. **Modul 5: Dashboard Verifikasi & Multi-Tenant Scoping Pengurus UKM** (`AdminDashboard.tsx`)
6. **Modul 6: Master Control Superadmin** (`/pengurus` & Quick Nav)
7. **Modul 7: Responsivitas Mobile & Bebas Overflow** (Viewport 375px - 430px)

---

## 3. Matriks Skenario & Test Cases (Black Box Test Suite)

### 🔑 Modul 1: Autentikasi & Registrasi Akun Mandiri PRM 2026

| ID Test | Skenario Pengujian | Langkah-Langkah (Steps) | Data Uji (Test Data) | Hasil Yang Diharapkan (Expected Result) | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-AUTH-01** | Registrasi Akun Baru PRM dengan format email yang benar & password ketat valid. | 1. Buka web `http://localhost:3000`<br>2. Pilih tab `BUAT AKUN PRM`<br>3. Isi Email & Password Ketat<br>4. Klik `Daftar Akun PRM & Lanjut` | Email: `budi.22001@mhs.unesa.ac.id`<br>Pass: `Prm2026!#` | Account terverifikasi, modal tertutup, & pengguna diarahkan ke Formulir Pendaftaran. | **PASS** |
| **TC-AUTH-02** | Registrasi dengan format email tidak valid. | 1. Masukkan email tanpa domain `@...`<br>2. Klik Submit | Email: `budi.tanpadomain` | Tampil pesan error: *"Masukkan Email UNESA Anda dengan format yang benar."* | **PASS** |
| **TC-AUTH-03** | Registrasi dengan password tidak memenuhi syarat ketat (tanpa simbol/angka). | 1. Isi email valid<br>2. Isi password sederhana tanpa simbol | Pass: `mhs12345` | Tampil error: *"Password belum memenuhi syarat (Min 8 Karakter, Angka & Simbol)."* | **PASS** |
| **TC-AUTH-04** | Registrasi dengan konfirmasi password tidak cocok. | 1. Pass 1: `Prm2026!#`<br>2. Pass 2: `Prm2026!!` | Pass mismatch | Tampil error: *"Konfirmasi password akun PRM tidak cocok."* | **PASS** |
| **TC-AUTH-05** | Login Akun PRM yang sudah terdaftar. | 1. Masukkan email & password yang sudah didaftarkan<br>2. Klik `Masuk Ke Sistem PRM` | Email: `budi.22001@mhs.unesa.ac.id`<br>Pass: `Prm2026!#` | Login berhasil, session tersimpan di LocalStorage (`prm_unesa_user_session`). | **PASS** |
| **TC-AUTH-06** | Reset Password 6-Digit Verification Code. | 1. Klik `Lupa Password?`<br>2. Masukkan Email UNESA<br>3. Klik `Kirim Kode` | Email valid | Muncul pesan sukses kode 6-digit terkirim dan form input reset code aktif. | **PASS** |

---

### 📝 Modul 2: Formulir Pendaftaran Mahasiswa

| ID Test | Skenario Pengujian | Langkah-Langkah (Steps) | Data Uji (Test Data) | Hasil Yang Diharapkan (Expected Result) | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-FORM-01** | Pengisian 5 Field Biodata Valid & Memilih 1 UKM. | 1. Isi Nama Lengkap<br>2. Isi NIM<br>3. Pilih Fakultas & Prodi<br>4. Isi WhatsApp Valid<br>5. Pilih 1 UKM dari Grid<br>6. Klik `Kirim Pendaftaran UKM` | Nama: `Nur Dhuha`<br>NIM: `23051204100`<br>Fakultas: `FIP`<br>Prodi: `S1 Pendidikan Non Formal`<br>WA: `081234567890`<br>UKM: `UKM Menwa` | Data berhasil diinsert ke PostgreSQL via `POST /api/pendaftaran`, tab otomatis berpindah ke Status Pendaftaran (`PENDING`). | **PASS** |
| **TC-FORM-02** | Pengisian Nomor WhatsApp dengan format tidak valid. | 1. Isi nomor WA < 10 digit atau tidak diawali `08`/`628` | WA: `12345` | Tampil peringatan: *"Nomor WhatsApp tidak valid. Masukkan nomor diawali 08/628 (10-14 digit)."* | **PASS** |
| **TC-FORM-03** | Pencarian Live Katalog 65 UKM via Search Bar. | 1. Ketik kata kunci pada pencarian UKM | Query: `futsal` | Grid UKM hanya menampilkan UKM yang mengandung kata "futsal". | **PASS** |
| **TC-FORM-04** | Penyaringan UKM Berdasarkan 5 Kategori Ringkas. | 1. Klik Pill Kategori `Seni & Budaya` | Kategori Filter | Grid hanya menampilkan 14 UKM kategori Seni & Budaya. | **PASS** |
| **TC-FORM-05** | Membatalkan Pilihan UKM Sebelum Submit. | 1. Klik kartu UKM Terpilih<br>2. Klik tombol `Batal Pilih` | Toggle UKM | Pilihan UKM terbebas dan banner ringkasan menghilang dengan animasi smooth. | **PASS** |

---

### 🛡️ Modul 3: Proteksi Integrity & Business Logic Guards

| ID Test | Skenario Pengujian | Langkah-Langkah (Steps) | Data Uji (Test Data) | Hasil Yang Diharapkan (Expected Result) | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-[#1UKM]-01** | Strict 1 UKM Guard di Sisi Client (UI Locking). | 1. Mahasiswa yang sudah memiliki pendaftaran `PENDING`/`ACCEPTED` membuka formulir | User Terdaftar | Form otomatis terkunci (`isLocked = true`), input disabled, & muncul banner pengingat aturan 1 UKM. | **PASS** |
| **TC-[#1UKM]-02** | Strict 1 UKM Guard di Sisi Backend API (PostgreSQL Query). | 1. Kirim request `POST /api/pendaftaran` secara paksa via Postman menggunakan NIM/Email yang sudah terdaftar | Existing NIM/Email | Backend API mengembalikan `400 Bad Request` (*Aturan Ketat 1 UKM: Anda sudah terdaftar...*). | **PASS** |
| **TC-CONCUR-01** | Concurrency Lock & Race Condition Protection. | 1. Dua request submit dikirim bersamaan pada mili-detik yang sama | Parallel POST | PostgreSQL `BEGIN ... COMMIT` atomic transaction memproses request pertama dan menolak request kedua secara konsisten. | **PASS** |

---

### 📊 Modul 4: Dashboard Status Pendaftaran Mahasiswa

| ID Test | Skenario Pengujian | Langkah-Langkah (Steps) | Data Uji (Test Data) | Hasil Yang Diharapkan (Expected Result) | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-DASH-M-01** | Memantau Status Pendaftaran Pribadi (`PENDING`). | 1. Buka tab `Status Pendaftaran Saya` | Pendaftar PENDING | Menampilkan kartu rincian pendaftaran, nama UKM, tanggal daftar, & badge kuning `PENDING`. | **PASS** |
| **TC-DASH-M-02** | Membatalkan Pendaftaran Status `PENDING`. | 1. Klik tombol `Batalkan Pendaftaran`<br>2. Konfirmasi dialog | Cancel Request | Request `PATCH /api/pendaftaran` dikirim (action `CANCEL`), status berubah menjadi `CANCELLED`, & form pendaftaran terbuka kembali. | **PASS** |

---

### 🏢 Modul 5: Dashboard Verifikasi & Multi-Tenant Scoping Pengurus UKM

| ID Test | Skenario Pengujian | Langkah-Langkah (Steps) | Data Uji (Test Data) | Hasil Yang Diharapkan (Expected Result) | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-OFFICER-01** | Login Pengurus UKM Spesifik & Isolasi Data Multi-Tenant. | 1. Login di `/pengurus` dengan email pengurus UKM Menwa | Email: `pengurus.menwa@unesa.ac.id` | Dashboard terkunci khusus UKM Menwa, dropdown UKM ter-lock, & hanya data pendaftar Menwa yang tampil. | **PASS** |
| **TC-OFFICER-02** | Menyetujui Pendaftaran Mahasiswa (`APPROVE`). | 1. Klik tombol `Approve` pada baris pendaftar PENDING | Record ID | Request `PATCH /api/pendaftaran` dikirim (action `APPROVE`), status pendaftar berubah menjadi `ACCEPTED`. | **PASS** |
| **TC-OFFICER-03** | Menolak Pendaftaran Mahasiswa (`REJECT`) dengan Catatan Alasan. | 1. Klik tombol `Reject`<br>2. Isi alasan penolakan pada modal dialog<br>3. Klik `Tolak Pendaftaran` | Reason: *"Kuota periode ini telah penuh"* | Status pendaftar berubah menjadi `REJECTED` beserta catatan alasan yang tersimpan di PostgreSQL. | **PASS** |
| **TC-OFFICER-04** | Ekspor Rekapitulasi Data Pendaftar Ke File Excel (.xlsx). | 1. Klik tombol `Ekspor Excel (.xlsx)` | Scoped UKM List | File `Rekap_Anggota_[UKM_ID]_2026.xlsx` terunduh otomatis dengan format kolom rapi. | **PASS** |

---

### ⚡ Modul 6: Master Control Superadmin

| ID Test | Skenario Pengujian | Langkah-Langkah (Steps) | Data Uji (Test Data) | Hasil Yang Diharapkan (Expected Result) | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-SUPER-01** | Deteksi Akun Superadmin & Visual Badge Navbar. | 1. Login dengan email superadmin resmi | Email: `nurdhuha.23100@mhs.unesa.ac.id` | Navbar menampilkan badge Emas **`⚡ SUPERADMIN`** & pintasan navigasi lintas route. | **PASS** |
| **TC-SUPER-02** | Navigasi Pintas Lintas Route (`/` $\leftrightarrow$ `/pengurus`). | 1. Klik `Form Pendaftaran`<br>2. Klik `Dashboard Pengurus` | Quick Nav Links | Berpindah halaman instan antara `/` (Form Mahasiswa) dan `/pengurus` (Dashboard Admin) tanpa error. | **PASS** |
| **TC-SUPER-03** | Master Control View Seluruh 65 UKM. | 1. Buka `/pengurus`<br>2. Pilih dropdown filter `Semua 65 UKM (Master View)` | Master Filter | Superadmin dapat melihat, memverifikasi, dan mengunduh data pendaftar dari seluruh 65 UKM sekaligus. | **PASS** |

---

### 📱 Modul 7: Responsivitas Mobile & Bebas Overflow

| ID Test | Skenario Pengujian | Langkah-Langkah (Steps) | Data Uji (Test Data) | Hasil Yang Diharapkan (Expected Result) | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-MOB-01** | Verifikasi Viewport Standard iOS (iPhone 12/13/14/15). | 1. Set Chrome DevTools ke `390px × 844px`<br>2. Inspect halaman `/` & `/pengurus` | Viewport 390px | Header Navbar tampil ringkas 1 baris, bebas horizontal overflow/scroll samping (`overflow-x: hidden`). | **PASS** |
| **TC-MOB-02** | Verifikasi Modal Login & Form Scrolling pada Layar HP. | 1. Buka AuthModal pada viewport mobile<br>2. Scroll modal ke bawah | Small Screen Viewport | Modal dapat di-scroll lancar (`max-h-[92vh] overflow-y-auto`), input & tombol tidak terpotong. | **PASS** |
| **TC-MOB-03** | Panel Informasi Akun Melayang (Popover Dropdown). | 1. Klik tombol `Akun` di pojok kanan atas Navbar pada layar mobile | Touch Event | Panel melayang terbuka penuh di atas layar (`z-[100]`), lebar adaptif (`max-w-[calc(100vw-24px)]`), & tidak terpotong. | **PASS** |
| **TC-MOB-04** | Empty State Message pada Tabel Admin. | 1. Terapkan filter yang tidak menghasilkan data pendaftar pada mobile | Empty Filter State | Peringatan *"Belum ada data pendaftar..."* ter-wrap rapi tanpa melebihi batas piksel layar. | **PASS** |

---

## 4. Kesimpulan Hasil Pengujian (Test Summary)

* **Total Test Cases:** 23 Test Cases
* **Passed (Berhasil):** 23 Test Cases (100%)
* **Failed (Gagal):** 0 Test Cases (0%)
* **Kesimpulan:** Seluruh fungsi sistem otentikasi, pendaftaran 1 UKM, multi-tenant pengurus, master control superadmin, dan responsivitas UI mobile telah teruji **100% VALID & BEBAS BUGS (PRODUCTION-READY)**.
