import { Pressable, type AccessibilityRole } from 'react-native';

import { chipLabelColor, mapChipStyle } from '../map-chip-style.js';
import { useTheme } from '../theme/ThemeProvider.js';
import { Text } from './Text.js';

export type ChipProps = {
  accessibilityRole: Extract<AccessibilityRole, 'checkbox' | 'radio'>;
  disabled: boolean;
  label: string;
  onPress: () => void;
  selected: boolean;
};

/**
 * Private checkable outlined pill shared by MultiSelect and SingleSelect;
 * a selected chip leads with a check.
 */
export function Chip({
  accessibilityRole,
  disabled,
  label,
  onPress,
  selected,
}: ChipProps) {
  const theme = useTheme();
  const state =
    accessibilityRole === 'checkbox'
      ? { checked: selected, disabled }
      : { disabled, selected };

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole={accessibilityRole}
      accessibilityState={state}
      disabled={disabled}
      onPress={onPress}
      style={mapChipStyle(theme, { disabled, selected })}
    >
      {selected ? (
        <Text
          accessibilityElementsHidden
          color={chipLabelColor(selected)}
          importantForAccessibility="no"
          variant="label"
        >
          ✓
        </Text>
      ) : null}
      <Text color={chipLabelColor(selected)} variant="label">
        {label}
      </Text>
    </Pressable>
  );
}
