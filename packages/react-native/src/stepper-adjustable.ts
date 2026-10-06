import { type ViewProps } from 'react-native';

type AdjustableProps = Pick<
  ViewProps,
  | 'accessibilityActions'
  | 'accessibilityHint'
  | 'accessibilityLabel'
  | 'accessibilityRole'
  | 'accessibilityState'
  | 'accessibilityValue'
  | 'accessible'
  | 'onAccessibilityAction'
>;

export type StepperAdjustableOptions = {
  decrementLabel: string;
  disabled: boolean;
  hint?: string;
  incrementLabel: string;
  label: string;
  max: number;
  min: number;
  onDecrement: () => void;
  onIncrement: () => void;
  value: number;
};

/**
 * The one adjustable element of a stepper: assistive technology swipes it up
 * and down instead of finding the two buttons.
 */
export function mapStepperAdjustable(
  options: StepperAdjustableOptions,
): AdjustableProps {
  const { max, min, value } = options;
  return {
    accessibilityActions: [
      { label: options.incrementLabel, name: 'increment' },
      { label: options.decrementLabel, name: 'decrement' },
    ],
    accessibilityHint: options.hint,
    accessibilityLabel: options.label,
    accessibilityRole: 'adjustable',
    accessibilityState: { disabled: options.disabled },
    // The text keeps iOS from announcing the value as a percentage of the
    // range ("14%" for 1 of 1 to 8).
    accessibilityValue: { max, min, now: value, text: String(value) },
    accessible: true,
    onAccessibilityAction: (event) => {
      if (event.nativeEvent.actionName === 'increment') options.onIncrement();
      if (event.nativeEvent.actionName === 'decrement') options.onDecrement();
    },
  };
}
