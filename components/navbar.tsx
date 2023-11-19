'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { DetailedHTMLProps, HTMLAttributes } from 'react';

import { GridOutline } from '@/components/icons/grid-outline';
import { LocaleToggler } from '@/components/locale-toggler';
import { ThemeToggler } from '@/components/theme-toggler';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { createSupabase } from '@/lib/client/supabase';
import { SECOND, useTimer } from '@/lib/client/timer';
import { useI18nContext } from '@/lib/i18n/i18n-react';
import { useSession } from '@/lib/queries/session';
import { cn } from '@/lib/utils';

export const Navbar: React.FC<DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>> = (
  props,
) => {
  const supabase = createSupabase();
  const session = useSession();
  const { replace } = useRouter();
  const time = useTimer(SECOND);
  const { LL } = useI18nContext();

  return (
    <nav
      {...props}
      className={cn('w-full flex justify-between items-center px-4 py-3', props.className)}
    >
      <Link
        href={'/'}
        className={
          'flex justify-center items-center space-x-1.5 text-stone-400 font-semibold hover:text-stone-100 duration-150'
        }
      >
        <GridOutline />
        <span>OpenGrid</span>
      </Link>

      {/* <div className="fixed left-1/2 -translate-x-1/2 max-w-6xl w-full mx-auto">
        {[{ name: 'Home', path: '/' }].map(({ name, path }) => (
          <Link key={name} href={path}>
            <Button variant="link" className={'text-white'}>
              {name}
            </Button>
          </Link>
        ))}
      </div> */}

      <div className={'flex items-center space-x-4'}>
        <span className={'hidden sm:block font-medium text-sm text-stone-400'}>
          {new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZoneName: 'short',
          }).format(time)}
        </span>
        <LocaleToggler />
        <ThemeToggler />
        {session.error ? (
          <>error: {session.error.message}</>
        ) : !session.data ? (
          <Skeleton className="h-9 w-24" />
        ) : !session.data.session ? (
          <Link href={'/signin'}>
            <Button variant={'secondary'}>{LL.auth.signIn()}</Button>
          </Link>
        ) : (
          <Button
            variant={'secondary'}
            onClick={() =>
              supabase.auth.signOut().then(async () => {
                await session.refetch();
                replace('/');
              })
            }
          >
            {LL.auth.signOut()}
          </Button>
        )}
      </div>
    </nav>
  );
};
