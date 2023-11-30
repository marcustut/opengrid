import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

import '@/app/globals.css';
import { ClientProvider } from '@/components/provider';

const inter = Inter({ subsets: ['latin'] });

const APP_NAME = 'OpenGrid';
const APP_DEFAULT_TITLE = 'OpenGrid';
const APP_TITLE_TEMPLATE = '%s - OpenGrid';
const APP_DESCRIPTION = 'Use electricity smartly.';

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: 'summary',
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
