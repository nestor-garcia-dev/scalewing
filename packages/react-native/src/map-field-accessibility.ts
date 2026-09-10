import { type TextInputProps } from 'react-native';

type FieldAccessibilityProps = Pick<
  TextInputProps,
  'accessibilityHint' | 'accessibilityLabel' | 'accessibilityState'
>;

export function mapFieldAccessibility(options: {
  accessibilityHint?: string;
  disabled: boolean;
  error?: string;
  hint?: string;
  label: string;
}): FieldAccessibilityProps {
  return {
    accessibilityHint:
      options.error ?? options.hint ?? options.accessibilityHint,
    accessibilityLabel: options.label,
    accessibilityState: { disabled: options.disabled },
  };
}
