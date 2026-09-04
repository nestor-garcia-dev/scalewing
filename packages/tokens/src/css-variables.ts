import { semanticColorKeys } from './colors.js';
import { radiusScale } from './radius.js';
import { spacingScale, spacingSteps } from './spacing.js';
import { type Theme } from './theme.js';

function colorDeclarations(theme: Theme): string {
  return semanticColorKeys
    .map((key) => `  --sw-color-${key}: ${theme.colors[key]};`)
    .join('\n');
}

function sharedDeclarations(theme: Theme): string {
  const space = spacingSteps
    .map((step) => `  --sw-space-${step}: ${spacingScale[step]}px;`)
    .join('\n');
  const radius = Object.entries(radiusScale)
    .map(([name, value]) => `  --sw-radius-${name}: ${value}px;`)
    .join('\n');

  return `${space}
${radius}
  --sw-font-sans: ${theme.fontFamily};
  --sw-elevation-sm: ${theme.elevation.sm};
  --sw-elevation-md: ${theme.elevation.md};
  --sw-container-max: 72rem;`;
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
