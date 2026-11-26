import { type Theme } from '@scalewing/tokens';
import { type ReactNode } from 'react';
import { type ViewStyle } from 'react-native';

import { mapCardViewStyle } from './map-card-style.js';
import { isAccessibilityTextScale } from './text-scale.js';

/** The most detail lines a match card shows under its sides. */
export const matchCardDetailLimit = 2;

/** One team of a match card. */
export type MatchCardSide = {
  /** A muted line under the name, such as "Home" or "Away". */
  caption?: string;
  /**
   * The consumer's crest image, drawn in the round mark; it should fill
   * the mark (width and height `100%`). Without it the mark shows initials.
   */
  crest?: ReactNode;
  /** The mark's letters; without them, the first letters of the name. */
  initials?: string;
  name: string;
};

/**
 * Up to two letters for a side's mark: the first letter of each of the
 * first two words, or the first two letters of a one-word name.
 */
export function matchCardInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const letters =
    words.length >= 2
      ? words.slice(0, 2).map((word) => Array.from(word)[0] ?? '')
      : Array.from(words[0] ?? '').slice(0, 2);
  return letters.join('').toLocaleUpperCase();
}

/** The card's one accessible name: its visible lines in reading order. */
export function matchCardName(options: {
  details: readonly string[];
  leading?: string;
  sides: readonly [MatchCardSide, MatchCardSide];
  versus: string;
  when: string;
}): string {
  const [home, away] = options.sides;
  return [
    options.leading,
    options.when,
    home.name,
    home.caption,
    options.versus,
    away.name,
    away.caption,
    ...options.details,
  ]
    .filter(Boolean)
    .join(', ');
}

/** Fails closed on more detail lines than the card has room for. */
export function assertMatchCardDetails(details: readonly string[]): void {
  if (details.length > matchCardDetailLimit)
    throw new RangeError(
      `MatchCard shows at most ${matchCardDetailLimit} detail lines, got ${details.length}`,
    );
}

/**
 * The outlined card's surface, hairline, and large radius, filled with the
 * quiet `subtle` colour while pressed, like a pressed list row.
 */
export function mapMatchCardStyle(
  theme: Theme,
  state: { pressed: boolean },
): ViewStyle {
  return {
    ...mapCardViewStyle(theme, 'outlined'),
    backgroundColor: state.pressed ? theme.colors.subtle : theme.colors.surface,
    gap: theme.space[3],
    padding: theme.space[4],
  };
}

/** At accessibility text sizes the two sides stack, each at full width. */
export function matchCardStacksSides(fontScale: number): boolean {
  return isAccessibilityTextScale(fontScale);
}

/** The two sides and "vs": in a row, or stacked at large text sizes. */
export function mapMatchCardSidesStyle(
  theme: Theme,
  stacked: boolean,
): ViewStyle {
  return {
    alignItems: stacked ? 'stretch' : 'flex-start',
    flexDirection: stacked ? 'column' : 'row',
    gap: theme.space[3],
  };
}

/** One side: its mark, name, and caption centred in an equal share. */
export function mapMatchCardSideStyle(
  theme: Theme,
  stacked: boolean,
): ViewStyle {
  return {
    alignItems: 'center',
    flex: stacked ? undefined : 1,
    gap: theme.space[2],
    minWidth: 0,
  };
}

/** The round mark that holds a crest or initials, as on a match page. */
export function mapMatchCardCrestStyle(theme: Theme): ViewStyle {
  const size = theme.space[6];
  return {
    alignItems: 'center',
    backgroundColor: theme.colors.border,
    borderRadius: theme.radius.pill,
    flexShrink: 0,
    height: size,
    justifyContent: 'center',
    overflow: 'hidden',
    width: size,
  };
}

/** "vs" sits level with the marks' centres, or centred when stacked. */
export function mapMatchCardVersusStyle(
  theme: Theme,
  stacked: boolean,
): ViewStyle {
  if (stacked) return { alignSelf: 'center' };
  return {
    paddingTop: (theme.space[6] - theme.typography.caption.lineHeight) / 2,
  };
}

/** The top row: the leading and when lines, then the chevron. */
export function mapMatchCardHeaderStyle(theme: Theme): ViewStyle {
  return { alignItems: 'center', flexDirection: 'row', gap: theme.space[2] };
}

/** The leading and when lines take the width the chevron leaves. */
export function mapMatchCardTitleStyle(theme: Theme): ViewStyle {
  return { flex: 1, gap: theme.space[1], minWidth: 0 };
}

/** The detail lines, centred under the sides. */
export function mapMatchCardDetailsStyle(theme: Theme): ViewStyle {
  return { alignItems: 'center', gap: theme.space[1] };
}
