export const elevationScale = {
  none: 'none',
  sm: '0 1px 2px rgba(16, 18, 20, 0.06), 0 8px 24px rgba(16, 18, 20, 0.08)',
  md: '0 12px 40px rgba(16, 18, 20, 0.12)',
} as const;

export type ElevationStep = keyof typeof elevationScale;
