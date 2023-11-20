import * as React from 'react';
import type { SVGProps } from 'react';

export const NotificationBell = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 14 14" {...props}>
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.75 5.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM9.933 8v1.534c0 .39.155.766.432 1.042.276.277.744.432 1.135.432H.5c.391 0 .859-.155 1.135-.432a1.47 1.47 0 0 0 .432-1.042V5.933A3.933 3.933 0 0 1 6 2M5 13.5h2"
    />
  </svg>
);
