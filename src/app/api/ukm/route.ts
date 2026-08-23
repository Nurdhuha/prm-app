import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const ukmRes = await db.query('SELECT id, nama, kategori, deskripsi, logo, pembina, status FROM ukm ORDER BY id ASC');
    return NextResponse.json({
      success: true,
      data: ukmRes.rows,
    });
  } catch (error: any) {
    console.error('API UKM Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
