import {
  controlScale,
  disabledOpacity,
  focusRing,
  quietOpacity,
} from './control.js';
import { semanticColorKeys } from './colors.js';
import { radiusScale } from './radius.js';
import { spacingScale, spacingSteps } from './spacing.js';
import { splitScale } from './split.js';
import { type Theme } from './theme.js';

function colorDeclarations(theme: Theme): string {
  return semanticColorKeys
    .map((key) => `  --sw-color-${key}: ${theme.colors[key]};`)
    .join('\n');
}

function glassDeclarations(theme: Theme): string {
  return `  --sw-glass-blur: ${theme.glass.blur}px;
  --sw-glass-saturate: ${theme.glass.saturate};
  --sw-glass-fill: ${theme.glass.fill};
  --sw-glass-border: ${theme.glass.border};
  --sw-glass-specular: ${theme.glass.specular};`;
}

function sharedDeclarations(theme: Theme): string {
  const space = spacingSteps
    .map((step) => `  --sw-space-${step}: ${spacingScale[step]}px;`)
    .join('\n');
  const radius = Object.entries(radiusScale)
    .map(([name, value]) => `  --sw-radius-${name}: ${value}px;`)
    .join('\n');

  const control = Object.entries(controlScale)
    .flatMap(([size, value]) => [
      `  --sw-control-${size}-min-height: ${value.minHeight}px;`,
      `  --sw-control-${size}-padding-inline: ${value.paddingInline}px;`,
    ])
    .join('\n');

  return `${space}
${radius}
${control}
  --sw-font-sans: ${theme.fontFamily};
  --sw-elevation-sm: ${theme.elevation.sm};
  --sw-elevation-md: ${theme.elevation.md};
  --sw-disabled-opacity: ${disabledOpacity};
  --sw-quiet-opacity: ${quietOpacity};
  --sw-focus-ring-width: ${focusRing.width}px;
  --sw-focus-ring-offset: ${focusRing.offset}px;
  --sw-container-max: 72rem;
  --sw-dialog-max: 32rem;
  --sw-select-max: 16rem;
  --sw-split-min: ${splitScale.min}rem;
  --sw-split-size: ${splitScale.size}rem;
  --sw-split-max: ${splitScale.max}rem;
  --sw-motion-fast: ${theme.motion.duration.fast};
  --sw-motion-default: ${theme.motion.duration.default};
  --sw-motion-travel: ${theme.motion.duration.travel};
  --sw-motion-easing: ${theme.motion.easing.standard};
  --sw-motion-travel-easing: ${theme.motion.easing.travel};
${glassDeclarations(theme)}`;
}

export function cssVariables(light: Theme, dark: Theme): string {
  return `:root,
[data-theme='light'] {
${colorDeclarations(light)}
${sharedDeclarations(light)}
}

[data-theme='dark'] {
${colorDeclarations(dark)}
${sharedDeclarations(dark)}
}`;
}
