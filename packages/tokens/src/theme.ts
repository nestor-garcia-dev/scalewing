import { type ColorTokens, darkColors, lightColors } from './colors.js';
import { controlScale, disabledOpacity, focusRing } from './control.js';
import { elevationScale } from './elevation.js';
import { darkGlass, lightGlass, type GlassTokens } from './glass.js';
import { fontFamily, typographyVariants } from './typography.js';
import { motion } from './motion.js';
import { radiusScale } from './radius.js';
import { spacingScale } from './spacing.js';

export type ColorScheme = 'light' | 'dark';

export type Theme = {
  colorScheme: ColorScheme;
  colors: ColorTokens;
  control: typeof controlScale;
  disabledOpacity: number;
  elevation: typeof elevationScale;
  focusRing: typeof focusRing;
  fontFamily: string;
  glass: GlassTokens;
  motion: typeof motion;
  radius: typeof radiusScale;
  space: typeof spacingScale;
  typography: typeof typographyVariants;
};

export const lightTheme: Theme = {
  colorScheme: 'light',
  colors: lightColors,
  control: controlScale,
  disabledOpacity,
  elevation: elevationScale,
  focusRing,
  fontFamily,
  glass: lightGlass,
  motion,
  radius: radiusScale,
  space: spacingScale,
  typography: typographyVariants,
};

export const darkTheme: Theme = {
  colorScheme: 'dark',
  colors: darkColors,
  control: controlScale,
  disabledOpacity,
  elevation: elevationScale,
  focusRing,
  fontFamily,
  glass: darkGlass,
  motion,
  radius: radiusScale,
  space: spacingScale,
  typography: typographyVariants,
};

export function themeForScheme(colorScheme: ColorScheme): Theme {
  return colorScheme === 'dark' ? darkTheme : lightTheme;
}
