import { Pressable, useWindowDimensions, View } from 'react-native';

import { mapListChevronStyle } from '../map-list-style.js';
import {
  assertMatchCardDetails,
  mapMatchCardCrestStyle,
  mapMatchCardDetailsStyle,
  mapMatchCardHeaderStyle,
  mapMatchCardSideStyle,
  mapMatchCardSidesStyle,
  mapMatchCardStyle,
  mapMatchCardTitleStyle,
  mapMatchCardVersusStyle,
  matchCardInitials,
  matchCardName,
  matchCardStacksSides,
  type MatchCardSide,
} from '../map-match-card-style.js';
import { useTheme } from '../theme/ThemeProvider.js';
import { Text } from './Text.js';

export type { MatchCardSide };

export type MatchCardProps = {
  /** Replaces the default name: the visible lines joined by commas. */
  accessibilityLabel?: string;
  /** What pressing does, when the name alone does not say it. */
  accessibilityHint?: string;
  /** Up to two muted lines centred under the sides, such as the venue. */
  details?: readonly string[];
  /** A small muted line above `when`, such as whose game it is. */
  leading?: string;
  onPress: () => void;
  /** The home side first, then the away side. */
  sides: readonly [MatchCardSide, MatchCardSide];
  testID?: string;
  /** The word between the sides; defaults to "vs". */
  versus?: string;
  /** The large line at the top, such as the day and the kickoff. */
  when: string;
};

/** A side's round mark: the consumer's crest, or its initials. */
function Crest({ side }: { side: MatchCardSide }) {
  const theme = useTheme();
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={mapMatchCardCrestStyle(theme)}
    >
      {side.crest ?? (
        <Text allowFontScaling={false} variant="label">
          {side.initials ?? matchCardInitials(side.name)}
        </Text>
      )}
    </View>
  );
}

function Side({ side, stacked }: { side: MatchCardSide; stacked: boolean }) {
  const theme = useTheme();
  return (
    <View style={mapMatchCardSideStyle(theme, stacked)}>
      <Crest side={side} />
      <Text
        style={{ alignSelf: 'stretch', textAlign: 'center' }}
        variant="label"
      >
        {side.name}
      </Text>
      {side.caption ? (
        <Text color="muted" variant="caption">
          {side.caption}
        </Text>
      ) : null}
    </View>
  );
}

/**
 * One upcoming match as a card that opens it: an optional small line, the
 * large when line with a chevron, both sides with their marks, names and
 * captions, and up to two detail lines. The whole card is one button.
 */
export function MatchCard({
  accessibilityHint,
  accessibilityLabel,
  details = [],
  leading,
  onPress,
  sides,
  testID,
  versus = 'vs',
  when,
}: MatchCardProps) {
  assertMatchCardDetails(details);
  const theme = useTheme();
  const { fontScale } = useWindowDimensions();
  const stacked = matchCardStacksSides(fontScale);
  const [home, away] = sides;

  return (
    <Pressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={
        accessibilityLabel ??
        matchCardName({ details, leading, sides, versus, when })
      }
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => mapMatchCardStyle(theme, { pressed })}
      testID={testID}
    >
      <View style={mapMatchCardHeaderStyle(theme)}>
        <View style={mapMatchCardTitleStyle(theme)}>
          {leading ? (
            <Text color="muted" variant="caption">
              {leading}
            </Text>
          ) : null}
          <Text variant="heading">{when}</Text>
        </View>
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={mapListChevronStyle(theme)}
        />
      </View>
      <View style={mapMatchCardSidesStyle(theme, stacked)}>
        <Side side={home} stacked={stacked} />
        <Text
          color="muted"
          style={mapMatchCardVersusStyle(theme, stacked)}
          variant="caption"
        >
          {versus}
        </Text>
        <Side side={away} stacked={stacked} />
      </View>
      {details.length > 0 ? (
        <View style={mapMatchCardDetailsStyle(theme)}>
          {details.map((line, index) => (
            <Text
              color="muted"
              key={`${index}-${line}`}
              style={{ textAlign: 'center' }}
              variant="bodySm"
            >
              {line}
            </Text>
          ))}
        </View>
      ) : null}
    </Pressable>
  );
}
