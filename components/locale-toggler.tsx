'use client';

import { GlobeIcon } from '@radix-ui/react-icons';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useI18nContext } from '@/lib/i18n/i18n-react';
import type { Locales } from '@/lib/i18n/i18n-types';
import { loadedLocales } from '@/lib/i18n/i18n-util';
import { loadFormatters, loadLocaleAsync } from '@/lib/i18n/i18n-util.async';

import { CheckBold } from './icons/check-bold';
import { FlagEngland } from './icons/flag-england';
import { FlagIreland } from './icons/flag-ireland';

export function LocaleToggler() {
  const { locale, setLocale } = useI18nContext();

  const handleLocaleChange = React.useCallback(
    async (locale: Locales) => {
      if (!(locale in loadedLocales)) {
        await loadLocaleAsync(locale);
        loadFormatters(locale);
      }
      setLocale(locale);
    },
    [loadedLocales],
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <GlobeIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          <span className="sr-only">Toggle locale</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleLocaleChange('en')}>
          <div className="w-full flex items-center">
            <FlagEngland className="w-4 h-4 rounded-[5px] mr-1.5" />
            English
            {locale === 'en' && <CheckBold className="ml-auto w-3 h-3" />}
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLocaleChange('ga')}>
          <div className="w-full flex items-center">
            <FlagIreland className="w-4 h-4 rounded-[5px] mr-1.5" />
            Gaeilge
            {locale === 'ga' && <CheckBold className="ml-auto w-3 h-3" />}
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
