import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pekan Raya Mahasiswa - Universitas Negeri Surabaya',
  description: 'Sistem Informasi Pendaftaran dan Monitoring Unit Kegiatan Mahasiswa (UKM) Pekan Raya Mahasiswa Universitas Negeri Surabaya',
  icons: {
    icon: [
      { url: '/icons/prm-logo.jpg' },
      { url: '/icon.jpg' },
    ],
    shortcut: '/icons/prm-logo.jpg',
    apple: '/icons/prm-logo.jpg',
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
