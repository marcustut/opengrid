'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useEffect, useState } from 'react';

import { Background } from '@/components/background';
import { Loading } from '@/components/icons/loading';
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

  const mainCn = 'flex min-h-[calc(100vh-60px)] flex-col items-center justify-between p-24';

  if (!localeLoaded)
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <main className={cn(mainCn, 'flex justify-center items-center')}>
          <Background type="dotted" />
          <div className="flex flex-col justify-center items-center space-y-2 text-stone-300">
            <Loading className="animate-spin" />
            <span className="text-sm">Loading locales...</span>
          </div>
        </main>
      </ThemeProvider>
    );

  return (
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: 3 } } })}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <TypesafeI18n locale={locale}>
          <Navbar />
          <main className={mainCn}>{children}</main>
          <Toaster />
          <ReactQueryDevtools />
        </TypesafeI18n>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
