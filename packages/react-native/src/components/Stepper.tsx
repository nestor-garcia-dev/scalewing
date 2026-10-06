import { View } from 'react-native';

import {
  mapStepperButtonStyle,
  mapStepperTrackStyle,
  mapStepperValueStyle,
  stepperButtonHitSlop,
} from '../map-stepper-style.js';
import { mapStepperAdjustable } from '../stepper-adjustable.js';
import { assertStepperBounds, stepperMoves } from '../stepper-value.js';
import { useTheme } from '../theme/ThemeProvider.js';
import { LabeledControl } from './LabeledControl.js';
import { StepperButton } from './StepperButton.js';
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
  const moves = stepperMoves(value, bounds, disabled);
  const decrease = () => {
    if (moves.down !== null) onChange(moves.down);
  };
  const increase = () => {
    if (moves.up !== null) onChange(moves.up);
  };
  const hitSlop = stepperButtonHitSlop(theme);

  return (
    <LabeledControl error={error} hint={hint} label={label}>
      <View
        style={mapStepperTrackStyle(theme, {
          disabled,
          invalid: Boolean(error),
        })}
      >
        <StepperButton
          direction="decrement"
          enabled={moves.down !== null}
          hitSlop={hitSlop}
          label={decrementLabel}
          onPress={decrease}
          style={mapStepperButtonStyle(theme, moves.down !== null)}
          testID={testID ? `${testID}-decrement` : undefined}
        />
        <View
          {...mapStepperAdjustable({
            decrementLabel,
            disabled,
            hint: error ?? hint,
            incrementLabel,
            label,
            max,
            min,
            onDecrement: decrease,
            onIncrement: increase,
            value,
          })}
          style={mapStepperValueStyle()}
          testID={testID ? `${testID}-value` : undefined}
        >
          <Text variant="title">{String(value)}</Text>
        </View>
        <StepperButton
          direction="increment"
          enabled={moves.up !== null}
          hitSlop={hitSlop}
          label={incrementLabel}
          onPress={increase}
          style={mapStepperButtonStyle(theme, moves.up !== null)}
          testID={testID ? `${testID}-increment` : undefined}
        />
      </View>
    </LabeledControl>
  );
}
