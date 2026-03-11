import type { Metadata, Viewport } from 'next';
import './globals.css';
import PWAProvider from '../components/PWAProvider';

export const viewport: Viewport = {
  themeColor: '#0c0c0d',
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
    statusBarStyle: 'black-translucent',
    title: 'MasakApa',
    startupImage: '/icons/icon-512.png',
  },
  formatDetection: { telephone: false },
  openGraph: {
    title: 'MasakApa — AI Recipe Finder',
    description: 'Temukan ide menu masakan dari bahan yang ada di rumah.',
    type: 'website',
  },
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-192.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        {/* iOS PWA meta */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="MasakApa" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="min-h-screen bg-base">
        {children}
        <PWAProvider />
      </body>
    </html>
  );
}
