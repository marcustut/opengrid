import * as React from 'react';
import type { SVGProps } from 'react';

export const ArrowLeft = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    className="arrow"
    viewBox="0 0 15 13"
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M.5 6.648c0-.433.183-.823.476-1.097L5.608.937a1.5 1.5 0 0 1 2.117 2.126L5.632 5.147h7.321a1.5 1.5 0 1 1 0 3H5.631l2.094 2.085a1.5 1.5 0 1 1-2.117 2.126L.942 7.71A1.5 1.5 0 0 1 .5 6.649Z"
      clipRule="evenodd"
    />
  </svg>
);
