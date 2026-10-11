import { cx } from '../class-names.js';
import { Box, type BoxProps } from './Box.js';

export type ButtonGroupJustify = 'start' | 'end' | 'between';

export type ButtonGroupProps = BoxProps & {
  /** Where the row sits from the `md` breakpoint up; below it every button stacks full width in source order. */
  justify?: ButtonGroupJustify;
  /**
   * One joined control instead of a row of separate buttons, such as
   * Previous, Today and Next: no gap, single dividers, square inner and
   * rounded outer corners. It keeps its row on a phone and sizes to its
   * buttons, so `justify` does not apply. Its children are `Button`s; name
   * the group with `aria-label`.
   */
  attached?: boolean;
};

/**
 * The action row of a form or dialog: buttons on one line, wrapping when
 * they must, aligned to the end by default. On a phone the same buttons
 * stack full width so each one is a whole-row target, in source order
 * (put the primary action last, as the row already does). It is a `group`,
 * so an `aria-label` names the row for assistive tech.
 */
export function ButtonGroup({
  attached = false,
  className,
  justify = 'end',
  ...rest
}: ButtonGroupProps) {
  return (
    <Box
      className={cx(
        'sw-button-group',
        `sw-button-group-${justify}`,
        attached && 'sw-button-group-attached',
        className,
      )}
      role="group"
      {...rest}
    />
  );
}
