import * as React from 'react';
import type { SVGProps } from 'react';

export const ErrorCloud = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 16 16" {...props}>
    <path
      fill="currentColor"
      d="M8 3a3 3 0 0 0-3 3 .5.5 0 0 1-.5.5h-.25a2.25 2.25 0 0 0 0 4.5h.772a5.5 5.5 0 0 0 .185 1H4.25a3.25 3.25 0 0 1-.22-6.493 4 4 0 0 1 7.887-.323 5.49 5.49 0 0 0-1.084-.174A3.001 3.001 0 0 0 8 3Zm7 7.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM10.5 8a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 1 0v-2a.5.5 0 0 0-.5-.5Zm0 5.125a.625.625 0 1 0 0-1.25.625.625 0 0 0 0 1.25Z"
    />
  </svg>
);
