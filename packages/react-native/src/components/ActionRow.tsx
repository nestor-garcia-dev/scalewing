import { type ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { actionRowSlotCount, actionRowSlots } from '../action-row-slots.js';
import {
  actionTileColor,
  mapActionRowStyle,
  mapActionSlotStyle,
  mapActionTileLabelStyle,
  mapActionTileStyle,
} from '../map-action-row-style.js';
import { useTheme } from '../theme/ThemeProvider.js';
import { Text } from './Text.js';

/** One action on the row. */
export type ActionRowAction = {
  /** Replaces the label as the accessible name, e.g. "New competition". */
  accessibilityLabel?: string;
  /** Dims the tile in its slot; it no longer presses. */
  disabled?: boolean;
  /** A consumer glyph (ADR 0008): accent colour, spacing step 5. */
  icon: ReactNode;
  key: string;
  /** One short line; it truncates rather than wraps. */
  label: string;
  onPress: () => void;
  testID?: string;
};

/**
 * The fourth tile once there are more than four actions. Pressing it hands
 * over the actions it hides, for the product to show (an action sheet).
 */
export type ActionRowMore = {
  accessibilityLabel?: string;
  icon: ReactNode;
  label: string;
  onPress: (rest: readonly ActionRowAction[]) => void;
  testID?: string;
};

export type ActionRowProps = {
  /** Names the row for assistive technology, e.g. "Season actions". */
  accessibilityLabel?: string;
  actions: readonly ActionRowAction[];
  /** Required when there are more than four actions. */
  more?: ActionRowMore;
  testID?: string;
};

type TileProps = {
  accessibilityLabel?: string;
  disabled: boolean;
  icon: ReactNode;
  label: string;
  onPress: () => void;
  testID?: string;
};

function ActionTile({
  accessibilityLabel,
  disabled,
  icon,
  label,
  onPress,
  testID,
}: TileProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => mapActionTileStyle(theme, { disabled, pressed })}
      testID={testID}
    >
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        {icon}
      </View>
      <Text
        color={actionTileColor}
        style={mapActionTileLabelStyle(theme)}
        truncate
        variant="caption"
      >
        {label}
      </Text>
    </Pressable>
  );
}

function assertMore(
  actions: readonly ActionRowAction[],
  more: ActionRowMore | undefined,
): void {
  if (actions.length > actionRowSlotCount && !more) {
    throw new Error(
      `ActionRow needs \`more\` for more than ${actionRowSlotCount} actions`,
    );
  }
}

/**
 * The actions for what a screen shows, as tinted tiles under its title in
 * four equal slots. Fewer actions keep quarter-width tiles from the start
 * side; more than four show three and a More tile that hands over the rest.
 */
export function ActionRow({
  accessibilityLabel,
  actions,
  more,
  testID,
}: ActionRowProps) {
  const theme = useTheme();
  assertMore(actions, more);
  if (actions.length === 0) return null;

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="toolbar"
      style={mapActionRowStyle(theme)}
      testID={testID}
    >
      {actionRowSlots(actions).map((slot) => {
        switch (slot.kind) {
          case 'action':
            return (
              <ActionTile
                accessibilityLabel={slot.action.accessibilityLabel}
                disabled={slot.action.disabled ?? false}
                icon={slot.action.icon}
                key={`action:${slot.action.key}`}
                label={slot.action.label}
                onPress={slot.action.onPress}
                testID={slot.action.testID}
              />
            );
          case 'more':
            // assertMore guarantees `more` whenever this slot exists.
            return more ? (
              <ActionTile
                accessibilityLabel={more.accessibilityLabel}
                disabled={false}
                icon={more.icon}
                key="more"
                label={more.label}
                onPress={() => more.onPress(slot.rest)}
                testID={more.testID}
              />
            ) : null;
          case 'empty':
            return (
              <View
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
                key={`empty:${slot.index}`}
                style={mapActionSlotStyle()}
              />
            );
        }
      })}
    </View>
  );
}
