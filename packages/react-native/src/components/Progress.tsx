import { View } from 'react-native';

import {
  mapProgressFillStyle,
  mapProgressHeadingStyle,
  mapProgressTrackStyle,
  type ProgressTone,
} from '../map-progress-style.js';
import {
  assertProgressRange,
  progressCount,
  progressFraction,
} from '../progress-range.js';
import { useTheme } from '../theme/ThemeProvider.js';
import { Text } from './Text.js';

export type ProgressProps = {
  label: string;
  max: number;
  /** Names the element for tests; the track is `<testID>-fill`. */
  testID?: string;
  tone?: ProgressTone;
  value: number;
};

/**
 * A known count out of a total: the label, a muted "value / max" count, and
 * a pill track filled to value / max. It is one accessible progress bar
 * named by the label, so the count is not read twice.
 */
export function Progress({
  label,
  max,
  testID,
  tone = 'accent',
  value,
}: ProgressProps) {
  const range = { max, value };
  assertProgressRange(label, range);
  const theme = useTheme();

  return (
    <View
      accessibilityLabel={label}
      accessibilityRole="progressbar"
      accessibilityValue={{ max, min: 0, now: value }}
      accessible
      style={{ gap: theme.space[2] }}
      testID={testID}
    >
      <View style={mapProgressHeadingStyle(theme)}>
        <Text style={{ flexShrink: 1 }} variant="label">
          {label}
        </Text>
        <Text color="muted" variant="caption">
          {progressCount(range)}
        </Text>
      </View>
      <View style={mapProgressTrackStyle(theme)}>
        <View
          style={mapProgressFillStyle(theme, tone, progressFraction(range))}
          testID={testID ? `${testID}-fill` : undefined}
        />
      </View>
    </View>
  );
}
