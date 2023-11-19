import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import '@/app/globals.css';
import { ClientProvider } from '@/components/provider';
import { detectLocale } from '@/lib/i18n/i18n-util';
import { loadFormatters, loadLocaleAsync } from '@/lib/i18n/i18n-util.async';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'OpenGrid',
  description: 'Use electricity smartly.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = detectLocale();
  await loadLocaleAsync(locale);
  loadFormatters(locale);

  return (
    <html lang={locale}>
      <body className={`${inter.className}`}>
        <ClientProvider locale={locale}>{children}</ClientProvider>
      </body>
    </html>
  );
}
