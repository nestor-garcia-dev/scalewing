import { type RadiusStep, type SemanticColorKey } from '@scalewing/tokens';
import {
  forwardRef,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
} from 'react';

import { cx } from '../class-names.js';
import { boxBorderClass, type BoxBorderValue } from '../css/css-box-border.js';
import {
  assertBoxLink,
  boxLinkClass,
  type BoxLinkAppearance,
} from '../css/css-box-link.js';
import {
  columnSpanClassNames,
  type ColumnSpanProps,
} from '../column-span-classes.js';
import { spacingClassNames, type SpacingProps } from '../spacing-classes.js';
import {
  assertBoxExternal,
  externalLinkContent,
  externalLinkRel,
} from './box/external-link.js';
import { tabStop } from '../tab-stop.js';
import {
  visibilityClassNames,
  type VisibilityProps,
} from '../visibility-classes.js';

export type BoxElement =
  | 'div'
  | 'section'
  | 'article'
  | 'header'
  | 'footer'
  | 'main'
  | 'nav'
  | 'aside'
  | 'span'
  | 'a'
  | 'label';

export type BoxProps = SpacingProps &
  VisibilityProps &
  ColumnSpanProps &
  HTMLAttributes<HTMLElement> &
  Pick<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    'download' | 'href' | 'rel' | 'target'
  > & {
    as?: BoxElement;
    background?: Extract<SemanticColorKey, 'background' | 'surface'>;
    radius?: RadiusStep;
    /**
     * A hairline token border: `true` is solid, `'dashed'` marks a space to
     * fill in by hand, `'bottom'` is a hairline under the box only (a
     * full-width bar, such as a section's sub-navigation).
     */
    border?: BoxBorder;
    /**
     * How a `Box as="a"` reads: `accent` (default) is the canvas link;
     * `quiet` keeps the surrounding text's colour at weight 600 and
     * underlines on hover and focus, for a title that opens something,
     * such as a table row's. Weight is its non-colour cue, so use it in
     * text lighter than 600. Only for `as="a"`; an unknown value throws.
     */
    link?: BoxLink;
    /**
     * A `Box as="a"` that opens in a new tab: it sets `target="_blank"`,
     * adds `noopener noreferrer` to `rel`, draws a decorative arrow (↗)
     * after its words and reads `newTabLabel` after its name. Only for
     * `as="a"`; it needs `newTabLabel`.
     */
    external?: boolean;
    /**
     * The hidden words read after an external link's name, in your
     * language, such as "(opens in a new tab)". Required with `external`,
     * refused without it.
     */
    newTabLabel?: string;
  };

export type BoxBorder = BoxBorderValue;
export type BoxLink = BoxLinkAppearance;

export const Box = forwardRef<HTMLElement, BoxProps>(function Box(
  {
    as = 'div',
    background,
    border,
    children,
    className,
    columnSpan,
    external,
    hideBelow,
    hideFrom,
    link,
    newTabLabel,
    padding,
    paddingBottom,
    paddingLeft,
    paddingRight,
    paddingTop,
    paddingX,
    paddingY,
    radius,
    rel,
    style,
    tabIndex,
    target,
    ...rest
  },
  ref,
) {
  assertBoxLink(link, as);
  assertBoxExternal({ as, external, newTabLabel });
  // assertBoxExternal has made sure an external link has its words.
  const opensNewTab = external === true && newTabLabel !== undefined;
  const Component = as;
  // A link with a destination is a tab stop in Safari too (see tabStop).
  const linkTabStop =
    as === 'a' && rest.href !== undefined ? tabStop : undefined;

  return (
    <Component
      ref={ref as never}
      className={cx(
        ...spacingClassNames({
          padding,
          paddingBottom,
          paddingLeft,
          paddingRight,
          paddingTop,
          paddingX,
          paddingY,
        }),
        ...visibilityClassNames({ hideBelow, hideFrom }),
        ...columnSpanClassNames({ columnSpan }),
        boxBorderClass(border),
        boxLinkClass(link),
        className,
      )}
      style={{
        backgroundColor: background
          ? `var(--sw-color-${background})`
          : undefined,
        borderRadius: radius ? `var(--sw-radius-${radius})` : undefined,
        ...style,
      }}
      tabIndex={tabIndex ?? linkTabStop}
      {...rest}
      rel={opensNewTab ? externalLinkRel(rel) : rel}
      target={opensNewTab ? '_blank' : target}
    >
      {opensNewTab ? externalLinkContent(children, newTabLabel) : children}
    </Component>
  );
});
