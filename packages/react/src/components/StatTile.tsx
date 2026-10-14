import { type HTMLAttributes, type ReactNode } from 'react';

import { cx } from '../class-names.js';
import {
  type StatTileAppearance,
  statTileAppearances,
  type StatTileTone,
  statTileTones,
} from '../css/css-stat-tile.js';
import { Text } from './Text.js';

export type { StatTileAppearance, StatTileTone };
export { statTileAppearances, statTileTones };

export type StatTileEmphasis = 'default' | 'primary';

export type StatTileProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  /** A short name for the figure, set in the label variant. */
  label: ReactNode;
  /** The figure, already formatted by the consumer; tabular numerals. */
  value: ReactNode;
  /** The consumer's glyph (Lucide), shown in a tinted circle before the text. */
  glyph?: ReactNode;
  /** Colours the value through `Text color`: the sign of a variance, a count that needs attention. */
  tone?: StatTileTone;
  /** A second line under the value: a breakdown, a unit, a comparison. */
  caption?: ReactNode;
  /** `primary` fills the tile in the accent for the one figure a page leads with. */
  emphasis?: StatTileEmphasis;
  /**
   * `plain` drops the tile's surface, edge and padding, so the figure sits
   * inside a card that already has them, such as four answers in a row
   * with hairlines between them. A plain tile cannot be `primary`, which
   * is a fill. Default `card`.
   */
  appearance?: StatTileAppearance;
};

function assertStatTile(appearance: unknown, emphasis: StatTileEmphasis) {
  if (!(statTileAppearances as readonly unknown[]).includes(appearance))
    throw new RangeError(`Unknown StatTile appearance: ${String(appearance)}`);
  if (appearance === 'plain' && emphasis === 'primary')
    throw new RangeError(
      'A plain StatTile has no surface to fill; emphasis primary needs appearance card',
    );
}

/**
 * One prominent figure with its label: the tiles a report or a list opens
 * with. Presentation only; the consumer formats the number and picks the
 * glyph.
 */
export function StatTile({
  appearance = 'card',
  caption,
  className,
  emphasis = 'default',
  glyph,
  label,
  tone = 'default',
  value,
  ...rest
}: StatTileProps) {
  assertStatTile(appearance, emphasis);
  const primary = emphasis === 'primary';

  return (
    <section
      className={cx(
        'sw-stat-tile',
        appearance === 'plain' && 'sw-stat-tile-plain',
        primary && 'sw-stat-tile-primary',
        className,
      )}
      {...rest}
    >
      {glyph ? (
        <span aria-hidden="true" className="sw-stat-tile-glyph">
          {glyph}
        </span>
      ) : null}
      <span className="sw-stat-tile-body">
        <Text
          as="span"
          className="sw-stat-tile-label"
          color={primary ? 'onAccent' : 'muted'}
          variant="label"
        >
          {label}
        </Text>
        <Text
          as="strong"
          className="sw-stat-tile-value"
          color={primary ? 'onAccent' : tone === 'default' ? 'text' : tone}
          variant="heading"
        >
          {value}
        </Text>
        {caption ? (
          <Text
            as="span"
            className="sw-stat-tile-caption"
            color={primary ? 'onAccent' : 'muted'}
            variant="caption"
          >
            {caption}
          </Text>
        ) : null}
      </span>
    </section>
  );
}
