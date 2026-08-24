import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pekan Raya Mahasiswa - Universitas Negeri Surabaya',
  description: 'Sistem Informasi Pendaftaran dan Monitoring Unit Kegiatan Mahasiswa (UKM) Pekan Raya Mahasiswa Universitas Negeri Surabaya',
  icons: {
    icon: [
      { url: '/PRM-fav.png?v=20260824_v4', type: 'image/png' },
      { url: '/favicon.ico?v=20260824_v4' },
    ],
    shortcut: '/PRM-fav.png?v=20260824_v4',
    apple: '/PRM-fav.png?v=20260824_v4',
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <body className="antialiased selection:bg-[#FFF48D] selection:text-[#1D1C1C]">
        {children}
      </body>
    </html>
  );
}
