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
  data: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: 500,
    letterSpacing: -0.08,
    tabularNums: true,
  },
} as const;

export type TypographyVariant = keyof typeof typographyVariants;

/**
 * Sizes the largest variants step down to on a compact (phone-width) canvas,
 * so a page title or a panel figure does not dominate a 390px screen. The
 * other variants keep their size. Web applies these below the `md`
 * breakpoint; native may apply them on narrow windows.
 */
export const compactTypographyVariants = {
  display: { fontSize: 32, lineHeight: 38, letterSpacing: -0.6 },
  heading: { fontSize: 24, lineHeight: 30, letterSpacing: -0.4 },
} as const satisfies Partial<
  Record<
    TypographyVariant,
    { fontSize: number; lineHeight: number; letterSpacing: number }
  >
>;

export type CompactTypographyVariant = keyof typeof compactTypographyVariants;

export const fontFamily =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif';
