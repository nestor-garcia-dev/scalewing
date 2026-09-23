import { Pressable, View } from 'react-native';

import {
  mapStepperButtonStyle,
  mapStepperGlyphStyle,
  mapStepperTrackStyle,
  mapStepperValueStyle,
  stepperButtonHitSlop,
} from '../map-stepper-style.js';
import {
  assertStepperBounds,
  canStepDown,
  canStepUp,
  stepDown,
  stepUp,
} from '../stepper-value.js';
import { useTheme } from '../theme/ThemeProvider.js';
import { LabeledControl } from './LabeledControl.js';
import { Text } from './Text.js';

export type StepperProps = {
  /** Accessible name of the minus button, for example "Fewer points". */
  decrementLabel: string;
  disabled?: boolean;
  error?: string;
  hint?: string;
  /** Accessible name of the plus button, for example "More points". */
  incrementLabel: string;
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  /** Amount one press adds or removes; defaults to 1. */
  step?: number;
  /** Names the parts `<testID>-decrement`, `-value`, and `-increment`. */
  testID?: string;
  value: number;
};

/**
 * A labeled number with round minus and plus buttons on a pill track, for a
 * small bounded count where a keyboard is overkill. The track fills its
 * column, so several steppers can share a row. The value is also one
 * adjustable element, so assistive technology can swipe it up and down.
 */
export function Stepper({
  decrementLabel,
  disabled = false,
  error,
  hint,
  incrementLabel,
  label,
  max,
  min,
  onChange,
  step = 1,
  testID,
  value,
}: StepperProps) {
  const bounds = { max, min, step };
  assertStepperBounds(bounds);

  const theme = useTheme();
  const mayDecrease = !disabled && canStepDown(value, bounds);
  const mayIncrease = !disabled && canStepUp(value, bounds);
  const decrease = () => {
    if (mayDecrease) onChange(stepDown(value, bounds));
  };
  const increase = () => {
    if (mayIncrease) onChange(stepUp(value, bounds));
  };

  return (
    <LabeledControl error={error} hint={hint} label={label}>
      <View
        style={mapStepperTrackStyle(theme, {
          disabled,
          invalid: Boolean(error),
        })}
      >
        <Pressable
          accessibilityLabel={decrementLabel}
          accessibilityRole="button"
          accessibilityState={{ disabled: !mayDecrease }}
          disabled={!mayDecrease}
          hitSlop={stepperButtonHitSlop(theme)}
          onPress={decrease}
          style={mapStepperButtonStyle(theme, mayDecrease)}
          testID={testID ? `${testID}-decrement` : undefined}
        >
          <View style={mapStepperGlyphStyle(theme, 'horizontal')} />
        </Pressable>
        <View
          accessibilityActions={[
            { label: incrementLabel, name: 'increment' },
            { label: decrementLabel, name: 'decrement' },
          ]}
          accessibilityHint={error ?? hint}
          accessibilityLabel={label}
          accessibilityRole="adjustable"
          accessibilityState={{ disabled }}
          accessibilityValue={{ max, min, now: value }}
          accessible
          onAccessibilityAction={(event) => {
            if (event.nativeEvent.actionName === 'increment') increase();
            if (event.nativeEvent.actionName === 'decrement') decrease();
          }}
          style={mapStepperValueStyle()}
          testID={testID ? `${testID}-value` : undefined}
        >
          <Text variant="title">{String(value)}</Text>
        </View>
        <Pressable
          accessibilityLabel={incrementLabel}
          accessibilityRole="button"
          accessibilityState={{ disabled: !mayIncrease }}
          disabled={!mayIncrease}
          hitSlop={stepperButtonHitSlop(theme)}
          onPress={increase}
          style={mapStepperButtonStyle(theme, mayIncrease)}
          testID={testID ? `${testID}-increment` : undefined}
        >
          <View style={mapStepperGlyphStyle(theme, 'horizontal')} />
          <View style={mapStepperGlyphStyle(theme, 'vertical')} />
        </Pressable>
      </View>
    </LabeledControl>
  );
}
