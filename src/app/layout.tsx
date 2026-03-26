import type { Metadata, Viewport } from 'next';
import './globals.css';
import PWAProvider from '../components/PWAProvider';

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
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
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
