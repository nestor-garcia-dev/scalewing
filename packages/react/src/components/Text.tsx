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
import {
  textClampClass,
  textMaxLines,
  type TextMaxLines,
} from '../css/css-text.js';

export type TextElement =
  'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'label' | 'strong';

export type TextAlign = 'start' | 'center' | 'end';

/** The faces Text sets its words in: the theme's sans or the platform's monospace. */
export const textFonts = ['sans', 'mono'] as const;
export type TextFont = (typeof textFonts)[number];

export { textMaxLines, type TextMaxLines };

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
    /**
     * Cuts the words with "…" after this many lines, such as a long name in
     * a ContextSwitcher's trigger, so a long one cannot push what follows
     * it down. Only the drawing is cut: assistive technology still reads
     * all the words, so show them in full somewhere a sighted person can
     * reach too. Not with `truncate`; anything but 2 or 3 throws a
     * `RangeError`.
     */
    maxLines?: TextMaxLines;
    variant?: TypographyVariant;
  };

const defaultElement: Record<TypographyVariant, TextElement> = {
  body: 'p',
  bodySm: 'p',
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
    maxLines,
    style,
    truncate = false,
    variant = 'body',
    ...rest
  },
  ref,
) {
  if (!textFonts.includes(font))
    throw new RangeError(`Unknown Text font: ${String(font)}`);
  if (maxLines !== undefined && !textMaxLines.includes(maxLines))
    throw new RangeError(`Unknown Text maxLines: ${String(maxLines)}`);
  if (maxLines !== undefined && truncate)
    throw new RangeError('Text takes truncate or maxLines, not both');
  const Component = as ?? defaultElement[variant];

  return (
    <Component
      ref={ref as never}
      className={cx(
        `sw-text-${variant}`,
        align && `sw-text-align-${align}`,
        font === 'mono' && 'sw-font-mono',
        truncate && 'sw-truncate',
        maxLines && textClampClass(maxLines),
        className,
      )}
      style={{ color: `var(--sw-color-${color})`, ...style }}
      {...rest}
    />
  );
});
