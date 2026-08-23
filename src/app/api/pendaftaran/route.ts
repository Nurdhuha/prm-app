import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET all pendaftaran
export async function GET() {
  try {
    const query = `
      SELECT 
        p.id,
        p.ukm_id as "ukmId",
        p.ukm_nama as "ukmNama",
        p.status,
        p.catatan_penolakan as "catatanPenolakan",
        TO_CHAR(p.created_at, 'YYYY-MM-DD HH24:MI') as "tanggalDaftar",
        TO_CHAR(p.updated_at, 'YYYY-MM-DD HH24:MI') as "updatedAt",
        m.nama,
        m.nim,
        m.fakultas,
        m.prodi,
        m.no_hp as "noHp",
        m.email
      FROM pendaftaran_ukm p
      JOIN mahasiswa m ON p.mahasiswa_id = m.id
      ORDER BY p.created_at DESC
    `;

    const res = await db.query(query);

    const formatted = res.rows.map((r) => ({
      id: r.id,
      ukmId: r.ukmId,
      ukmNama: r.ukmNama,
      status: r.status,
      catatanPenolakan: r.catatanPenolakan,
      tanggalDaftar: r.tanggalDaftar,
      updatedAt: r.updatedAt,
      mahasiswa: {
        nama: r.nama,
        nim: r.nim,
        fakultas: r.fakultas,
        prodi: r.prodi,
        noHp: r.noHp,
        email: r.email,
      },
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (error: any) {
    console.error('API GET Pendaftaran Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST new pendaftaran with ATOMIC TRANSACTION & 1 UKM / 1 Account Guard
export async function POST(request: Request) {
  const client = await db.connect();
  try {
    const body = await request.json();
    const { mahasiswa, ukmId, ukmNama } = body;

    if (!mahasiswa || !mahasiswa.nama || !mahasiswa.nim || !mahasiswa.noHp || !mahasiswa.email || !ukmId) {
      return NextResponse.json({ success: false, error: 'Data pendaftaran tidak lengkap.' }, { status: 400 });
    }

    await client.query('BEGIN');

    // 1. Upsert User by email
    const userRes = await client.query(
      `INSERT INTO users (email, password_hash, is_profile_completed) 
       VALUES ($1, 'HASHED_SECRET', TRUE) 
       ON CONFLICT (email) DO UPDATE SET updated_at = CURRENT_TIMESTAMP 
       RETURNING id`,
      [mahasiswa.email.toLowerCase()]
    );
    const userId = userRes.rows[0].id;

    // 2. Upsert Mahasiswa profile by user_id & check NIM unique
    const nimCheck = await client.query('SELECT id FROM mahasiswa WHERE nim = $1 AND user_id != $2', [
      mahasiswa.nim,
      userId,
    ]);
    if (nimCheck.rows.length > 0) {
      await client.query('ROLLBACK');
      return NextResponse.json(
        { success: false, error: 'NIM tersebut sudah terdaftar pada akun mahasiswa lain.' },
        { status: 422 }
      );
    }

    const mhsRes = await client.query(
      `INSERT INTO mahasiswa (user_id, nama, nim, fakultas, prodi, no_hp, email)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (user_id) DO UPDATE SET
         nama = EXCLUDED.nama,
         nim = EXCLUDED.nim,
         fakultas = EXCLUDED.fakultas,
         prodi = EXCLUDED.prodi,
         no_hp = EXCLUDED.no_hp,
         email = EXCLUDED.email
       RETURNING id`,
      [userId, mahasiswa.nama, mahasiswa.nim, mahasiswa.fakultas, mahasiswa.prodi, mahasiswa.noHp, mahasiswa.email.toLowerCase()]
    );
    const mahasiswaId = mhsRes.rows[0].id;

    // 3. Strict 1 UKM Check: Check if mahasiswa already has PENDING or ACCEPTED registration
    const existingRegistration = await client.query(
      `SELECT id, status, ukm_nama FROM pendaftaran_ukm 
       WHERE mahasiswa_id = $1 AND status IN ('PENDING', 'ACCEPTED') FOR UPDATE`,
      [mahasiswaId]
    );

    if (existingRegistration.rows.length > 0) {
      await client.query('ROLLBACK');
      return NextResponse.json(
        {
          success: false,
          error: `Anda sudah terdaftar di ${existingRegistration.rows[0].ukm_nama} dengan status ${existingRegistration.rows[0].status}. Sesuai aturan kampus, Anda hanya diperbolehkan mendaftar di 1 UKM.`,
        },
        { status: 422 }
      );
    }

    // 4. Create new pendaftaran record
    const regId = `REG-2026-${Math.floor(100 + Math.random() * 900)}`;
    const regRes = await client.query(
      `INSERT INTO pendaftaran_ukm (id, mahasiswa_id, ukm_id, ukm_nama, status)
       VALUES ($1, $2, $3, $4, 'PENDING')
       RETURNING id, status, TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI') as "tanggalDaftar"`,
      [regId, mahasiswaId, ukmId, ukmNama]
    );

    await client.query('COMMIT');

    return NextResponse.json({
      success: true,
      data: {
        id: regRes.rows[0].id,
        status: regRes.rows[0].status,
        tanggalDaftar: regRes.rows[0].tanggalDaftar,
        mahasiswa,
        ukmId,
        ukmNama,
      },
    });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('API POST Pendaftaran Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    client.release();
  }
}

// PATCH for Admin Approval / Rejection / Cancel
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, action, catatanPenolakan } = body;

    if (!id || !action) {
      return NextResponse.json({ success: false, error: 'ID dan Aksi wajib diisi.' }, { status: 400 });
    }

    let status = 'PENDING';
    if (action === 'APPROVE') status = 'ACCEPTED';
    if (action === 'REJECT') status = 'REJECTED';
    if (action === 'CANCEL') status = 'CANCELLED';

    const res = await db.query(
      `UPDATE pendaftaran_ukm 
       SET status = $1, catatan_penolakan = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING id, status`,
      [status, catatanPenolakan || null, id]
    );

    return NextResponse.json({ success: true, data: res.rows[0] });
  } catch (error: any) {
    console.error('API PATCH Pendaftaran Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
