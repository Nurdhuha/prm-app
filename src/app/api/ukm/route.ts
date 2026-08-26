import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/ukm - Get all UKMs from PostgreSQL
export async function GET() {
  try {
    const ukmRes = await db.query(
      'SELECT id, nama, kategori, deskripsi, logo, pembina, status, created_at FROM ukm ORDER BY id ASC'
    );
    return NextResponse.json({
      success: true,
      data: ukmRes.rows,
    });
  } catch (error: any) {
    console.error('API GET UKM Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/ukm - Create new UKM (Superadmin Only)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, nama, kategori, deskripsi, logo, pembina, status } = body;

    if (!nama || !kategori) {
      return NextResponse.json({ success: false, error: 'Nama dan Kategori UKM wajib diisi.' }, { status: 400 });
    }

    // Generate clean collision-proof ID if not provided (e.g. ukm-82)
    let ukmId = id ? id.trim().toLowerCase() : '';
    if (!ukmId) {
      const maxIdRes = await db.query(
        "SELECT id FROM ukm WHERE id ~ '^ukm-[0-9]+$' ORDER BY CAST(SUBSTRING(id FROM 5) AS INT) DESC LIMIT 1"
      );
      let nextNum = 1;
      if (maxIdRes.rows.length > 0) {
        const lastNum = parseInt(maxIdRes.rows[0].id.replace('ukm-', ''), 10);
        if (!isNaN(lastNum)) nextNum = lastNum + 1;
      }
      ukmId = `ukm-${nextNum}`;
    }

    const insertQuery = `
      INSERT INTO ukm (id, nama, kategori, deskripsi, logo, pembina, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (id) 
      DO UPDATE SET nama = EXCLUDED.nama, kategori = EXCLUDED.kategori, deskripsi = EXCLUDED.deskripsi, pembina = EXCLUDED.pembina, status = EXCLUDED.status
      RETURNING *;
    `;

    const res = await db.query(insertQuery, [
      ukmId,
      nama.trim(),
      kategori.trim(),
      deskripsi ? deskripsi.trim() : `Unit Kegiatan Mahasiswa ${nama.trim()} UNESA`,
      logo || 'UKM',
      pembina ? pembina.trim() : 'UNESA',
      status || 'open',
    ]);

    // Auto-create officer account for this new UKM
    const slug = nama.replace(/^UKM\s+/i, '').replace(/[^a-zA-Z0-9]/g, '').substring(0, 10);
    const defaultPassword = `Prm${slug}2026!#`;
    const defaultEmail = `pengurus.${ukmId}@unesa.ac.id`;

    await db.query(
      `INSERT INTO pengurus_ukm (email, password_hash, ukm_id)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO NOTHING`,
      [defaultEmail, defaultPassword, ukmId]
    );

    return NextResponse.json({
      success: true,
      data: res.rows[0],
      message: `UKM "${nama}" berhasil ditambahkan!`,
    });
  } catch (error: any) {
    console.error('API POST UKM Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT /api/ukm - Update existing UKM
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, nama, kategori, deskripsi, pembina, status } = body;

    if (!id || !nama) {
      return NextResponse.json({ success: false, error: 'ID dan Nama UKM wajib diisi.' }, { status: 400 });
    }

    const updateQuery = `
      UPDATE ukm
      SET nama = $1, kategori = $2, deskripsi = $3, pembina = $4, status = $5
      WHERE id = $6
      RETURNING *;
    `;

    const res = await db.query(updateQuery, [
      nama.trim(),
      kategori.trim(),
      deskripsi.trim(),
      pembina ? pembina.trim() : 'UNESA',
      status || 'open',
      id,
    ]);

    if (res.rowCount === 0) {
      return NextResponse.json({ success: false, error: 'UKM tidak ditemukan.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: res.rows[0],
      message: `Data UKM "${nama}" berhasil diperbarui!`,
    });
  } catch (error: any) {
    console.error('API PUT UKM Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE /api/ukm - Delete UKM (Superadmin Only)
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID UKM wajib diberikan.' }, { status: 400 });
    }

    const res = await db.query('DELETE FROM ukm WHERE id = $1 RETURNING id, nama', [id]);

    if (res.rowCount === 0) {
      return NextResponse.json({ success: false, error: 'UKM tidak ditemukan.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `UKM "${res.rows[0].nama}" berhasil dihapus.`,
    });
  } catch (error: any) {
    console.error('API DELETE UKM Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
