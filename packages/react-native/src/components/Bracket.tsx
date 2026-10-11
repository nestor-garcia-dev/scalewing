import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  useWindowDimensions,
  View,
  type LayoutChangeEvent,
} from 'react-native';

import {
  bracketPeekWidth,
  bracketShowsNextRound,
  mapBracketFeedStyle,
  mapBracketJoinStyle,
} from '../map-bracket-style.js';
import { useTheme } from '../theme/ThemeProvider.js';
import { BracketMatch, type BracketMatchProps } from './BracketMatch.js';
import { Chip } from './Chip.js';
import { Stack } from './Stack.js';

export type BracketRoundMatch = BracketMatchProps & { id: string };

export type BracketRound = {
  id: string;
  label: string;
  /**
   * In bracket order: matches 1 and 2 feed the next round's first match,
   * 3 and 4 its second, and so on.
   */
  matches: readonly BracketRoundMatch[];
};

export type BracketProps = {
  /** Names the row of round choices. */
  accessibilityLabel: string;
  onChange: (roundId: string) => void;
  rounds: readonly BracketRound[];
  testID?: string;
  /** The round shown. */
  value: string;
};

/** Two matches of a round, the lines joining them, and the one they feed. */
function Pair({
  cardWidth,
  feeds,
  gap,
  matches,
  onPeek,
}: {
  cardWidth: number;
  feeds: BracketRoundMatch;
  gap: number;
  matches: readonly BracketRoundMatch[];
  onPeek: () => void;
}) {
  const theme = useTheme();
  return (
    <View style={{ flexDirection: 'row' }}>
      <View style={{ rowGap: gap, width: cardWidth }}>
        {matches.map(({ id, ...match }) => (
          <BracketMatch key={id} {...match} />
        ))}
      </View>
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={{ width: theme.space[4] }}
      >
        <View style={mapBracketJoinStyle(theme, gap)} />
        <View style={mapBracketFeedStyle(theme)} />
      </View>
      <Pressable
        accessibilityElementsHidden
        accessible={false}
        importantForAccessibility="no-hide-descendants"
        onPress={onPeek}
        style={{ justifyContent: 'center', width: cardWidth }}
      >
        <BracketMatch {...feeds} onPress={undefined} />
      </Pressable>
    </View>
  );
}

function pairsOf<T>(items: readonly T[]): T[][] {
  const pairs: T[][] = [];
  for (let index = 0; index < items.length; index += 2)
    pairs.push(items.slice(index, index + 2));
  return pairs;
}

/**
 * A knockout bracket one round at a time, as sports apps show it on a
 * phone: a row of round choices, the chosen round's matches at full width,
 * and the next round peeking in at the end edge, joined by bracket lines.
 * Pressing the peek shows that round. At accessibility text sizes the
 * round is a plain list.
 */
export function Bracket({
  accessibilityLabel,
  onChange,
  rounds,
  testID,
  value,
}: BracketProps) {
  const theme = useTheme();
  const { fontScale } = useWindowDimensions();
  const [width, setWidth] = useState(0);
  const index = Math.max(
    0,
    rounds.findIndex((round) => round.id === value),
  );
  const round = rounds[index];
  const next = rounds[index + 1];
  const gap = theme.space[3];
  const peeks =
    next !== undefined &&
    width > 0 &&
    bracketShowsNextRound(fontScale) &&
    round !== undefined &&
    round.matches.length === next.matches.length * 2;

  return (
    <Stack gap={3} testID={testID}>
      <ScrollView
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="radiogroup"
        contentContainerStyle={{ columnGap: theme.space[2] }}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {rounds.map((choice) => (
          <Chip
            accessibilityRole="radio"
            disabled={false}
            key={choice.id}
            label={choice.label}
            onPress={() => {
              if (choice.id !== value) onChange(choice.id);
            }}
            selected={choice.id === round?.id}
          />
        ))}
      </ScrollView>
      <View
        onLayout={(event: LayoutChangeEvent) =>
          setWidth(event.nativeEvent.layout.width)
        }
        style={{ overflow: 'hidden', rowGap: gap }}
      >
        {peeks
          ? pairsOf(round.matches).map((pair, at) => (
              <Pair
                cardWidth={width - bracketPeekWidth(theme)}
                feeds={next.matches[at] as BracketRoundMatch}
                gap={gap}
                key={pair.map((match) => match.id).join(':')}
                matches={pair}
                onPeek={() => onChange(next.id)}
              />
            ))
          : round?.matches.map(({ id, ...match }) => (
              <BracketMatch key={id} {...match} />
            ))}
      </View>
    </Stack>
  );
}
