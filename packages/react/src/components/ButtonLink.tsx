import { type ButtonSize, buttonSizes } from '@scalewing/tokens';
import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from 'react';

import { cx } from '../class-names.js';
import {
  buttonClassNames,
  type WebButtonVariant,
  webButtonVariants,
} from '../css/css-button.js';
import {
  type ButtonWidth,
  buttonWidthClass,
  buttonWidths,
} from '../css/css-button-width.js';
import { buttonLinkClass } from '../css/css-button-link.js';
import { isOneOf } from '../is-one-of.js';
import { tabStop } from '../tab-stop.js';

export type ButtonLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'href' | 'style'
> & {
  /** Where the link goes. */
  href: string;
  children: ReactNode;
  size?: ButtonSize;
  /** The Button's variants: `primary` (default), `secondary`, `tertiary`, `ghost`, `danger`, `neutral`. */
  variant?: WebButtonVariant;
  /** `content` (default) is as wide as the words; `full` fills the container. */
  width?: ButtonWidth;
};

/**
 * A link drawn as a Button, for a destination that reads as an action, such
 * as a site's "Contact us" or "Sign in": an `<a href>` with the Button's
 * variants, sizes and width, so it opens like any link (a new tab, a
 * server-rendered page with no script). `aria-current="page"` marks the
 * one that is the current page with the pressed ring. A link has no
 * disabled state; render no link instead. An unknown variant, size or
 * width throws a `RangeError`.
 */
export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  function ButtonLink(
    {
      children,
      className,
      href,
      size = 'md',
      tabIndex,
      variant = 'primary',
      width = 'content',
      ...rest
    },
    ref,
  ) {
    if (!isOneOf(webButtonVariants, variant))
      throw new RangeError(`Unknown ButtonLink variant: ${String(variant)}`);
    if (!isOneOf(buttonSizes, size))
      throw new RangeError(`Unknown ButtonLink size: ${String(size)}`);
    if (!isOneOf(buttonWidths, width))
      throw new RangeError(`Unknown ButtonLink width: ${String(width)}`);
    return (
      <a
        ref={ref}
        className={cx(
          ...buttonClassNames({ size, variant }),
          buttonLinkClass,
          buttonWidthClass(width),
          className,
        )}
        href={href}
        tabIndex={tabIndex ?? tabStop}
        {...rest}
      >
        {children}
      </a>
    );
  },
);
