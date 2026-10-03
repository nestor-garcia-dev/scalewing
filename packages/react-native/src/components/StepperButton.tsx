import { Pressable, View, type Insets, type ViewStyle } from 'react-native';

import { mapStepperGlyphStyle } from '../map-stepper-style.js';
import { useTheme } from '../theme/ThemeProvider.js';

export type StepperButtonProps = {
  direction: 'decrement' | 'increment';
  enabled: boolean;
  hitSlop: Insets;
  /** The consumer's accessible name, for example "Fewer points". */
  label: string;
  onPress: () => void;
  style: ViewStyle;
  testID?: string;
};

/** A round minus or plus with drawn strokes; private stepper chrome. */
export function StepperButton({
  direction,
  enabled,
  hitSlop,
  label,
  onPress,
  style,
  testID,
}: StepperButtonProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ disabled: !enabled }}
      disabled={!enabled}
      hitSlop={hitSlop}
      onPress={onPress}
      style={style}
      testID={testID}
    >
      <View style={mapStepperGlyphStyle(theme, 'horizontal')} />
      {direction === 'increment' ? (
        <View style={mapStepperGlyphStyle(theme, 'vertical')} />
      ) : null}
    </Pressable>
  );
}
