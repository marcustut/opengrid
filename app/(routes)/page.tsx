import { NetDemandChart, SystemDemandChart, WindGenerationChart } from '@/app/(routes)/components';

export default function Home() {
  return (
    <>
      <NetDemandChart className="mb-8" />
      <SystemDemandChart className="mb-8" />
      <WindGenerationChart />
    </>
  );
}
