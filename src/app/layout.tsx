import type { Metadata, Viewport } from 'next';
import './globals.css';
import PWAProvider from '../components/PWAProvider';
import { Plus_Jakarta_Sans } from 'next/font/google';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
  preload: true,
});

export const viewport: Viewport = {
  themeColor: '#FEFCF9',
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'MasakApa — AI Recipe Finder',
  description:
    'Temukan ide menu masakan dari bahan yang ada di rumah, powered by AI.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MasakApa',
  },
  formatDetection: { telephone: false },
  openGraph: {
    title: 'MasakApa — AI Recipe Finder',
    description: 'Temukan ide menu masakan dari bahan yang ada di rumah.',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/icons/icon-192.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={plusJakarta.variable}>
      <body className="min-h-screen bg-base">
        {children}
        <PWAProvider />
      </body>
    </html>
  );
}
