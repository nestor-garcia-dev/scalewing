import { type SpacingStep, spacingSteps } from './spacing.js';

export const paddingAxes = [
  'all',
  'x',
  'y',
  'top',
  'right',
  'bottom',
  'left',
] as const;

export type PaddingAxis = (typeof paddingAxes)[number];

export const gapAxes = ['all', 'x', 'y'] as const;

export type GapAxis = (typeof gapAxes)[number];

export type SpacingKind = 'padding' | 'gap';

export function spacingClass(
  kind: SpacingKind,
  axis: PaddingAxis | GapAxis,
  step: SpacingStep,
): string {
  if (axis === 'all') {
    return `sw-${kind}-${step}`;
  }

  return `sw-${kind}-${axis}-${step}`;
}

export function paddingClassNames(): string[] {
  return paddingAxes.flatMap((axis) =>
    spacingSteps.map((step) => spacingClass('padding', axis, step)),
  );
}

export function gapClassNames(): string[] {
  return gapAxes.flatMap((axis) =>
    spacingSteps.map((step) => spacingClass('gap', axis, step)),
  );
}

export const layoutClassNames = [
  'sw-stack',
  'sw-inline',
  'sw-wrap',
  'sw-grow',
  'sw-full-width',
  'sw-container',
  'sw-sr-only',
  'sw-align-start',
  'sw-align-center',
  'sw-align-end',
  'sw-align-stretch',
  'sw-justify-start',
  'sw-justify-center',
  'sw-justify-end',
  'sw-justify-between',
] as const;
