export const typographyVariants = {
  display: {
    fontSize: 40,
    lineHeight: 48,
    fontWeight: 600,
    letterSpacing: -0.8,
  },
  heading: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: 600,
    letterSpacing: -0.45,
  },
  title: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: 600,
    letterSpacing: -0.3,
  },
  body: {
    fontSize: 17,
    lineHeight: 25,
    fontWeight: 400,
    letterSpacing: -0.2,
  },
  label: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: 600,
    letterSpacing: -0.2,
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: 400,
    letterSpacing: -0.08,
  },
} as const;

export type TypographyVariant = keyof typeof typographyVariants;

export const fontFamily =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif';
