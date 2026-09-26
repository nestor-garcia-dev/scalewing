export const cardVariants = [
  'glass',
  'outlined',
  'elevated',
  'filled',
] as const;

export type CardVariant = (typeof cardVariants)[number];
