import { NextResponse } from 'next/server';
import { sendEmail, generateWelcomeEmailHtml, generateResetPasswordEmailHtml } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email dan password wajib diisi.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    let subject = 'Kredensial Akun Pekan Raya Mahasiswa UNESA 2026';
    let htmlContent = generateWelcomeEmailHtml(cleanEmail, password);

    if (action === 'RESET_PASSWORD' || action === 'OFFICER_RESET') {
      subject = 'Reset Password Akun Pekan Raya Mahasiswa UNESA 2026';
      htmlContent = generateResetPasswordEmailHtml(cleanEmail, password);
    }

    const emailResult = await sendEmail({
      to: cleanEmail,
      subject,
      html: htmlContent,
    });

    return NextResponse.json({
      success: true,
      data: emailResult,
      message: `Notifikasi email telah dikirimkan ke ${cleanEmail}!`,
    });
  } catch (error: any) {
    console.error('API Send Email Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
