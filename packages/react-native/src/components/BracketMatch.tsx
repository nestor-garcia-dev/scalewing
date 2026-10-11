import { Pressable, View } from 'react-native';

import {
  bracketSideColor,
  bracketSideVariant,
  mapBracketMatchStyle,
  mapBracketSeedStyle,
  type BracketSideOutcome,
} from '../map-bracket-style.js';
import { useTheme } from '../theme/ThemeProvider.js';
import { Inline } from './Inline.js';
import { Text } from './Text.js';

export type BracketSide = {
  /** A team, or a placeholder such as "Winner of 1 v 8". */
  label: string;
  /** `pending` marks a placeholder; `open` (default) a side not decided. */
  outcome?: BracketSideOutcome;
  score?: string;
  seed?: string;
};

export type BracketMatchProps = {
  /** The card's one accessible name, such as the teams and the result. */
  accessibilityLabel: string;
  /** A muted line on the end side of the status, such as the field. */
  detail?: string;
  home: BracketSide;
  away: BracketSide;
  /** Without it the card only shows. */
  onPress?: () => void;
  /** The status on the start side, such as "FT" or a kickoff. */
  status?: string;
  /** A dashed outline while the pairing can still change. */
  tentative?: boolean;
  testID?: string;
};

function SideRow({ side }: { side: BracketSide }) {
  const theme = useTheme();
  const outcome = side.outcome ?? 'open';
  const color = bracketSideColor(outcome);
  const variant = bracketSideVariant(outcome);
  return (
    <Inline align="center" gap={2}>
      <Text color="muted" style={mapBracketSeedStyle(theme)} variant="caption">
        {side.seed ?? ''}
      </Text>
      <Text
        color={color}
        style={{ flex: 1, minWidth: 0 }}
        truncate
        variant={variant}
      >
        {side.label}
      </Text>
      {side.score === undefined ? null : (
        <Text
          color={color}
          style={{ fontVariant: ['tabular-nums'] }}
          variant={variant}
        >
          {side.score}
        </Text>
      )}
      <Text
        color="text"
        style={{ minWidth: theme.space[3], textAlign: 'right' }}
        variant="caption"
      >
        {outcome === 'winner' ? '◀' : ''}
      </Text>
    </Inline>
  );
}

function MatchContent(props: BracketMatchProps) {
  return (
    <>
      {props.status || props.detail ? (
        <Inline gap={2} justify="between">
          <Text color="muted" truncate variant="data">
            {props.status ?? ''}
          </Text>
          <Text
            color="muted"
            style={{ flexShrink: 1 }}
            truncate
            variant="caption"
          >
            {props.detail ?? ''}
          </Text>
        </Inline>
      ) : null}
      <SideRow side={props.home} />
      <SideRow side={props.away} />
    </>
  );
}

/**
 * One match of a bracket: a status line, then both sides with their seed,
 * score, and a marker on the winner. The card is one accessible element
 * named by the consumer.
 */
export function BracketMatch(props: BracketMatchProps) {
  const theme = useTheme();
  const tentative = props.tentative ?? false;
  if (!props.onPress)
    return (
      <View
        accessibilityLabel={props.accessibilityLabel}
        accessible
        style={mapBracketMatchStyle(theme, { pressed: false, tentative })}
        testID={props.testID}
      >
        <MatchContent {...props} />
      </View>
    );
  return (
    <Pressable
      accessibilityLabel={props.accessibilityLabel}
      accessibilityRole="button"
      onPress={props.onPress}
      style={({ pressed }) =>
        mapBracketMatchStyle(theme, { pressed, tentative })
      }
      testID={props.testID}
    >
      <MatchContent {...props} />
    </Pressable>
  );
}
