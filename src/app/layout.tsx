import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pekan Raya Mahasiswa - Universitas Negeri Surabaya',
  description: 'Sistem Informasi Pendaftaran dan Monitoring Unit Kegiatan Mahasiswa (UKM) Pekan Raya Mahasiswa Universitas Negeri Surabaya',
  icons: {
    icon: [
      { url: '/icons/prm-logo.jpg?v=20260824' },
      { url: '/favicon.ico?v=20260824' },
    ],
    shortcut: '/icons/prm-logo.jpg?v=20260824',
    apple: '/apple-icon.png?v=20260824',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased selection:bg-[#FFF48D] selection:text-[#1D1C1C]">
        {children}
      </body>
    </html>
  );
}
