import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const fakultasRes = await db.query('SELECT * FROM fakultas ORDER BY id ASC');
    const prodiRes = await db.query('SELECT * FROM program_studi ORDER BY id ASC');

    const result: Record<string, string[]> = {};
    for (const f of fakultasRes.rows) {
      result[f.nama_fakultas] = prodiRes.rows
        .filter((p) => p.fakultas_id === f.id)
        .map((p) => p.nama_prodi);
    }

    return NextResponse.json({
      success: true,
      fakultas: fakultasRes.rows.map((f) => f.nama_fakultas),
      prodi: result,
    });
  } catch (error: any) {
    console.error('API Fakultas Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
