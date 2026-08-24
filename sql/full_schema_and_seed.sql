-- ==============================================================================
-- SKEMA STRUKTUR LENGKAP & SEEDING DATA RESMI PEKAN RAYA MAHASISWA (PRM UNESA)
-- Target Database: ukm_database (PostgreSQL 16 Native)
-- ==============================================================================

-- 1. TABEL USERS (Autentikasi Email UNESA & Strict Password)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'mahasiswa',
    is_profile_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABEL FAKULTAS
CREATE TABLE IF NOT EXISTS fakultas (
    id SERIAL PRIMARY KEY,
    nama_fakultas VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABEL PROGRAM STUDI (119 PRODI)
CREATE TABLE IF NOT EXISTS program_studi (
    id SERIAL PRIMARY KEY,
    fakultas_id INT NOT NULL REFERENCES fakultas(id) ON DELETE CASCADE,
    nama_prodi VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_prodi_per_fakultas UNIQUE (fakultas_id, nama_prodi)
);

-- 4. TABEL MAHASISWA (Profil & Constraint 1 NIM = 1 Profile)
CREATE TABLE IF NOT EXISTS mahasiswa (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    nama VARCHAR(255) NOT NULL,
    nim VARCHAR(50) UNIQUE NOT NULL,
    fakultas VARCHAR(255) NOT NULL,
    prodi VARCHAR(255) NOT NULL,
    no_hp VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. TABEL UKM (Katalog 65 UKM Resmi UNESA - 5 Kategori Jelas)
CREATE TABLE IF NOT EXISTS ukm (
    id VARCHAR(50) PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    kategori VARCHAR(100) NOT NULL,
    deskripsi TEXT NOT NULL,
    logo VARCHAR(50) DEFAULT 'UKM',
    pembina VARCHAR(255) DEFAULT 'UNESA',
    status VARCHAR(20) DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. TABEL PENGURUS UKM (Scoped Isolation per UKM)
CREATE TABLE IF NOT EXISTS pengurus_ukm (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    ukm_id VARCHAR(50) REFERENCES ukm(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. TABEL PENDAFTARAN UKM (Transaksi Pendaftaran & State Machine Approval)
CREATE TABLE IF NOT EXISTS pendaftaran_ukm (
    id VARCHAR(50) PRIMARY KEY,
    mahasiswa_id UUID NOT NULL REFERENCES mahasiswa(id) ON DELETE CASCADE,
    ukm_id VARCHAR(50) NOT NULL REFERENCES ukm(id) ON DELETE CASCADE,
    ukm_nama VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    catatan_penolakan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES UNTUK PERFORMA QUERY
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_mahasiswa_nim ON mahasiswa(nim);
CREATE INDEX IF NOT EXISTS idx_pendaftaran_mahasiswa_id ON pendaftaran_ukm(mahasiswa_id);
CREATE INDEX IF NOT EXISTS idx_pendaftaran_status ON pendaftaran_ukm(status);

-- 7. SEEDING KATALOG 81 UKM RESMI UNESA DENGAN NAMA PEMBINA ASLI
INSERT INTO ukm (id, nama, kategori, deskripsi, logo, pembina) VALUES
    ('ukm-1', 'UKM Musabaqoh Tilawatil Qur''an Unesa', 'Kerohanian', 'Pengembangan seni baca, hafalan, & kandungan Al-Qur''an mahasiswa UNESA.', '📖', 'Prof. Dr. Hj. Mutimmatul Faidah. S.Ag., M.Ag'),
    ('ukm-2', 'UKM Rebana Unesa', 'Kerohanian', 'Seni musik islami rebana, shalawat, & kebudayaan bernuansa religi.', '🪘', 'Muhammad Wahyu Ariyanto, S.Pd., M.S.M.'),
    ('ukm-3', 'UKM Unit Kegiatan Kerohanian Hindu (UKKH) Unesa', 'Kerohanian', 'Wadah kegiatan keagamaan, nilai dharma, & kebudayaan mahasiswa Hindu.', '🛕', 'Dr. I Nengah Mariasa, M. Hum'),
    ('ukm-4', 'UKM Unit Kegiatan Kerohanian Islam (UKKI) Unesa', 'Kerohanian', 'Pusat pembinaan karakter, dakwah, & kegiatan keislaman kampus UNESA.', '🕌', 'Prof. Dr. H. Muhammad Turhan Yani, M.A.'),
    ('ukm-5', 'UKM Unit Kegiatan Kerohanian Katolik (UK3) Unesa', 'Kerohanian', 'Wadah persekutuan, iman, & pengabdian mahasiswa Katolik UNESA.', '⛪', 'Eufrasia Kartika H, M.Sos.'),
    ('ukm-6', 'UKM Unit Kegiatan Kerohanian Kristen Protestan (UK3P) Unesa', 'Kerohanian', 'Persekutuan ibadah & pembinaan kerohanian mahasiswa Kristen Protestan.', '✝️', 'Dr. Anung Priambodo, S.Pd., M.Psi.T.'),
    ('ukm-7', 'UKM Kewirausahaan Unesa', 'Penalaran & Keilmuan', 'Inkubator bisnis mahasiswa, bazaar UMKM, & pengembangan karya wirausaha.', '💼', 'Dr. Ahmad Bashri, S.Pd., M.Si'),
    ('ukm-8', 'UKM Riset & Demokrasi', 'Penalaran & Keilmuan', 'Kajian ilmiah, riset kebangsaan, kepemimpinan, & isu-isu demokrasi.', '📊', 'Dr. Moch. Mubarok Muharam, M.IP'),
    ('ukm-9', 'UKM Student Entrepreneurship Laboratory (SEL) Unesa', 'Penalaran & Keilmuan', 'Laboratorium kewirausahaan & inkubator ide bisnis inovatif mahasiswa.', '🔬', 'Dr. Haryo Kunto Wibisono, S.AP. M.AP'),
    ('ukm-10', 'UKM Unit Kegiatan Ilmiah Mahasiswa (UKIM) Unesa', 'Penalaran & Keilmuan', 'Pembinaan Karya Tulis Ilmiah (KTI), riset, & kompetisi penalaran mahasiswa.', '📖', 'Muamar Zainul Arif, S.Pd., M.Pd'),
    ('ukm-11', 'UKM Band dan Dangdut', 'Seni & Budaya', 'Wadah eksplorasi musik band pop, rock, indie, & dangdut kreatif mahasiswa.', '🎸', 'Marda Putra Mahendra, S.Pd., M.Pd'),
    ('ukm-12', 'UKM Brass and Woodwind Ansambel', 'Seni & Budaya', 'Ansambel instrumen tiup logam & kayu berstandar konser pertunjukan.', '🎺', 'Radhitya Mukti Prabasumirat, S.Sn M.Sn'),
    ('ukm-13', 'UKM Gamelan Sawunggaling', 'Seni & Budaya', 'Pelestarian seni karawitan gamelan Jawa & ekspresi musik tradisional.', '🪘', 'Dr. Joko Winarko, S.Sn.,M.Sn'),
    ('ukm-14', 'UKM Gita Pramawisesa Unesa / Seni Vokal Jawa', 'Seni & Budaya', 'Marching Band kebanggaan UNESA & pelestarian seni vokal tembang Jawa.', '🎶', 'Budi Dharmawanputra, S.Pd., M.Pd.'),
    ('ukm-15', 'UKM Keroncong Unesa', 'Seni & Budaya', 'Pelestarian & aransemen musik keroncong Indonesia klasik dan modern.', '🪕', 'Moh Sarjoko, S.Sn.,M.Pd.'),
    ('ukm-16', 'UKM Pantomime Education Center (PEC)', 'Seni & Budaya', 'Seni pertunjukan gestur olah tubuh pantomim & ekspresi mimik panggung.', '🎭', 'Dr. Indar Sabri, S.Sn., M.Pd.'),
    ('ukm-17', 'UKM Piano Keysmate', 'Seni & Budaya', 'Komunitas pianis, pembinaan teknik permainan piano klasik, pop, & jaz.', '🎹', 'Raden Roro Maha Kalyana Mitta Anggoro, S.Pd., M.Pd.'),
    ('ukm-18', 'UKM Reyog Laskar Sawunggaling', 'Seni & Budaya', 'Pelestarian kesenian budaya Reog Ponorogo Laskar Sawunggaling UNESA.', '🦁', 'Dr. Setyo Yanuartuti, M.Si'),
    ('ukm-19', 'Gita Swara Lestari', 'Seni & Budaya', 'Paduan seni suara, vokal harmoni, & penampilan seni musik mahasiswa.', '🎤', 'Danang Wijoyanto, S.Pd., M.Pd.'),
    ('ukm-20', 'UKM Stand Up Comedy Unesa (SUCOU)', 'Seni & Budaya', 'Komunitas komedi tunggal (Stand Up), penulisan naskah humor, & penampilan komika.', '🎙️', 'Dr. Welly Suryandoko, S.Pd., M.Pd.'),
    ('ukm-21', 'UKM Tari Unesa', 'Seni & Budaya', 'Pengembangan seni tari tradisional Nusantara, kontemporer, & koreografi baru.', '💃', 'Sekar Alit Santya Putri, S.Pd, M.Sn'),
    ('ukm-22', 'UKM Drama Tradisional Jawa', 'Seni & Budaya', 'Seni pementasan drama tradisional Ludruk, Ketoprak, & wayang orang Jawa.', '📜', 'Yohan Susilo, S.Pd., M.Pd.'),
    ('ukm-23', 'UKM Teater Institut Unesa', 'Seni & Budaya', 'Pementasan teater modern, eksplorasi keaktoran, & produksi seni pertunjukan.', '🎭', 'Dr. Arif Hidajad, S.Sn, M.Pd'),
    ('ukm-24', 'UKM UK-PSM (Unit Kegiatan Paduan Suara dan Musik)', 'Seni & Budaya', 'Paduan suara mahasiswa berprestasi nasional & kompetisi internasional UNESA.', '🎵', 'Amirul Arif, S.Pd., M.Ak.'),
    ('ukm-25', 'UKM Unesa String Chamber (USC)', 'Seni & Budaya', 'Ensemble musik gesek biola, viola, & cello klasik mahasiswa UNESA.', '🎻', 'Vivi Ervina Dewi, S.Pd., M.Pd.'),
    ('ukm-26', 'UKM Unesa Symphony Orchestra (USO)', 'Seni & Budaya', 'Orkestra simfoni lengkap UNESA pengisi acara wisuda & konser besar.', '🎷', 'Harpang Yudha Karyawanto, S.Pd., M.Pd.'),
    ('ukm-27', 'UKM Senam Aerobik Unesa', 'Olahraga', 'Klub olahraga senam ritmik, aerobik fitnes, & kebugaran jasmani.', '🤸', 'Drs. Ika Jayadi M.Kes'),
    ('ukm-28', 'UKM Atletik Unesa', 'Olahraga', 'Pembinaan atlet lari sprint, maraton, lompat jauh, & lempar lembing.', '🏃', 'Fifit Yeti Wulandari, S.PD., M.Pd'),
    ('ukm-29', 'UKM Badminton Unesa', 'Olahraga', 'Klub olahraga bulutangkis tunggal & ganda berprestasi nasional.', '🏸', 'Dr. Oce Wiriawan, M.Kes.'),
    ('ukm-30', 'UKM Berkuda Unesa', 'Olahraga', 'Klub olahraga berkuda equestrian ketangkasan & tunggang serasi UNESA.', '🐎', 'Diva Ristie Valentina, S.Pd., M.Pd.'),
    ('ukm-31', 'UKM Bola Basket Unesa', 'Olahraga', 'Tim bola basket putra & putri kompetisi mahasiswa antar perguruan tinggi.', '🏀', 'Billy Emir Rizkanto, S.Or., M.Or'),
    ('ukm-32', 'UKM Bola Tangan Unesa', 'Olahraga', 'Cabang olahraga handball lapangan cepat & kejuaraan daerah/nasional.', '🤾', 'A Burhanuddin Kusuma N., S.pd., M.kes'),
    ('ukm-33', 'UKM Cricket', 'Olahraga', 'Cabang olahraga kriket pemukul bola outdoor & turnamen mahasiswa.', '🏏', 'Dr. Hijrin Fithroni, S.Or., M.Pd'),
    ('ukm-34', 'UKM E-Sport Unesa', 'Olahraga', 'Wadah pembinaan atlet esports kompetitif MLBB, Valorant, PUBG, & Dota.', '🎮', 'Adiwignya Nugraha Widhi Harita, M.Si.'),
    ('ukm-35', 'UKM Floorball Unesa', 'Olahraga', 'Komunitas cabang olahraga hoki ruangan dengan stik & bola berlubang.', '🏒', 'Prof. Dr. Agus Hariyanto, M.Kes'),
    ('ukm-36', 'UKM Futsal Unesa', 'Olahraga', 'Tim bola futsal prestasi tinggi putra & putri kejuaraan nasional.', '⚽', 'Rizky Muhammad Sidik, S.Pd., M.Ed.'),
    ('ukm-37', 'UKM Hapkido Unesa', 'Olahraga', 'Seni bela diri Hapkido gabungan kuncian, lemparan, & tendangan presisi.', '🥋', 'Prof. Dr. Setiyo Hartoto, M,Kes.'),
    ('ukm-38', 'UKM Hockey Unesa', 'Olahraga', 'Cabang olahraga hoki lapangan outdoor & hoki ruangan kompetitif.', '🏑', 'Dr. Mohammad Faruk, S.Pd., M.Ked'),
    ('ukm-39', 'UKM Judo', 'Olahraga', 'Seni bela diri Judo bantingan, kuncian lantai, & olahraga olimpiade.', '🥋', 'Muhamad Fauzi Antoni, S.Pd., M.Kes.'),
    ('ukm-40', 'UKM Ju-Jitsu Unesa', 'Olahraga', 'Seni bela diri Ju-Jitsu pertahanan diri praktis & kuncian sendi.', '🥋', 'Saiful Anwar, S.Pd. M.T.'),
    ('ukm-41', 'UKM Karate Unesa', 'Olahraga', 'Perguruan bela diri Karate disiplin jurus Kata & pertarungan Kumite.', '🥋', 'Dr. Afifan Yulfadinata., S.Pd., M.Pd.'),
    ('ukm-42', 'UKM Masase Unesa', 'Olahraga', 'Keahlian pemulihan terapi fisik, masase olahraga atlet, & kebugaran.', '💆', 'Dr. Joesoef Roepajadi, M.Pd.'),
    ('ukm-43', 'UKM Menembak (Silver Bullet) Unesa', 'Olahraga', 'Klub olahraga menembak sasaran senapan angin & air pistol Silver Bullet.', '🎯', 'Indra Himawan Susanto, S.Or., M.Kes.'),
    ('ukm-44', 'UKM Pagar Nusa', 'Olahraga', 'Pencak silat Pagar Nusa Nahdlatul Ulama pelestarian bela diri bangsa.', '🛡️', 'Naili Rahmah, S.T.,M.MT'),
    ('ukm-45', 'UKM Panahan BIMA Unesa', 'Olahraga', 'Pembinaan atlet olahraga panahan (archery) BIMA divisi recurve & compound.', '🏹', 'Faridha Nurhayati, S.Pd, M.Kes'),
    ('ukm-46', 'UKM Pencak Organisasi Unesa', 'Olahraga', 'Seni bela diri tradisional Pencak Organisasi warisan budaya Indonesia.', '🥋', 'Achmad Rizanul Wahyudi, S.Pd.,M.Pd.'),
    ('ukm-47', 'UKM Penggemar Catur Unesa', 'Olahraga', 'Klub olahraga strategi catur cermat, kilat, & persiapan turnamen POMNAS.', '♟️', 'Dr. Djoko Suwito M.Pd'),
    ('ukm-48', 'UKM Petanque Unesa', 'Olahraga', 'Cabang olahraga lempar bosi kayu/logam Petanque kelembutan presisi target.', '⚪', 'Yogiswara Anugrah Pamungkas, S.Pd., M.Pd.'),
    ('ukm-49', 'UKM Perisai Diri Unesa', 'Olahraga', 'Keluarga Silat Nasional Indonesia Perisai Diri komisariat UNESA.', '🛡️', 'Dr. Ari Khusuma Dewi, S.pd, M.Pd'),
    ('ukm-50', 'UKM PSHT Unesa', 'Olahraga', 'Persaudaraan Setia Hati Terate (PSHT) pencak silat komisariat UNESA.', '🥊', 'Dr. Faktur Rohman Kafrawi, M.Pd'),
    ('ukm-51', 'UKM Renang', 'Olahraga', 'Klub olahraga renang prestasi gaya bebas, dada, punggung, & kupu-kupu.', '🏊', 'Prof.Dr.Imam Marsudi. M.Si'),
    ('ukm-52', 'UKM Rugby Unesa', 'Olahraga', 'Cabang olahraga fisik ketangkasan Rugby outdoor tim UNESA.', '🏉', 'Suryanto Agung Prabowo, S.Pd., M.Pd.'),
    ('ukm-53', 'UKM Softball Baseball Unesa', 'Olahraga', 'Klub lapangan cabang olahraga softball & baseball mahasiswa UNESA.', '🥎', 'Dra. Sasminta Christina Yuli Hartati , M.Pd'),
    ('ukm-54', 'UKM Taekwondo Unesa', 'Olahraga', 'Seni bela diri Taekwondo Kyorugi & Poomsae perguruan tinggi UNESA.', '🥋', 'Dr. Irmantara Subagio, M. Kes'),
    ('ukm-55', 'UKM Tapak Suci Unesa', 'Olahraga', 'Seni bela diri Perguruan Pencak Silat Tapak Suci Putera Muhammadiyah.', '🥋', 'Hamdani, S.Pd., M.Pd.'),
    ('ukm-56', 'UKM Tenis Meja', 'Olahraga', 'Klub olahraga pingpong meja tunggal & ganda kompetisi antar kampus.', '🏓', 'Dr. Abdul Hafidz, S.Pd., M.Pd'),
    ('ukm-57', 'UKM Woodball', 'Olahraga', 'Cabang olahraga bola kayu presisi mirip golf luar ruangan.', '🪵', 'Dr. Heryanto Nur Muhammad, S.Pd., M.Pd.'),
    ('ukm-58', 'UKM Ankasa', 'Kesejahteraan & Pengabdian', 'Komunitas kedirgantaraan, keantariksaan, & pengabdian sains mahasiswa.', '🚀', 'Dr. Wiryo Nuryono, S.Pd., M.Pd'),
    ('ukm-59', 'UKM Formadiksi KIP-K Unesa', 'Kesejahteraan & Pengabdian', 'Forum Mahasiswa Penerima KIP-Kuliah & Bidikmisi Universitas Negeri Surabaya.', '🎓', 'Yuri Shintia, S.E., M.M.'),
    ('ukm-60', 'UKM Kependudukan Unesa', 'Kesejahteraan & Pengabdian', 'Edukasi isu kependudukan, Generasi Berencana (Genre), & pengabdian sosial.', '👨‍👩‍👧', 'Ali Imron S.Sos, M.A.'),
    ('ukm-61', 'UKM Peduli Disabilitas', 'Kesejahteraan & Pengabdian', 'Pendampingan, advokasi inklusivitas, & aksi sosial peduli disabilitas kampus.', '♿', 'Novia Restu Windayani, S.Pd., M.Pd'),
    ('ukm-62', 'UKM Peduli Kemanusiaan (UKMPK) Unesa', 'Kesejahteraan & Pengabdian', 'Relawan aksi kemanusiaan, tanggap bencana alam, & bantuan sosial masyarakat.', '❤️', 'Dr. Aghus Sifaq, S.Or., M.Pd.,'),
    ('ukm-63', 'UKM Aktifitas Fotografi (AFO) Unesa', 'Seni & Budaya', 'Komunitas seni fotografi, jurnalis visual, pameran foto, & fotografi dokumenter.', '📷', 'Dr. Andi Mariono, M.Pd'),
    ('ukm-64', 'UKM Broadcasting', 'Seni & Budaya', 'Pengembangan talenta penyiaran TV, podcaster, announcer, & multimedia.', '📺', 'Dr. Herma Retno Prabayanti, S.E., M.Med.Kom'),
    ('ukm-65', 'Unesa Debating Union', 'Penalaran & Keilmuan', 'Komunitas debat Bahasa Indonesia & English Parliamentary Debate prestasi nasional.', '💬', 'Sueb, S.Pd., M.Pd'),
    ('ukm-66', 'UKM Lembaga Pers Kampus Gema Unesa', 'Penalaran & Keilmuan', 'Lembaga pers mahasiswa, penerbitan majalah, Jurnalistik, & opini publik.', '📰', 'Dr. Prima Vidya Asteria S.Pd., M.Pd.'),
    ('ukm-67', 'UKM Protokoler', 'Kesejahteraan & Pengabdian', 'Korps protokol resmi wisuda, seminar nasional, & acara kedinasan Rektorat UNESA.', '🎙️', 'Febry Irsiyanto Wahyu Utomo, S.Pd., M. Pd.'),
    ('ukm-68', 'UKM Radio Stations Unesa', 'Seni & Budaya', 'Stasiun radio siaran kampus, penyiar radio, & manajemen produksi program audio.', '📻', 'Rahmanu Wijaya, S.H, M.H'),
    ('ukm-69', 'UKM HIMAPALA Unesa', 'Kesejahteraan & Pengabdian', 'Himpunan Mahasiswa Pencinta Alam jelajah hutan gunung, caving, & konservasi.', '🏔️', 'Prof. Dra. Pratiwi Retnaningdyah, M.Hum, M.A, Ph.D'),
    ('ukm-70', 'UKM Menwa 804 Unesa', 'Kesejahteraan & Pengabdian', 'Satuan Resimen Mahasiswa 804 kedisiplinan & wawasan bela negara kampus.', '🎖️', 'Dr. Theodorus Wiyanto Wibowo, M.Pd'),
    ('ukm-71', 'UKM Pramuka 413 Unesa', 'Kesejahteraan & Pengabdian', 'Racana Gugus Depan Pramuka 413 Pangeran Sambernyawa kepanduan UNESA.', '⚜️', 'Prof. Dr. Suyatno, M.Pd.'),
    ('ukm-72', 'UKM Pramuka 414 Unesa', 'Kesejahteraan & Pengabdian', 'Racana Gugus Depan Pramuka 414 Kunti Rajapatni kepanduan UNESA.', '⚜️', 'Dr. Maspiyah, M.Kes.'),
    ('ukm-73', 'UKM Korfball', 'Olahraga', 'Cabang olahraga bola keranjang tim gabungan putra & putri.', '🧺', 'Prof. Dr. Drs. Abdul Rachman Syam Tuasikal, M.Pd.'),
    ('ukm-74', 'IBCA MMA UNESA', 'Olahraga', 'Indonesian Mixed Martial Arts Association pertarungan bebas UNESA.', '🤼', 'Sri Wicahyani, M.Pd'),
    ('ukm-75', 'UKM Tarung Derajat', 'Olahraga', 'Seni bela diri praktis pertahanan diri Tarung Derajat Kodrat UNESA.', '🥊', 'Muhammad Kharis Fajar, S.Pd.,M.Pd'),
    ('ukm-76', 'UKM Sepak Bola', 'Olahraga', 'Tim olahraga sepak bola lapangan 11 lawan 11 turnamen antar kampus.', '⚽', 'Dr. David Agus Prianto, S.Pd., M.Pd.'),
    ('ukm-77', 'UKM Babbadi', 'Olahraga', 'Olahraga pertahanan diri & ketangkasan tim asal Asia.', '🤼', 'Nur Luthfiatus Solikah, S.Pd., M.Or.'),
    ('ukm-78', 'UKM Shorinji Kempo', 'Olahraga', 'Seni bela diri Shorinji Kempo disiplin embu & randori perguruan tinggi.', '🥋', 'Andri Suyoko, S.Pd., M.Kes.'),
    ('ukm-79', 'UKM Pickleball', 'Olahraga', 'Cabang olahraga kombinasi tenis, badminton, & pingpong terkini.', '🏸', 'Dr. Sapto Wibowo, S.Pd., M.Pd.'),
    ('ukm-80', 'PKM Center', 'Penalaran & Keilmuan', 'Pusat pendampingan & pembinaan Program Kreativitas Mahasiswa (PKM) PIMNAS.', '💡', 'Noor Rohmah Mayasari, Ph.D.'),
    ('ukm-81', 'UKM Imapres', 'Penalaran & Keilmuan', 'Ikatan Mahasiswa Berprestasi wadah pembinaan ajang Duta & PILMAPRES UNESA.', '🏆', 'Aditya Chandra Setiawan, S.Pd., M.Pd.')
ON CONFLICT (id) DO UPDATE SET 
    nama=EXCLUDED.nama,
    kategori=EXCLUDED.kategori,
    deskripsi=EXCLUDED.deskripsi,
    logo=EXCLUDED.logo,
    pembina=EXCLUDED.pembina;

-- 8. SEEDING FAKULTAS DAN 119 PROGRAM STUDI RESMI UNESA
DO $$
DECLARE
    f_id INT;
BEGIN

    -- 1. FIP
    INSERT INTO fakultas (nama_fakultas) VALUES ('Fakultas Ilmu Pendidikan (FIP)') ON CONFLICT (nama_fakultas) DO UPDATE SET nama_fakultas=EXCLUDED.nama_fakultas RETURNING id INTO f_id;
    INSERT INTO program_studi (fakultas_id, nama_prodi) VALUES 
        (f_id, 'S1 Bimbingan dan Konseling'),
        (f_id, 'S1 Teknologi Pendidikan'),
        (f_id, 'S1 Pendidikan Luar Sekolah'),
        (f_id, 'S1 Pendidikan Luar Biasa'),
        (f_id, 'S1 Pendidikan Guru Sekolah Dasar'),
        (f_id, 'S1 Pendidikan Guru Pendidikan Anak Usia Dini'),
        (f_id, 'S1 Manajemen Pendidikan')
    ON CONFLICT DO NOTHING;

    -- 2. FBS
    INSERT INTO fakultas (nama_fakultas) VALUES ('Fakultas Bahasa dan Seni (FBS)') ON CONFLICT (nama_fakultas) DO UPDATE SET nama_fakultas=EXCLUDED.nama_fakultas RETURNING id INTO f_id;
    INSERT INTO program_studi (fakultas_id, nama_prodi) VALUES 
        (f_id, 'S1 Pendidikan Bahasa dan Sastra Indonesia'),
        (f_id, 'S1 Pendidikan Bahasa Inggris'),
        (f_id, 'S1 Pendidikan Bahasa Jerman'),
        (f_id, 'S1 Pendidikan Bahasa Jepang'),
        (f_id, 'S1 Pendidikan Bahasa dan Sastra Jawa'),
        (f_id, 'S1 Pendidikan Seni Rupa'),
        (f_id, 'S1 Pendidikan Seni Drama, Tari, dan Musik'),
        (f_id, 'S1 Sastra Indonesia'),
        (f_id, 'S1 Sastra Inggris'),
        (f_id, 'S1 Sastra Jerman'),
        (f_id, 'S1 Pendidikan Bahasa Mandarin'),
        (f_id, 'S1 Musik'),
        (f_id, 'S1 Desain Komunikasi Visual'),
        (f_id, 'S1 Seni Rupa Murni'),
        (f_id, 'S1 Film dan Animasi')
    ON CONFLICT DO NOTHING;

    -- 3. FMIPA
    INSERT INTO fakultas (nama_fakultas) VALUES ('Fakultas Matematika dan Ilmu Pengetahuan Alam (FMIPA)') ON CONFLICT (nama_fakultas) DO UPDATE SET nama_fakultas=EXCLUDED.nama_fakultas RETURNING id INTO f_id;
    INSERT INTO program_studi (fakultas_id, nama_prodi) VALUES 
        (f_id, 'S1 Pendidikan Matematika'),
        (f_id, 'S1 Pendidikan Fisika'),
        (f_id, 'S1 Pendidikan Kimia'),
        (f_id, 'S1 Pendidikan Biologi'),
        (f_id, 'S1 Matematika'),
        (f_id, 'S1 Fisika'),
        (f_id, 'S1 Kimia'),
        (f_id, 'S1 Biologi'),
        (f_id, 'S1 Pendidikan Ilmu Pengetahuan Alam'),
        (f_id, 'S1 Sains Data'),
        (f_id, 'S1 Sains Aktuaria'),
        (f_id, 'S1 Kecerdasan Artifisial'),
        (f_id, 'S1 Geofisika')
    ON CONFLICT DO NOTHING;

    -- 4. FISIPOL
    INSERT INTO fakultas (nama_fakultas) VALUES ('Fakultas Ilmu Sosial dan Politik (FISIPOL)') ON CONFLICT (nama_fakultas) DO UPDATE SET nama_fakultas=EXCLUDED.nama_fakultas RETURNING id INTO f_id;
    INSERT INTO program_studi (fakultas_id, nama_prodi) VALUES 
        (f_id, 'S1 Pendidikan Pancasila dan Kewarganegaraan'),
        (f_id, 'S1 Pendidikan Geografi'),
        (f_id, 'S1 Pendidikan Sejarah'),
        (f_id, 'S1 Sosiologi'),
        (f_id, 'S1 Ilmu Administrasi Negara'),
        (f_id, 'S1 Ilmu Komunikasi'),
        (f_id, 'S1 Pendidikan IPS'),
        (f_id, 'S1 Ilmu Politik'),
        (f_id, 'S1 Hubungan Internasional'),
        (f_id, 'S1 Sains Informasi Geografi')
    ON CONFLICT DO NOTHING;

    -- 5. FT
    INSERT INTO fakultas (nama_fakultas) VALUES ('Fakultas Teknik (FT)') ON CONFLICT (nama_fakultas) DO UPDATE SET nama_fakultas=EXCLUDED.nama_fakultas RETURNING id INTO f_id;
    INSERT INTO program_studi (fakultas_id, nama_prodi) VALUES 
        (f_id, 'S1 Pendidikan Teknik Elektro'),
        (f_id, 'S1 Pendidikan Teknik Mesin'),
        (f_id, 'S1 Pendidikan Teknik Bangunan'),
        (f_id, 'S1 Teknik Sipil'),
        (f_id, 'S1 Pendidikan Teknologi Informasi'),
        (f_id, 'S1 Teknik Elektro'),
        (f_id, 'S1 Teknik Mesin'),
        (f_id, 'S1 Sistem Informasi'),
        (f_id, 'S1 Teknik Informatika'),
        (f_id, 'S1 Pendidikan Tata Rias'),
        (f_id, 'S1 Pendidikan Tata Boga'),
        (f_id, 'S1 Pendidikan Tata Busana'),
        (f_id, 'S1 Perencanaan Wilayah dan Kota'),
        (f_id, 'S1 Pariwisata'),
        (f_id, 'S1 Pendidikan Vokasional Teknologi Otomotif'),
        (f_id, 'S1 Pertambangan'),
        (f_id, 'S1 Metalurgi')
    ON CONFLICT DO NOTHING;

    -- 6. FIKK
    INSERT INTO fakultas (nama_fakultas) VALUES ('Fakultas Ilmu Keolahragaan dan Kesehatan (FIKK)') ON CONFLICT (nama_fakultas) DO UPDATE SET nama_fakultas=EXCLUDED.nama_fakultas RETURNING id INTO f_id;
    INSERT INTO program_studi (fakultas_id, nama_prodi) VALUES 
        (f_id, 'S1 Ilmu Keolahragaan'),
        (f_id, 'S1 Gizi'),
        (f_id, 'S1 Pendidikan Jasmani, Kesehatan, dan Rekreasi'),
        (f_id, 'S1 Pendidikan Kepelatihan Olahraga'),
        (f_id, 'S1 Manajemen Olahraga'),
        (f_id, 'S1 Masase')
    ON CONFLICT DO NOTHING;

    -- 7. FEB
    INSERT INTO fakultas (nama_fakultas) VALUES ('Fakultas Ekonomika dan Bisnis (FEB)') ON CONFLICT (nama_fakultas) DO UPDATE SET nama_fakultas=EXCLUDED.nama_fakultas RETURNING id INTO f_id;
    INSERT INTO program_studi (fakultas_id, nama_prodi) VALUES 
        (f_id, 'S1 Pendidikan Ekonomi'),
        (f_id, 'S1 Manajemen'),
        (f_id, 'S1 Akuntansi'),
        (f_id, 'S1 Pendidikan Akuntansi'),
        (f_id, 'S1 Pendidikan Bisnis'),
        (f_id, 'S1 Pendidikan Administrasi Perkantoran'),
        (f_id, 'S1 Ekonomi Islam'),
        (f_id, 'S1 Ekonomi'),
        (f_id, 'S1 Bisnis Digital')
    ON CONFLICT DO NOTHING;

    -- 8. VOKASI
    INSERT INTO fakultas (nama_fakultas) VALUES ('Fakultas Vokasi') ON CONFLICT (nama_fakultas) DO UPDATE SET nama_fakultas=EXCLUDED.nama_fakultas RETURNING id INTO f_id;
    INSERT INTO program_studi (fakultas_id, nama_prodi) VALUES 
        (f_id, 'D4 Manajemen Informatika'),
        (f_id, 'D4 Teknik Mesin'),
        (f_id, 'D4 Teknik Sipil'),
        (f_id, 'D4 Transportasi'),
        (f_id, 'D4 Kepelatihan Olahraga'),
        (f_id, 'D4 Teknik Listrik'),
        (f_id, 'D4 Desain Grafis'),
        (f_id, 'D4 Administrasi Negara'),
        (f_id, 'D4 Tata Boga'),
        (f_id, 'D4 Tata Busana'),
        (f_id, 'D4 Teknologi Rekayasa Otomotif'),
        (f_id, 'D4 Produksi Media'),
        (f_id, 'D4 Analisis Performa Olahraga'),
        (f_id, 'D4 Arsitektur Bangunan Gedung'),
        (f_id, 'D4 Rekayasa Multimedia Edukasi Digital')
    ON CONFLICT DO NOTHING;

    -- 9. KEDOKTERAN (FK)
    INSERT INTO fakultas (nama_fakultas) VALUES ('Fakultas Kedokteran (FK)') ON CONFLICT (nama_fakultas) DO UPDATE SET nama_fakultas=EXCLUDED.nama_fakultas RETURNING id INTO f_id;
    INSERT INTO program_studi (fakultas_id, nama_prodi) VALUES 
        (f_id, 'S1 Kedokteran'),
        (f_id, 'S1 Fisioterapi'),
        (f_id, 'S1 Kebidanan'),
        (f_id, 'S1 Keperawatan'),
        (f_id, 'S1 Kedokteran Gigi')
    ON CONFLICT DO NOTHING;

    -- 10. PSIKOLOGI (FPsi)
    INSERT INTO fakultas (nama_fakultas) VALUES ('Fakultas Psikologi (FPsi)') ON CONFLICT (nama_fakultas) DO UPDATE SET nama_fakultas=EXCLUDED.nama_fakultas RETURNING id INTO f_id;
    INSERT INTO program_studi (fakultas_id, nama_prodi) VALUES 
        (f_id, 'S1 Psikologi')
    ON CONFLICT DO NOTHING;

    -- 11. HUKUM (FH)
    INSERT INTO fakultas (nama_fakultas) VALUES ('Fakultas Hukum (FH)') ON CONFLICT (nama_fakultas) DO UPDATE SET nama_fakultas=EXCLUDED.nama_fakultas RETURNING id INTO f_id;
    INSERT INTO program_studi (fakultas_id, nama_prodi) VALUES 
        (f_id, 'S1 Ilmu Hukum')
    ON CONFLICT DO NOTHING;

    -- 12. PSDKU MAGETAN
    INSERT INTO fakultas (nama_fakultas) VALUES ('Program Studi Diluar Kampus Utama (PSDKU Magetan)') ON CONFLICT (nama_fakultas) DO UPDATE SET nama_fakultas=EXCLUDED.nama_fakultas RETURNING id INTO f_id;
    INSERT INTO program_studi (fakultas_id, nama_prodi) VALUES 
        (f_id, 'S1 Pendidikan Jasmani, Kesehatan, dan Rekreasi (Kampus Magetan)'),
        (f_id, 'S1 Pendidikan Guru Sekolah Dasar (Kampus Magetan)'),
        (f_id, 'S1 Pendidikan Matematika (Kampus Magetan)'),
        (f_id, 'S1 Ilmu Hukum (Kampus Magetan)'),
        (f_id, 'S1 Ilmu Komunikasi (Kampus Magetan)'),
        (f_id, 'S1 Manajemen (Kampus Magetan)'),
        (f_id, 'S1 Sastra Inggris (Kampus Magetan)'),
        (f_id, 'S1 Pendidikan Tata Rias (Kampus Magetan)'),
        (f_id, 'S1 PGPAUD (Kampus Magetan)'),
        (f_id, 'S1 Teknologi Pendidikan (Kampus Magetan)'),
        (f_id, 'S1 Bimbingan Konseling (Kampus Magetan)'),
        (f_id, 'S1 Pendidikan Kepelatihan Olahraga (Kampus Magetan)'),
        (f_id, 'S1 Pendidikan Bahasa dan Sastra Indonesia (Kampus Magetan)'),
        (f_id, 'S1 Ilmu Administrasi Negara (Kampus Magetan)'),
        (f_id, 'S1 Akuntansi (Kampus Magetan)')
    ON CONFLICT DO NOTHING;

    -- 13. FKP
    INSERT INTO fakultas (nama_fakultas) VALUES ('Fakultas Ketahanan Pangan (FKP)') ON CONFLICT (nama_fakultas) DO UPDATE SET nama_fakultas=EXCLUDED.nama_fakultas RETURNING id INTO f_id;
    INSERT INTO program_studi (fakultas_id, nama_prodi) VALUES 
        (f_id, 'S1 Akuakultur'),
        (f_id, 'S1 Biosains Hewan'),
        (f_id, 'S1 Agribisnis Digital'),
        (f_id, 'S1 Teknologi Pangan dan Hasil Pertanian'),
        (f_id, 'S1 Bioteknologi')
    ON CONFLICT DO NOTHING;

END $$;
