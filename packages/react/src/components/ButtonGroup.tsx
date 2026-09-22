import { cx } from '../class-names.js';
import { Box, type BoxProps } from './Box.js';

export type ButtonGroupJustify = 'start' | 'end' | 'between';

export type ButtonGroupProps = BoxProps & {
  /** Where the row sits from the `md` breakpoint up; below it every button stacks full width in source order. */
  justify?: ButtonGroupJustify;
};

/**
 * The action row of a form or dialog: buttons on one line, wrapping when
 * they must, aligned to the end by default. On a phone the same buttons
 * stack full width so each one is a whole-row target, in source order
 * (put the primary action last, as the row already does). It is a `group`,
 * so an `aria-label` names the row for assistive tech.
 */
export function ButtonGroup({
  className,
  justify = 'end',
  ...rest
}: ButtonGroupProps) {
  return (
    <Box
      className={cx('sw-button-group', `sw-button-group-${justify}`, className)}
      role="group"
      {...rest}
    />
  );
}
