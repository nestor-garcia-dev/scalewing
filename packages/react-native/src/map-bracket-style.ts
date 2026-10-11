import { type SemanticColorKey, type Theme } from '@scalewing/tokens';
import { type TextStyle, type ViewStyle } from 'react-native';

/** How one side of a bracket match reads. */
export type BracketSideOutcome = 'winner' | 'loser' | 'open' | 'pending';

/**
 * A bracket match card: the outlined card's surface and hairline, dashed
 * while the pairing is tentative (it can still change).
 */
export function mapBracketMatchStyle(
  theme: Theme,
  state: { pressed: boolean; tentative: boolean },
): ViewStyle {
  return {
    backgroundColor: state.pressed ? theme.colors.subtle : theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderStyle: state.tentative ? 'dashed' : 'solid',
    borderWidth: 1,
    paddingHorizontal: theme.space[3],
    paddingVertical: theme.space[2],
    rowGap: theme.space[1],
  };
}

/** A side's name and score: a loser and a placeholder recede. */
export function bracketSideColor(
  outcome: BracketSideOutcome,
): SemanticColorKey {
  return outcome === 'loser' || outcome === 'pending' ? 'muted' : 'text';
}

/** The winner reads in the label weight; everyone else in body. */
export function bracketSideVariant(
  outcome: BracketSideOutcome,
): 'label' | 'body' | 'caption' {
  if (outcome === 'winner') return 'label';
  return outcome === 'pending' ? 'caption' : 'body';
}

/** The muted seed column, wide enough for two digits so names line up. */
export function mapBracketSeedStyle(theme: Theme): TextStyle {
  return { minWidth: theme.space[4] };
}

/**
 * The width the next round keeps at the end edge: a connector, then a
 * sliver of its cards that says there is more to the right.
 */
export function bracketPeekWidth(theme: Theme): number {
  return theme.space[4] + theme.space[8];
}

/**
 * The bracket line joining two cards to the one they feed: it runs from the
 * middle of the first card to the middle of the second, then out to the
 * next round. The cards are the same height, so their middles sit a quarter
 * of the pair in from each end, less a quarter of the gap between them.
 */
export function mapBracketJoinStyle(theme: Theme, gap: number): ViewStyle {
  return {
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
    borderRightWidth: 1,
    borderTopWidth: 1,
    bottom: '25%',
    marginBottom: -gap / 4,
    marginTop: -gap / 4,
    position: 'absolute',
    top: '25%',
    width: theme.space[2],
  };
}

/** The line from a join out to the card it feeds, at the pair's middle. */
export function mapBracketFeedStyle(theme: Theme): ViewStyle {
  return {
    borderColor: theme.colors.border,
    borderTopWidth: 1,
    left: theme.space[2],
    position: 'absolute',
    right: 0,
    top: '50%',
  };
}

/**
 * Text this large leaves no room for a second column, so the bracket shows
 * one round as a plain list (iOS accessibility sizes start near 1.35).
 */
export function bracketShowsNextRound(fontScale: number): boolean {
  return fontScale < 1.35;
}
