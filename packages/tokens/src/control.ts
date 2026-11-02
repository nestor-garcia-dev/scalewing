export const buttonVariants = [
  'primary',
  'secondary',
  'tertiary',
  'ghost',
  'danger',
] as const;

export type ButtonVariant = (typeof buttonVariants)[number];

export const buttonSizes = ['xs', 'sm', 'md'] as const;

export type ButtonSize = (typeof buttonSizes)[number];

export const controlScale = {
  xs: {
    minHeight: 28,
    paddingInline: 10,
  },
  sm: {
    minHeight: 32,
    paddingInline: 12,
  },
  md: {
    minHeight: 44,
    paddingInline: 16,
  },
} as const;

export type ControlSize = keyof typeof controlScale;

/**
 * The control sizes of an opt-in compact density, for a desktop data tool on
 * a fine pointer. md steps from 44 to 36 and sm and xs step down in
 * proportion, on the same 4-point grid (about 0.85 of their height): 28 and
 * 24 still hold a label's 20-point line and a border. Touch keeps
 * `controlScale`, whatever the density.
 */
export const compactControlScale = {
  xs: {
    minHeight: 24,
    paddingInline: 8,
  },
  sm: {
    minHeight: 28,
    paddingInline: 10,
  },
  md: {
    minHeight: 36,
    paddingInline: 14,
  },
} as const satisfies Record<
  ControlSize,
  { minHeight: number; paddingInline: number }
>;

/** A filter chip's height in the compact density, between sm and md. */
export const compactFilterChipMinHeight = 32;

export const disabledOpacity = 0.4;

export const quietOpacity = 0.55;

export const focusRing = {
  offset: 2,
  width: 2,
} as const;

export const trackInset = 2;
