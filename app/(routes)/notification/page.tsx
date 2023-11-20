import { AccessControl } from '@/components/access-control';

export default async function Page() {
  return (
    <AccessControl mode={'private'}>
      <div className="dark:text-stone-300">Work in progress...</div>
    </AccessControl>
  );
}
