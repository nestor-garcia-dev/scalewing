export const typographyVariants = {
  display: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: 800,
    letterSpacing: -0.8,
  },
  heading: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 700,
    letterSpacing: -0.4,
  },
  title: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: 700,
    letterSpacing: -0.2,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 400,
    letterSpacing: 0,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 600,
    letterSpacing: 0.2,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: 500,
    letterSpacing: 0.2,
  },
} as const;

export type TypographyVariant = keyof typeof typographyVariants;

export const fontFamily =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif';
