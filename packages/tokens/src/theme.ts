import { type ColorTokens, darkColors, lightColors } from './colors.js';
import { elevationScale } from './elevation.js';
import { fontFamily, typographyVariants } from './typography.js';
import { motion } from './motion.js';
import { radiusScale } from './radius.js';
import { spacingScale } from './spacing.js';

export type ColorScheme = 'light' | 'dark';

export type Theme = {
  colorScheme: ColorScheme;
  colors: ColorTokens;
  space: typeof spacingScale;
  radius: typeof radiusScale;
  typography: typeof typographyVariants;
  elevation: typeof elevationScale;
  motion: typeof motion;
  fontFamily: string;
};

export const lightTheme: Theme = {
  colorScheme: 'light',
  colors: lightColors,
  elevation: elevationScale,
  fontFamily,
  motion,
  radius: radiusScale,
  space: spacingScale,
  typography: typographyVariants,
};

export const darkTheme: Theme = {
  colorScheme: 'dark',
  colors: darkColors,
  elevation: elevationScale,
  fontFamily,
  motion,
  radius: radiusScale,
  space: spacingScale,
  typography: typographyVariants,
};

export function themeForScheme(colorScheme: ColorScheme): Theme {
  return colorScheme === 'dark' ? darkTheme : lightTheme;
}
