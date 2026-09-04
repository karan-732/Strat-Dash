import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import { DemoBadge } from '@/components/DemoBadge';

export const metadata: Metadata = {
  title: 'Altrd Sprint Console',
  description: 'Six-phase Altrd Strategy Sprint workspace — outside-in view through to the investment case.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      {/* the ported stylesheet keys every surface off body[data-theme] */}
      <body data-theme="light">
        {children}
        <DemoBadge />
      </body>
    </html>
  );
}
