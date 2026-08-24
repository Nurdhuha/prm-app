import { NextResponse } from 'next/server';
import { FAKULTAS_UNESA, PRODI_UNESA } from '@/data/mockData';

export async function GET() {
  try {
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
