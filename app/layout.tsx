import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tafeltjes Quest',
  description: 'Oefen je tafels met een episch ridderavontuur!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
