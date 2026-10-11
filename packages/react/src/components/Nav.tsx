'use client';

import { cx } from '../class-names.js';
import {
  type NavAppearance,
  navAppearances,
  navWordsClass,
} from '../css/css-nav-words.js';
import { Box, type BoxProps } from './Box.js';

export { navAppearances, type NavAppearance };

export type NavProps = Omit<BoxProps, 'as'> & {
  /**
   * `words` draws every destination (a link or a Button) as plain words:
   * the current one (`aria-current`) in the text color at label weight,
   * the others muted, with no fill or underline. The words must be visible:
   * a glyph-only destination has no weight to change, so its current mark
   * would be color alone (keep `default` there). `default` keeps each
   * destination's own look.
   */
  appearance?: NavAppearance;
};

export function Nav({ appearance = 'default', className, ...rest }: NavProps) {
  if (!(navAppearances as readonly unknown[]).includes(appearance))
    throw new RangeError(`Unknown Nav appearance: ${String(appearance)}`);
  return (
    <Box
      as="nav"
      className={cx(
        'sw-nav',
        appearance === 'words' && navWordsClass,
        className,
      )}
      {...rest}
    />
  );
}
