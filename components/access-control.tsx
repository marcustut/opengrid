'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

import { useSession } from '@/lib/queries/session';

enum Mode {
  Private = 'private',
  Public = 'public',
  PublicOnly = 'public-only',
}

export const AccessControl: React.FC<{ children: React.ReactNode; mode: `${Mode}` }> = ({
  children,
  mode,
}) => {
  const session = useSession();

  useEffect(() => {
    if (!session.data) return;

    switch (mode) {
      case Mode.Private:
        if (!session.data.session) redirect('/');
        break;
      case Mode.PublicOnly:
        if (session.data.session) redirect('/');
        break;
      case Mode.Public:
        break;
    }
  }, [session.data, mode]);

  return <>{children}</>;
};
