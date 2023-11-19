import type { Config } from 'tailwindcss';
import resolveConfig from 'tailwindcss/resolveConfig';

import _tailwindConfig from '@/tailwind.config';

type DefaultColor = {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
};

export const tailwindConfig = resolveConfig<Config>(_tailwindConfig);
export const theme = tailwindConfig.theme! as {
  colors: {
    white: string;
    black: string;
    red: DefaultColor;
    neutral: DefaultColor;
  } & (typeof _tailwindConfig)['theme']['extend']['colors'];
};
