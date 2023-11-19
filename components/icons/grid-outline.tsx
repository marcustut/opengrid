import * as React from 'react';
import type { SVGProps } from 'react';

export const GridOutline = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={32}
    height={32}
    viewBox="0 0 512 512"
    fill={'currentColor'}
    {...props}
  >
    <path id="Grid 1" d="M80 84h90.3v90.3H80z" />
    <path id="Grid 2" d="M212.9 84h90.3v90.3h-90.3z" />
    <path id="Grid 3" d="M341.9 84h90.3v90.3h-90.3z" />
    <path id="Grid 4" d="M80 210.4h90.3v90.3H80z" />
    <path id="Grid 5" d="M212.9 210.4h90.3v90.3h-90.3z" />
    <path id="Grid 6" d="M341.9 210.4h90.3v90.3h-90.3z" />
    <path id="Grid 7" d="M80 338.1h90.3v90.3H80z" />
    <path id="Grid 8" d="M212.9 338.1h90.3v90.3h-90.3z" />
    <path id="Grid 9" d="M341.9 338.1h90.3v90.3h-90.3z" />
  </svg>
);
