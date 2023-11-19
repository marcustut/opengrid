import { Demand } from '@/app/(routes)/components';
import { Background } from '@/components/background';

export default function Home() {
  return (
    <>
      <Demand />
      <Background type={'dotted'} />
    </>
  );
}
