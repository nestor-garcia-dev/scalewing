'use client';

import { cx } from '../class-names.js';
import {
  type AppHeaderAppearance,
  appHeaderAppearances,
  appHeaderBarClass,
} from '../css/css-app-header-bar.js';
import { Box, type BoxProps } from './Box.js';

export { appHeaderAppearances, type AppHeaderAppearance };

export type AppHeaderProps = Omit<BoxProps, 'as'> & {
  sticky?: boolean;
  /**
   * `bar` draws the header as a full-width band of the solid surface with
   * a hairline under it and no rounding; `glass` (the default) is the
   * rounded frosted card.
   */
  appearance?: AppHeaderAppearance;
};

export function AppHeader({
  appearance = 'glass',
  className,
  padding = 4,
  sticky = true,
  ...rest
}: AppHeaderProps) {
  if (!(appHeaderAppearances as readonly unknown[]).includes(appearance))
    throw new RangeError(`Unknown AppHeader appearance: ${String(appearance)}`);
  return (
    <Box
      as="header"
      className={cx(
        'sw-app-header',
        appearance === 'bar' && appHeaderBarClass,
        sticky && 'sw-app-header-sticky',
        className,
      )}
      padding={padding}
      {...rest}
    />
  );
}
