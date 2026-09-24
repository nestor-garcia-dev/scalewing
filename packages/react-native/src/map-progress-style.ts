import { type Theme } from '@scalewing/tokens';
import { type ViewStyle } from 'react-native';

export type ProgressTone = 'accent' | 'success' | 'danger';

/** Label on the start side and the count on the end side, one row. */
export function mapProgressHeadingStyle(theme: Theme): ViewStyle {
  return {
    alignItems: 'baseline',
    flexDirection: 'row',
    gap: theme.space[2],
    justifyContent: 'space-between',
    minWidth: 0,
  };
}

/** The pill track, the border color like the web track. */
export function mapProgressTrackStyle(theme: Theme): ViewStyle {
  return {
    alignSelf: 'stretch',
    backgroundColor: theme.colors.border,
    borderRadius: theme.radius.pill,
    height: theme.space[2],
    overflow: 'hidden',
  };
}

/** The fill, in the tone's color, as wide as the done share. */
export function mapProgressFillStyle(
  theme: Theme,
  tone: ProgressTone,
  fraction: number,
): ViewStyle {
  return {
    backgroundColor: theme.colors[tone],
    borderRadius: theme.radius.pill,
    height: '100%',
    width: `${fraction * 100}%`,
  };
}
