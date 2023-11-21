'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useEffect, useState } from 'react';

import { Background } from '@/components/background';
import { Loading } from '@/components/loading';
import { Navbar } from '@/components/navbar';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import TypesafeI18n from '@/lib/i18n/i18n-react';
import type { Locales } from '@/lib/i18n/i18n-types';
import { loadLocaleAsync } from '@/lib/i18n/i18n-util.async';
import { cn } from '@/lib/utils';

export const ClientProvider: React.FC<{ children: React.ReactNode; locale: Locales }> = ({
  children,
  locale,
}) => {
  const [localeLoaded, setLocaleLoaded] = useState(false);

  useEffect(() => {
    loadLocaleAsync(locale).then(() => setLocaleLoaded(true));
  }, []);

  const mainCn = cn(
    'flex min-h-[calc(100vh-60px)] max-w-6xl mx-auto flex-col items-center justify-between p-10 sm:p-12 md:p-32 xl:p-24',
    'text-stone-950 dark:text-stone-50',
  );

  if (!localeLoaded)
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <Background type="dotted" />
        <main className={cn(mainCn, 'flex justify-center items-center')}>
          <Loading description="Loading locales..." />
        </main>
      </ThemeProvider>
    );

  return (
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: 3 } } })}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <TypesafeI18n locale={locale}>
          <Navbar />
          <Background type="dotted" />
          <main className={mainCn}>{children}</main>
          <Toaster />
          <ReactQueryDevtools />
        </TypesafeI18n>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
