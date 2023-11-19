'use client';

import { Error } from '@/components/error';
import { Loading } from '@/components/loading';
import { useDemand } from '@/lib/queries/demand';

export const Demand: React.FC = () => {
  const demand = useDemand({
    type: 'forecast',
    region: 'ROI',
    from: new Date('2023-11-18T00:00:00'),
    to: new Date('2023-11-19T00:00:00'),
  });

  if (demand.status === 'pending') return <Loading description="Loading system demand..." />;
  if (demand.status === 'error')
    return <Error title="Failed to load system demand" description={demand.error.message} />;

  return <pre>{JSON.stringify(demand.data, null, 2)}</pre>;
};
