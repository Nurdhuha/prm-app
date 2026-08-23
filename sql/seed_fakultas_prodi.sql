-- ==============================================================================
-- SKEMA & DATA SEEDING RESMI FAKULTAS DAN PROGRAM STUDI UNESA (119 PRODI)
-- Sistem Informasi Pekan Raya Mahasiswa (PRM UNESA)
-- Target Database: ukm_database (PostgreSQL 16)
-- ==============================================================================

-- 1. Buat Tabel Fakultas (Jika Belum Ada)
CREATE TABLE IF NOT EXISTS fakultas (
    id SERIAL PRIMARY KEY,
    nama_fakultas VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Buat Tabel Program Studi (Jika Belum Ada)
CREATE TABLE IF NOT EXISTS program_studi (
    id SERIAL PRIMARY KEY,
    fakultas_id INT NOT NULL REFERENCES fakultas(id) ON DELETE CASCADE,
    nama_prodi VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_prodi_per_fakultas UNIQUE (fakultas_id, nama_prodi)
);

-- 3. Inisialisasi Data Fakultas & Program Studi (119 Prodi)
DO $$
DECLARE
    f_id INT;
BEGIN

    -- FAKULTAS 1: FIP
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

    -- FAKULTAS 2: FBS
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

    -- FAKULTAS 3: FMIPA
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

    -- FAKULTAS 4: FISIPOL
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

    -- FAKULTAS 5: FT
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

    -- FAKULTAS 6: FIKK
    INSERT INTO fakultas (nama_fakultas) VALUES ('Fakultas Ilmu Keolahragaan dan Kesehatan (FIKK)') ON CONFLICT (nama_fakultas) DO UPDATE SET nama_fakultas=EXCLUDED.nama_fakultas RETURNING id INTO f_id;
    INSERT INTO program_studi (fakultas_id, nama_prodi) VALUES 
        (f_id, 'S1 Ilmu Keolahragaan'),
        (f_id, 'S1 Gizi'),
        (f_id, 'S1 Pendidikan Jasmani, Kesehatan, dan Rekreasi'),
        (f_id, 'S1 Pendidikan Kepelatihan Olahraga'),
        (f_id, 'S1 Manajemen Olahraga'),
        (f_id, 'S1 Masase')
    ON CONFLICT DO NOTHING;

    -- FAKULTAS 7: FEB
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

    -- FAKULTAS 8: VOKASI
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

    -- FAKULTAS 9: KEDOKTERAN (FK)
    INSERT INTO fakultas (nama_fakultas) VALUES ('Fakultas Kedokteran (FK)') ON CONFLICT (nama_fakultas) DO UPDATE SET nama_fakultas=EXCLUDED.nama_fakultas RETURNING id INTO f_id;
    INSERT INTO program_studi (fakultas_id, nama_prodi) VALUES 
        (f_id, 'S1 Kedokteran'),
        (f_id, 'S1 Fisioterapi'),
        (f_id, 'S1 Kebidanan'),
        (f_id, 'S1 Keperawatan'),
        (f_id, 'S1 Kedokteran Gigi')
    ON CONFLICT DO NOTHING;

    -- FAKULTAS 10: PSIKOLOGI (FPsi)
    INSERT INTO fakultas (nama_fakultas) VALUES ('Fakultas Psikologi (FPsi)') ON CONFLICT (nama_fakultas) DO UPDATE SET nama_fakultas=EXCLUDED.nama_fakultas RETURNING id INTO f_id;
    INSERT INTO program_studi (fakultas_id, nama_prodi) VALUES 
        (f_id, 'S1 Psikologi')
    ON CONFLICT DO NOTHING;

    -- FAKULTAS 11: HUKUM (FH)
    INSERT INTO fakultas (nama_fakultas) VALUES ('Fakultas Hukum (FH)') ON CONFLICT (nama_fakultas) DO UPDATE SET nama_fakultas=EXCLUDED.nama_fakultas RETURNING id INTO f_id;
    INSERT INTO program_studi (fakultas_id, nama_prodi) VALUES 
        (f_id, 'S1 Ilmu Hukum')
    ON CONFLICT DO NOTHING;

    -- FAKULTAS 12: PSDKU MAGETAN
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

    -- FAKULTAS 13: FKP
    INSERT INTO fakultas (nama_fakultas) VALUES ('Fakultas Ketahanan Pangan (FKP)') ON CONFLICT (nama_fakultas) DO UPDATE SET nama_fakultas=EXCLUDED.nama_fakultas RETURNING id INTO f_id;
    INSERT INTO program_studi (fakultas_id, nama_prodi) VALUES 
        (f_id, 'S1 Akuakultur'),
        (f_id, 'S1 Biosains Hewan'),
        (f_id, 'S1 Agribisnis Digital'),
        (f_id, 'S1 Teknologi Pangan dan Hasil Pertanian'),
        (f_id, 'S1 Bioteknologi')
    ON CONFLICT DO NOTHING;

END $$;
