import { type RadiusStep, type SemanticColorKey } from '@scalewing/tokens';
import {
  forwardRef,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
} from 'react';

import { cx } from '../class-names.js';
import { spacingClassNames, type SpacingProps } from '../spacing-classes.js';

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
  HTMLAttributes<HTMLElement> &
  Pick<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    'download' | 'href' | 'rel' | 'target'
  > & {
    as?: BoxElement;
    background?: Extract<SemanticColorKey, 'background' | 'surface'>;
    radius?: RadiusStep;
    border?: boolean;
  };

export const Box = forwardRef<HTMLElement, BoxProps>(function Box(
  {
    as = 'div',
    background,
    border,
    className,
    padding,
    paddingBottom,
    paddingLeft,
    paddingRight,
    paddingTop,
    paddingX,
    paddingY,
    radius,
    style,
    ...rest
  },
  ref,
) {
  const Component = as;

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
        className,
      )}
      style={{
        backgroundColor: background
          ? `var(--sw-color-${background})`
          : undefined,
        border: border ? '1px solid var(--sw-color-border)' : undefined,
        borderRadius: radius ? `var(--sw-radius-${radius})` : undefined,
        ...style,
      }}
      {...rest}
    />
  );
});
