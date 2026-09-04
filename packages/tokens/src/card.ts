export const cardVariants = ['glass', 'outlined', 'elevated'] as const;

export type CardVariant = (typeof cardVariants)[number];
