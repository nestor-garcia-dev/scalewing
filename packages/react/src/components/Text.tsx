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

export type TextProps = HTMLAttributes<HTMLElement> &
  Pick<LabelHTMLAttributes<HTMLLabelElement>, 'htmlFor'> & {
    align?: TextAlign;
    as?: TextElement;
    color?: SemanticColorKey;
    truncate?: boolean;
    variant?: TypographyVariant;
  };

const defaultElement: Record<TypographyVariant, TextElement> = {
  body: 'p',
  caption: 'span',
  data: 'span',
  display: 'h1',
  heading: 'h2',
  label: 'span',
  title: 'h3',
};

export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  {
    align,
    as,
    className,
    color = 'text',
    style,
    truncate = false,
    variant = 'body',
    ...rest
  },
  ref,
) {
  const Component = as ?? defaultElement[variant];

  return (
    <Component
      ref={ref as never}
      className={cx(
        `sw-text-${variant}`,
        align && `sw-text-align-${align}`,
        truncate && 'sw-truncate',
        className,
      )}
      style={{ color: `var(--sw-color-${color})`, ...style }}
      {...rest}
    />
  );
});
