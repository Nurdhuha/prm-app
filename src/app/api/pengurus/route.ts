import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { LIST_UKM } from '@/data/mockData';

// GET /api/pengurus - Get all UKM officer accounts
export async function GET() {
  try {
    const res = await db.query('SELECT id, email, ukm_id, created_at FROM pengurus_ukm ORDER BY ukm_id ASC');
    
    // Map with UKM catalog to ensure all 65 UKMs are listed
    const officersMap = new Map(res.rows.map((row) => [row.ukm_id, row]));

    const result = LIST_UKM.map((ukm) => {
      const dbOfficer = officersMap.get(ukm.id);
      return {
        id: dbOfficer?.id || `officer-${ukm.id}`,
        ukmId: ukm.id,
        ukmNama: ukm.nama,
        kategori: ukm.kategori,
        email: dbOfficer?.email || `pengurus.${ukm.id}@unesa.ac.id`,
        hasCustomPassword: Boolean(dbOfficer?.password_hash),
        updatedAt: dbOfficer?.created_at || new Date().toISOString(),
      };
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('API GET Pengurus Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT /api/pengurus - Update officer email & password
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { ukmId, email, password } = body;

    if (!ukmId || !email) {
      return NextResponse.json({ success: false, error: 'ukmId dan email wajib diisi.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password ? password.trim() : 'Prm2026!#';

    // Upsert into pengurus_ukm table in PostgreSQL
    const upsertQuery = `
      INSERT INTO pengurus_ukm (email, password_hash, ukm_id)
      VALUES ($1, $2, $3)
      ON CONFLICT (ukm_id) 
      DO UPDATE SET email = EXCLUDED.email, password_hash = EXCLUDED.password_hash, created_at = CURRENT_TIMESTAMP
      RETURNING id, email, ukm_id;
    `;

    // Also handle conflict if email is unique across different UKMs
    const updateResult = await db.query(
      `INSERT INTO pengurus_ukm (email, password_hash, ukm_id)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) 
       DO UPDATE SET password_hash = EXCLUDED.password_hash, ukm_id = EXCLUDED.ukm_id, created_at = CURRENT_TIMESTAMP
       RETURNING id, email, ukm_id;`,
      [cleanEmail, cleanPassword, ukmId]
    );

    return NextResponse.json({
      success: true,
      data: updateResult.rows[0],
      message: `Akun Pengurus UKM ${ukmId} berhasil diperbarui!`,
    });
  } catch (error: any) {
    console.error('API PUT Pengurus Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
