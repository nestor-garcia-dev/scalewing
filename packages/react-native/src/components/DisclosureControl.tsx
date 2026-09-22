import { Pressable } from 'react-native';

import { mapDisclosureControlStyle } from '../map-control-frame-style.js';
import { useTheme } from '../theme/ThemeProvider.js';
import { Text } from './Text.js';

export type DisclosureControlProps = {
  accessibilityHint?: string;
  disabled: boolean;
  expanded: boolean;
  invalid: boolean;
  label: string;
  onPress: () => void;
  placeholder: string;
  valueText: string;
};

/** Private field-shaped button that shows a value and toggles a picker. */
export function DisclosureControl({
  accessibilityHint,
  disabled,
  expanded,
  invalid,
  label,
  onPress,
  placeholder,
  valueText,
}: DisclosureControlProps) {
  const theme = useTheme();
  const empty = valueText === '';

  return (
    <Pressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ disabled, expanded }}
      accessibilityValue={empty ? undefined : { text: valueText }}
      disabled={disabled}
      onPress={onPress}
      style={mapDisclosureControlStyle(theme, {
        disabled,
        focused: expanded,
        invalid,
      })}
    >
      <Text color={empty ? 'muted' : 'text'}>
        {empty ? placeholder : valueText}
      </Text>
    </Pressable>
  );
}
