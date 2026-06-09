import type { Metadata } from 'next';
import { Cinzel, Cinzel_Decorative } from 'next/font/google';
import './globals.css';

// Fonts are self-hosted at build time — no Google CDN dependency on Vercel.
// next/font injects @font-face with the original family names ("Cinzel",
// "Cinzel Decorative") so Phaser canvas text can reference them as-is.
const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  display: 'swap',
  variable: '--font-cinzel',
});

const cinzelDecorative = Cinzel_Decorative({
  subsets: ['latin'],
  weight: ['700'],
  display: 'swap',
  variable: '--font-cinzel-decorative',
});

export const metadata: Metadata = {
  title: 'Tafeltjes Quest',
  description: 'Oefen je tafels met een episch ridderavontuur!',
  openGraph: {
    title: 'Tafeltjes Quest',
    description: 'Oefen je tafels met een episch ridderavontuur!',
    images: ['/logo.svg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className={`${cinzel.variable} ${cinzelDecorative.variable}`}>
      {/* Applying both classNames to body forces the browser to load both fonts
          so they are ready when Phaser creates canvas Text objects. */}
      <body className={`${cinzel.className} ${cinzelDecorative.className}`}>
        {children}
      </body>
    </html>
  );
}
