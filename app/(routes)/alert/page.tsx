import { AccessControl } from '@/components/access-control';

import { Alerts } from './component';

export default async function Page() {
  return (
    <AccessControl mode={'private'}>
      <Alerts />
    </AccessControl>
  );
}
