import { type ReactNode } from 'react';
import { View } from 'react-native';

import { mapListRowStyle } from '../map-list-style.js';
import {
  mapStepperRowButtonStyle,
  mapStepperRowControlsStyle,
  mapStepperRowLabelStyle,
  mapStepperRowValueStyle,
  stepperRowButtonHitSlop,
  stepperRowValueTextStyle,
} from '../map-stepper-row-style.js';
import { mapStepperAdjustable } from '../stepper-adjustable.js';
import { assertStepperBounds, stepperMoves } from '../stepper-value.js';
import { useTheme } from '../theme/ThemeProvider.js';
import { ListRowLabel } from './ListRowLabel.js';
import { StepperButton } from './StepperButton.js';
import { Text } from './Text.js';

export type StepperRowProps = {
  /** Accessible name of the minus button, for example "Remove one". */
  decrementLabel: string;
  /** A muted line under the title. */
  detail?: string;
  disabled?: boolean;
  /** Accessible name of the plus button, for example "Add one". */
  incrementLabel: string;
  /** A consumer mark or glyph on the start side (ADR 0008). */
  leading?: ReactNode;
  max: number;
  min: number;
  onChange: (value: number) => void;
  /** Amount one press adds or removes; defaults to 1. */
  step?: number;
  /**
   * Names the row, and its parts `<testID>-decrement`, `-value` (the
   * adjustable element that reports the count), and `-increment`.
   */
  testID?: string;
  title: string;
  value: number;
};

/**
 * One row of a `ListGroup` that counts something: the title and detail on
 * the start side, and a compact minus, count, and plus on the end side.
 * The title and detail are one adjustable element named by both, so
 * assistive technology swipes the count up and down; the buttons stay
 * separate touch targets.
 */
export function StepperRow({
  decrementLabel,
  detail,
  disabled = false,
  incrementLabel,
  leading,
  max,
  min,
  onChange,
  step = 1,
  testID,
  title,
  value,
}: StepperRowProps) {
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
  const hitSlop = stepperRowButtonHitSlop(theme);
  // A disabled row already dims as a whole; only a bound fades one button.
  const buttonStyle = (enabled: boolean) =>
    mapStepperRowButtonStyle(theme, disabled || enabled);

  return (
    <View
      style={mapListRowStyle(theme, { disabled, pressed: false })}
      testID={testID}
    >
      <View
        {...mapStepperAdjustable({
          decrementLabel,
          disabled,
          incrementLabel,
          label: [title, detail].filter(Boolean).join(', '),
          max,
          min,
          onDecrement: decrease,
          onIncrement: increase,
          value,
        })}
        style={mapStepperRowLabelStyle(theme)}
        testID={testID ? `${testID}-value` : undefined}
      >
        {leading}
        <ListRowLabel detail={detail} title={title} />
      </View>
      <View style={mapStepperRowControlsStyle(theme)}>
        <StepperButton
          direction="decrement"
          enabled={moves.down !== null}
          hitSlop={hitSlop}
          label={decrementLabel}
          onPress={decrease}
          style={buttonStyle(moves.down !== null)}
          testID={testID ? `${testID}-decrement` : undefined}
        />
        {/* The adjustable element already reports the count. */}
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={mapStepperRowValueStyle(theme)}
        >
          <Text style={stepperRowValueTextStyle}>{String(value)}</Text>
        </View>
        <StepperButton
          direction="increment"
          enabled={moves.up !== null}
          hitSlop={hitSlop}
          label={incrementLabel}
          onPress={increase}
          style={buttonStyle(moves.up !== null)}
          testID={testID ? `${testID}-increment` : undefined}
        />
      </View>
    </View>
  );
}
