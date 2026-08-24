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

-- 7. SEEDING KATALOG 65 UKM RESMI UNESA (5 KATEGORI STANDAR TERPISAH)
INSERT INTO ukm (id, nama, kategori, deskripsi, logo, pembina) VALUES
    ('ukm-1', 'UKM Korfball', 'Olahraga & Bela Diri', 'Cabang olahraga bola keranjang tim gabungan putra & putri.', '🧺', 'Pembina Olahraga UNESA'),
    ('ukm-2', 'UKM Broadcasting', 'Seni & Budaya', 'Pengembangan talenta penyiaran TV, podcast, & multimedia studio.', '🎙️', 'Pembina FBS UNESA'),
    ('ukm-3', 'UKM Floorball', 'Olahraga & Bela Diri', 'Komunitas cabang olahraga hoki ruangan dengan tongkat stik.', '🏒', 'Pembina FIKK UNESA'),
    ('ukm-4', 'UKM Esport', 'Olahraga & Bela Diri', 'Wadah pembinaan atlet esports kompetitif kampus cabang MLBB, Valorant, PUBG.', '🎮', 'Pembina FT UNESA'),
    ('ukm-5', 'UKM Pencak Organisasi', 'Olahraga & Bela Diri', 'Pengembangan seni bela diri tradisional Pencak Organisasi Indonesia.', '🥋', 'Pembina Bela Diri UNESA'),
    ('ukm-6', 'UKM Pagar Nusa', 'Olahraga & Bela Diri', 'Wadah pencak silat Pagar Nusa Nahdlatul Ulama UNESA.', '🛡️', 'Pembina Kerohanian UNESA'),
    ('ukm-7', 'UKM Teater', 'Seni & Budaya', 'Pengembangan bakat seni peran, keaktoran, drama, & tata panggung.', '🎭', 'Pembina FBS UNESA'),
    ('ukm-8', 'UKM Formadiksi', 'Penalaran & Keilmuan', 'Forum Mahasiswa Bidikmisi dan KIP-Kuliah Universitas Negeri Surabaya.', '🎓', 'Kemahasiswaan UNESA'),
    ('ukm-9', 'UKM Hapkido', 'Olahraga & Bela Diri', 'Cabang seni bela diri Hapkido berbasis teknik kuncian & lemparan.', '🥋', 'Pembina Bela Diri UNESA'),
    ('ukm-10', 'UKM PSHT', 'Olahraga & Bela Diri', 'Persaudaraan Setia Hati Terate komisariat UNESA.', '🥊', 'Pembina FIKK UNESA'),
    ('ukm-11', 'UKM Menwa (Resimen Mahasiswa)', 'Kepemimpinan & Pengabdian', 'Satuan kedisiplinan, olah keprajuritan, & wawasan kebangsaan kampus.', '🎖️', 'Pembina Kebangsaan UNESA'),
    ('ukm-12', 'UKM Panahan', 'Olahraga & Bela Diri', 'Pembinaan atlet olahraga panahan (archery) tingkat regional & nasional.', '🏹', 'Pembina FIKK UNESA'),
    ('ukm-13', 'UKM Peduli Kemanusiaan', 'Kepemimpinan & Pengabdian', 'Aksi relawan kebencanaan, tanggap darurat, & aksi sosial mahasiswa.', '❤️', 'Kemahasiswaan UNESA'),
    ('ukm-14', 'UKM Menembak', 'Olahraga & Bela Diri', 'Klub olahraga menembak sasaran tembak senapan angin & airsoft.', '🎯', 'Pembina FIKK UNESA'),
    ('ukm-15', 'UKM Himapala', 'Kepemimpinan & Pengabdian', 'Himpunan Mahasiswa Pencinta Alam jelajah hutan, gunung, & panjat tebing.', '🏔️', 'Pembina Himapala UNESA'),
    ('ukm-16', 'UKM UKKK (Kerohanian Katolik)', 'Kerohanian', 'Unit Kegiatan Kerohanian Katolik untuk pembinaan iman mahasiswa Katolik.', '⛪', 'Pembina Kerohanian UNESA'),
    ('ukm-17', 'UKM Jujitsu', 'Olahraga & Bela Diri', 'Seni bela diri Jujitsu gabungan bantingan, kuncian, & pertahanan diri.', '🥋', 'Pembina Bela Diri UNESA'),
    ('ukm-18', 'UKM IBCA MMA', 'Olahraga & Bela Diri', 'Indonesian Mixed Martial Arts Association perguruan tinggi UNESA.', '🤼', 'Pembina FIKK UNESA'),
    ('ukm-19', 'UKM PSM (Paduan Suara)', 'Seni & Budaya', 'Paduan suara mahasiswa berprestasi nasional & kompetisi internasional.', '🎶', 'Pembina Musik UNESA'),
    ('ukm-20', 'UKM Bola Tangan', 'Olahraga & Bela Diri', 'Cabang olahraga handball lapangan cepat & kompetisi perguruan tinggi.', '🤾', 'Pembina FIKK UNESA'),
    ('ukm-21', 'UKM AFO', 'Seni & Budaya', 'Komunitas seni fotografi & fotografi dokumenter kampus UNESA.', '📷', 'Pembina FBS UNESA'),
    ('ukm-22', 'UKM Catur', 'Olahraga & Bela Diri', 'Klub olahraga strategi catur kilat, standar, & kompetisi POMNAS.', '♟️', 'Pembina FIKK UNESA'),
    ('ukm-23', 'UKM Tapak Suci', 'Olahraga & Bela Diri', 'Seni bela diri Perguruan Pencak Silat Tapak Suci Putera Muhammadiyah.', '🥋', 'Pembina Bela Diri UNESA'),
    ('ukm-24', 'UKM Taekwondo', 'Olahraga & Bela Diri', 'Cabang seni bela diri Taekwondo kyorugi & poomsae UNESA.', '🥋', 'Pembina FIKK UNESA'),
    ('ukm-25', 'UKM UKKKP (Kerohanian Kristen)', 'Kerohanian', 'Unit Kegiatan Kerohanian Kristen Protestan binaan mahasiswa UNESA.', '✝️', 'Pembina Kerohanian UNESA'),
    ('ukm-26', 'UKM Pramuka 413', 'Kepemimpinan & Pengabdian', 'Racana Gugus Depan Pramuka 413 perguruan tinggi UNESA.', '⚜️', 'Pembina Pramuka UNESA'),
    ('ukm-27', 'UKM Pramuka 414', 'Kepemimpinan & Pengabdian', 'Racana Gugus Depan Pramuka 414 perguruan tinggi UNESA.', '⚜️', 'Pembina Pramuka UNESA'),
    ('ukm-28', 'UKM Kewirausahaan', 'Kepemimpinan & Pengabdian', 'Inkubator bisnis, bazar UMKM kampus, & pelatihan startup mahasiswa.', '💼', 'Pembina FEB UNESA'),
    ('ukm-29', 'UKM MTQ', 'Kerohanian', 'Musabaqah Tilawatil Qur''an pembinaan qari/qariah & seni Al-Qur''an.', '📖', 'Pembina Kerohanian UNESA'),
    ('ukm-30', 'UKM UKKH (Kerohanian Hindu)', 'Kerohanian', 'Unit Kegiatan Kerohanian Hindu pembinaan keagamaan mahasiswa Hindu.', '🛕', 'Pembina Kerohanian UNESA'),
    ('ukm-31', 'UKM Renang', 'Olahraga & Bela Diri', 'Klub olahraga renang gaya bebas, dada, kupu-kupu, & gaya punggung.', '🏊', 'Pembina FIKK UNESA'),
    ('ukm-32', 'UKM Debat', 'Penalaran & Keilmuan', 'Komunitas debat bahasa Indonesia & English Parliamentary debate.', '💬', 'Pembina Penalaran UNESA'),
    ('ukm-33', 'UKM Perisai Diri', 'Olahraga & Bela Diri', 'Keluarga Silat Nasional Indonesia Perisai Diri komisariat UNESA.', '🛡️', 'Pembina Bela Diri UNESA'),
    ('ukm-34', 'UKM Rebana', 'Kerohanian', 'Seni musik islami rebana, shalawat, & kebudayaan musik bernuansa religi.', '🪘', 'Pembina Kerohanian UNESA'),
    ('ukm-35', 'UKM Radio', 'Seni & Budaya', 'Stasiun radio siaran kampus, penyiar, Announcer & audio operator.', '📻', 'Pembina FBS UNESA'),
    ('ukm-36', 'UKM Ankasa', 'Penalaran & Keilmuan', 'Komunitas keantariksaan, astronomi, & riset kedirgantaraan mahasiswa.', '🚀', 'Pembina FMIPA UNESA'),
    ('ukm-37', 'UKM Gita Pramawisesa', 'Seni & Budaya', 'Marching band kebanggaan UNESA dengan divisi brass & color guard.', '🎺', 'Pembina Musik UNESA'),
    ('ukm-38', 'UKM Softball', 'Olahraga & Bela Diri', 'Klub lapangan cabang olahraga softball & baseball mahasiswa UNESA.', '🥎', 'Pembina FIKK UNESA'),
    ('ukm-39', 'UKM Woodball', 'Olahraga & Bela Diri', 'Cabang olahraga bola kayu presisi tinggi mirip golf outdoor.', '🪵', 'Pembina FIKK UNESA'),
    ('ukm-40', 'UKM Karate', 'Olahraga & Bela Diri', 'Seni bela diri Karate disiplin kata & kumite perguruan tinggi UNESA.', '🥋', 'Pembina FIKK UNESA'),
    ('ukm-41', 'UKM Pantomime', 'Seni & Budaya', 'Seni gerak olah tubuh tanpa kata, gestur, & mimik kreatif panggung.', '🤡', 'Pembina FBS UNESA'),
    ('ukm-42', 'UKM Symphony Orchestra', 'Seni & Budaya', 'Orkestra instrumen gesek, tiup, & perkusi simfoni klasik UNESA.', '🎻', 'Pembina Musik UNESA'),
    ('ukm-43', 'UKM Equestrian UNESA', 'Olahraga & Bela Diri', 'Klub olahraga berkuda tunggang ketangkasan equestrian UNESA.', '🐎', 'Pembina FIKK UNESA'),
    ('ukm-44', 'UKM Protokoler', 'Kepemimpinan & Pengabdian', 'Korps keprotokoleran resmi wisuda, seminar, & acara kenegaraan kampus.', '🎙️', 'Humas UNESA'),
    ('ukm-45', 'UKM UKKI (Kerohanian Islam)', 'Kerohanian', 'Unit Kegiatan Kerohanian Islam pembinaan karakter & dakwah kampus.', '🕌', 'Pembina Kerohanian UNESA'),
    ('ukm-46', 'UKM Tarung Derajat', 'Olahraga & Bela Diri', 'Seni bela diri praktis pertahanan diri Tarung Derajat Kodrat UNESA.', '🥊', 'Pembina FIKK UNESA'),
    ('ukm-47', 'UKM Senam', 'Olahraga & Bela Diri', 'Klub olahraga senam artistik, ritmik, aerobik, & kebugaran tubuh.', '🤸', 'Pembina FIKK UNESA'),
    ('ukm-48', 'UKM Rugby', 'Olahraga & Bela Diri', 'Cabang olahraga rugby fisik lapangan luar outdoor UNESA.', '🏉', 'Pembina FIKK UNESA'),
    ('ukm-49', 'UKM Tari', 'Seni & Budaya', 'Seni tari tradisional Nusantara, kontemporer, & kreasi baru.', '💃', 'Pembina FBS UNESA'),
    ('ukm-50', 'UKM Atletik', 'Olahraga & Bela Diri', 'Cabang induk olahraga lari sprint, lompat jauh, & lempar lembing.', '🏃', 'Pembina FIKK UNESA'),
    ('ukm-51', 'UKM Masase', 'Olahraga & Bela Diri', 'Keahlian pemulihan terapi fisik, masase olahraga, & kebugaran atlet.', '💆', 'Pembina FIKK UNESA'),
    ('ukm-52', 'UKM Tenis Meja', 'Olahraga & Bela Diri', 'Klub olahraga pingpong meja tunggal & ganda kompetisi kampus.', '🏓', 'Pembina FIKK UNESA'),
    ('ukm-53', 'UKM Gema', 'Seni & Budaya', 'Komunitas kebudayaan daerah, gamelan, & kesenian tradisional.', '🪘', 'Pembina FBS UNESA'),
    ('ukm-54', 'UKM Kependudukan', 'Kepemimpinan & Pengabdian', 'Edukasi wawasan kependudukan, generasi berencana (Genre), & sosial.', '👨‍👩‍👧', 'Pembina FISIPOL UNESA'),
    ('ukm-55', 'UKM Futsal UNESA', 'Olahraga & Bela Diri', 'Tim bola futsal putra & putri kompetisi antar universitas nasional.', '⚽', 'Pembina FIKK UNESA'),
    ('ukm-56', 'UKM Pickleball', 'Olahraga & Bela Diri', 'Olahraga kombinasi tenis, bulutangkis, & pingpong terkini.', '🏸', 'Pembina FIKK UNESA'),
    ('ukm-57', 'UKM Badminton', 'Olahraga & Bela Diri', 'Klub olahraga bulutangkis tunggal & ganda berprestasi tinggi.', '🏸', 'Pembina FIKK UNESA'),
    ('ukm-58', 'UKM Cricket', 'Olahraga & Bela Diri', 'Cabang olahraga kriket pemukul bola outdoor kompetisi nasional.', '🏏', 'Pembina FIKK UNESA'),
    ('ukm-59', 'UKM Tenis Lapangan', 'Olahraga & Bela Diri', 'Klub olahraga tenis raket lapangan keras outdoor kampus.', '🎾', 'Pembina FIKK UNESA'),
    ('ukm-60', 'UKM Keroncong', 'Seni & Budaya', 'Pelestarian musik tradisional keroncong dengan cuk, cak, & ukulele.', '🪕', 'Pembina FBS UNESA'),
    ('ukm-61', 'UKM UNESA String Chamber', 'Seni & Budaya', 'Ensemble musik gesek biola, viola, & cello klasik UNESA.', '🎻', 'Pembina FBS UNESA'),
    ('ukm-62', 'UKM Band dan Dangdut', 'Seni & Budaya', 'Grup musik genre pop, rock, alternatif, & musik dangdut kreatif.', '🎸', 'Pembina FBS UNESA'),
    ('ukm-63', 'UKM UKIM', 'Penalaran & Keilmuan', 'Unit Kegiatan Ilmiah Mahasiswa riset, Karya Tulis Ilmiah (KTI), & PKM.', '🔬', 'Pembina Penalaran UNESA'),
    ('ukm-64', 'UKM Kabadi', 'Olahraga & Bela Diri', 'Olahraga tradisional pernapasan & pertahanan diri tim asal Asia.', '🤼', 'Pembina FIKK UNESA'),
    ('ukm-65', 'UKM Kempo', 'Olahraga & Bela Diri', 'Seni bela diri Shorinji Kempo Juho & Goho mahasiswi/mahasiswa UNESA.', '🥋', 'Pembina FIKK UNESA')
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
