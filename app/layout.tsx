import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tafeltjes Quest',
  description: 'Oefen je tafels met een episch ridderavontuur!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Cinzel+Decorative:wght@700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
