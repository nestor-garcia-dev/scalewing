import {
  type SemanticColorKey,
  type TypographyVariant,
} from '@scalewing/tokens';
import {
  forwardRef,
  type HTMLAttributes,
  type LabelHTMLAttributes,
} from 'react';

import { cx } from '../class-names.js';

export type TextElement =
  'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'label' | 'strong';

export type TextAlign = 'start' | 'center' | 'end';

/** The faces Text sets its words in: the theme's sans or the platform's monospace. */
export const textFonts = ['sans', 'mono'] as const;
export type TextFont = (typeof textFonts)[number];

export type TextProps = HTMLAttributes<HTMLElement> &
  Pick<LabelHTMLAttributes<HTMLLabelElement>, 'htmlFor'> & {
    align?: TextAlign;
    as?: TextElement;
    color?: SemanticColorKey;
    /**
     * `mono` sets the words in the platform's monospace face (the generated
     * `sw-font-mono` class) at the variant's size, weight and colour, for a
     * code read or typed character by character, such as a join code. The
     * face is fixed-width, so figures line up. Default `sans`; an unknown
     * font throws a `RangeError`.
     */
    font?: TextFont;
    truncate?: boolean;
    variant?: TypographyVariant;
  };

const defaultElement: Record<TypographyVariant, TextElement> = {
  body: 'p',
  caption: 'span',
  data: 'span',
  display: 'h1',
  heading: 'h2',
  headline: 'h2',
  hero: 'h1',
  label: 'span',
  lead: 'p',
  title: 'h3',
};

export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  {
    align,
    as,
    className,
    color = 'text',
    font = 'sans',
    style,
    truncate = false,
    variant = 'body',
    ...rest
  },
  ref,
) {
  if (!textFonts.includes(font))
    throw new RangeError(`Unknown Text font: ${String(font)}`);
  const Component = as ?? defaultElement[variant];

  return (
    <Component
      ref={ref as never}
      className={cx(
        `sw-text-${variant}`,
        align && `sw-text-align-${align}`,
        font === 'mono' && 'sw-font-mono',
        truncate && 'sw-truncate',
        className,
      )}
      style={{ color: `var(--sw-color-${color})`, ...style }}
      {...rest}
    />
  );
});
