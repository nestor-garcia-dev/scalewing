export const radiusScale = {
  none: 0,
  sm: 8,
  md: 16,
  lg: 24,
  pill: 999,
} as const;

export type RadiusStep = keyof typeof radiusScale;
