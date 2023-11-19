import type { SVGProps } from 'react';

export const Door = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    className="door"
    viewBox="0 0 40 40"
    {...props}
  >
    <rect
      width={28}
      height={38}
      x={6}
      y={1}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      rx={6}
    />
    <rect width={20} height={38} x={6} y={1} stroke="currentColor" strokeWidth={2} rx={6} />
    <circle cx={21.5} cy={20.5} r={1.5} fill="currentColor" />
  </svg>
);
