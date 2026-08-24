import nodemailer from 'nodemailer';

// Helper to create Nodemailer SMTP Transporter
const getTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
};

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: SendEmailOptions) => {
  try {
    const transporter = getTransporter();
    const fromAddress = process.env.SMTP_FROM || 'Pekan Raya Mahasiswa UNESA 2026 <no-reply@unesa.ac.id>';

    if (!transporter) {
      console.log(`[EMAIL SIMULATION / LOG]: Sending to ${to}`);
      console.log(`Subject: ${subject}`);
      return { success: true, simulated: true };
    }

    const info = await transporter.sendMail({
      from: fromAddress,
      to,
      subject,
      html,
    });

    console.log('✅ Email successfully sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('❌ Failed to send email:', error);
    return { success: false, error: error.message };
  }
};

// HTML Template 1: Welcome & Password Account Details
export const generateWelcomeEmailHtml = (email: string, pass: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background-color: #FAF7F2; margin: 0; padding: 20px; color: #1D1C1C; }
    .card { max-width: 520px; margin: 0 auto; background: #FFFFFF; border: 3px solid #1D1C1C; border-radius: 16px; padding: 28px; box-shadow: 6px 6px 0px #1D1C1C; }
    .badge { display: inline-block; background-color: #83F582; color: #1D1C1C; font-weight: 900; font-size: 11px; text-transform: uppercase; padding: 4px 10px; border-radius: 999px; border: 2px solid #1D1C1C; }
    .title { font-size: 20px; font-weight: 900; text-transform: uppercase; margin-top: 14px; margin-bottom: 8px; }
    .box { background-color: #FFF48D; border: 2px solid #1D1C1C; border-radius: 12px; padding: 16px; margin: 16px 0; }
    .field { font-size: 12px; font-weight: 800; text-transform: uppercase; color: #555; }
    .val { font-family: monospace; font-size: 15px; font-weight: 900; color: #1D1C1C; margin-bottom: 8px; }
    .footer { font-size: 11px; font-weight: 700; color: #777; margin-top: 20px; text-align: center; border-top: 2px solid #1D1C1C; padding-top: 14px; }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">PRM UNESA 2026</span>
    <h1 class="title">Selamat Datang di Pekan Raya Mahasiswa!</h1>
    <p style="font-size: 13px; font-weight: 600; line-height: 1.5;">
      Akun pendaftaran PRM UNESA 2026 Anda telah berhasil dibuat. Berikut adalah rincian kredensial akun Anda:
    </p>

    <div class="box">
      <div class="field">Email UNESA Terdaftar</div>
      <div class="val">${email}</div>

      <div class="field">Password Akun PRM</div>
      <div class="val">${pass}</div>
    </div>

    <p style="font-size: 12px; font-weight: 700; color: #444;">
      Simpan email ini dengan baik. Anda dapat menggunakan akun ini untuk memantau status pendaftaran UKM secara real-time.
    </p>

    <div class="footer">
      Panitia Pekan Raya Mahasiswa 2026 — Universitas Negeri Surabaya<br>
      Website Resmi: pekanrayamahasiswa.unesa.ac.id
    </div>
  </div>
</body>
</html>
`;

// HTML Template 2: Reset Password Notification
export const generateResetPasswordEmailHtml = (email: string, newPass: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background-color: #FAF7F2; margin: 0; padding: 20px; color: #1D1C1C; }
    .card { max-width: 520px; margin: 0 auto; background: #FFFFFF; border: 3px solid #1D1C1C; border-radius: 16px; padding: 28px; box-shadow: 6px 6px 0px #1D1C1C; }
    .badge { display: inline-block; background-color: #7AF7F2; color: #1D1C1C; font-weight: 900; font-size: 11px; text-transform: uppercase; padding: 4px 10px; border-radius: 999px; border: 2px solid #1D1C1C; }
    .title { font-size: 20px; font-weight: 900; text-transform: uppercase; margin-top: 14px; margin-bottom: 8px; }
    .box { background-color: #7AF7F2; border: 2px solid #1D1C1C; border-radius: 12px; padding: 16px; margin: 16px 0; }
    .field { font-size: 12px; font-weight: 800; text-transform: uppercase; color: #1D1C1C; }
    .val { font-family: monospace; font-size: 18px; font-weight: 900; color: #1D1C1C; margin-top: 4px; }
    .footer { font-size: 11px; font-weight: 700; color: #777; margin-top: 20px; text-align: center; border-top: 2px solid #1D1C1C; padding-top: 14px; }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">Reset Password PRM 2026</span>
    <h1 class="title">Password Baru Akun Anda</h1>
    <p style="font-size: 13px; font-weight: 600; line-height: 1.5;">
      Kami telah menerima permintaan reset password untuk email <strong>${email}</strong>. Berikut adalah password baru Anda:
    </p>

    <div class="box">
      <div class="field">Password Baru Anda:</div>
      <div class="val">${newPass}</div>
    </div>

    <p style="font-size: 12px; font-weight: 700; color: #444;">
      Silakan masuk ke aplikasi menggunakan password baru di atas dan segera perbarui demi keamanan akun Anda.
    </p>

    <div class="footer">
      Panitia Pekan Raya Mahasiswa 2026 — Universitas Negeri Surabaya
    </div>
  </div>
</body>
</html>
`;
