import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Playfair_Display } from 'next/font/google';
import './globals.css';
import { AISettingsProvider } from '@/providers/ai-settings';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Coursefinder — Learn without limits',
  description: 'Discover high-quality free courses and build a personalized learning path with AI.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${playfair.variable}`}>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect rx='26' width='100' height='100' fill='%23E85D3F'/><text y='.82em' font-size='72' x='14' fill='white'>C</text></svg>" />
      </head>
      <body className="min-h-screen antialiased">
        <AISettingsProvider>{children}</AISettingsProvider>
      </body>
    </html>
  );
}
