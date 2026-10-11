import { cx } from '../class-names.js';
import {
  type ButtonGroupAppearance,
  buttonGroupAppearances,
  buttonGroupTrackClass,
} from '../css/css-button-group-track.js';
import { Box, type BoxProps } from './Box.js';

export type ButtonGroupJustify = 'start' | 'end' | 'between';

export { buttonGroupAppearances, type ButtonGroupAppearance };

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
  /**
   * `track` (an `attached` group only) sets its buttons as words on one
   * quiet grey track with a hairline between them, whatever their
   * variant; `default` keeps each button's own fill and outline.
   */
  appearance?: ButtonGroupAppearance;
};

/**
 * The action row of a form or dialog: buttons on one line, wrapping when
 * they must, aligned to the end by default. On a phone the same buttons
 * stack full width so each one is a whole-row target, in source order
 * (put the primary action last, as the row already does). It is a `group`,
 * so an `aria-label` names the row for assistive tech.
 */
export function ButtonGroup({
  appearance = 'default',
  attached = false,
  className,
  justify = 'end',
  ...rest
}: ButtonGroupProps) {
  if (!(buttonGroupAppearances as readonly unknown[]).includes(appearance))
    throw new RangeError(
      `Unknown ButtonGroup appearance: ${String(appearance)}`,
    );
  if (appearance === 'track' && !attached)
    throw new RangeError('ButtonGroup appearance="track" needs attached');
  return (
    <Box
      className={cx(
        'sw-button-group',
        `sw-button-group-${justify}`,
        attached && 'sw-button-group-attached',
        appearance === 'track' && buttonGroupTrackClass,
        className,
      )}
      role="group"
      {...rest}
    />
  );
}
