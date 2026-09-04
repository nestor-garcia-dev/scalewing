export type GlassTokens = {
  blur: number;
  border: string;
  fill: string;
  saturate: number;
};

export const lightGlass: GlassTokens = {
  blur: 24,
  border: 'rgba(255, 255, 255, 0.62)',
  fill: 'rgba(255, 255, 255, 0.78)',
  saturate: 1.8,
};

export const darkGlass: GlassTokens = {
  blur: 24,
  border: 'rgba(255, 255, 255, 0.16)',
  fill: 'rgba(28, 28, 30, 0.72)',
  saturate: 1.8,
};
