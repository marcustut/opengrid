import * as React from 'react';
import type { SVGProps } from 'react';

export const DashboardDots = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
    <g
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    >
      <path d="m12 7.01.01-.011M16 9.01l.01-.011M8 9.01l.01-.011M18 13.01l.01-.011M6 13.01l.01-.011M17 17.01l.01-.011M7 17.01l.01-.011M12 17l1-6m-4.5 9.001H4A9.956 9.956 0 0 1 2 14C2 8.477 6.477 4 12 4s10 4.477 10 10c0 2.252-.744 4.33-2 6.001L15.5 20" />
      <path d="M12 23a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
    </g>
  </svg>
);
