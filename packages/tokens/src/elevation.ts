export const elevationScale = {
  none: 'none',
  sm: '0 1px 2px rgba(0, 0, 0, 0.04), 0 12px 32px rgba(0, 0, 0, 0.06)',
  md: '0 16px 48px rgba(0, 0, 0, 0.1)',
} as const;

export type ElevationStep = keyof typeof elevationScale;
