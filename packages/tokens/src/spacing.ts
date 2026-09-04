export const spacingScale = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 24,
  6: 32,
  8: 48,
} as const;

export type SpacingStep = keyof typeof spacingScale;

export const spacingSteps = Object.keys(spacingScale).map(
  (step) => Number(step) as SpacingStep,
);

export function spacingPx(step: SpacingStep): string {
  return `${spacingScale[step]}px`;
}
