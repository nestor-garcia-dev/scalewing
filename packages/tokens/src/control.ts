export const buttonVariants = [
  'primary',
  'secondary',
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

export const disabledOpacity = 0.4;

export const quietOpacity = 0.55;

export const focusRing = {
  offset: 2,
  width: 2,
} as const;

export const trackInset = 2;

export function buttonClassNames(options: {
  size: ButtonSize;
  variant: ButtonVariant;
}): string[] {
  return [
    'sw-button',
    `sw-button-${options.variant}`,
    `sw-button-${options.size}`,
  ];
}
