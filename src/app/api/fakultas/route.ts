import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { FAKULTAS_UNESA, PRODI_UNESA } from '@/data/mockData';

export async function GET() {
  try {
    const fakultasRes = await db.query('SELECT * FROM fakultas ORDER BY id ASC');
    const prodiRes = await db.query('SELECT * FROM program_studi ORDER BY id ASC');

    if (fakultasRes.rows.length > 0 && prodiRes.rows.length > 0) {
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
    }

    return NextResponse.json({
      success: true,
      fakultas: FAKULTAS_UNESA,
      prodi: PRODI_UNESA,
    });
  } catch (error: any) {
    console.error('API Fakultas Error:', error);
    return NextResponse.json({
      success: true,
      fakultas: FAKULTAS_UNESA,
      prodi: PRODI_UNESA,
    });
  }
}
