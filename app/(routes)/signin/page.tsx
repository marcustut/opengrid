import { LoginForm } from '@/app/(routes)/signin/component';
import { AccessControl } from '@/components/access-control';
import { Background } from '@/components/background';

export default async function Page() {
  return (
    <AccessControl mode={'public-only'}>
      <Background type={'gradient'} className={'opacity-80'} />
      <LoginForm />
    </AccessControl>
  );
}
