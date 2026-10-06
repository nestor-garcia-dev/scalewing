import { type TextInputProps } from 'react-native';

type FieldAccessibilityProps = Pick<
  TextInputProps,
  | 'accessibilityHint'
  | 'accessibilityLabel'
  | 'accessibilityRole'
  | 'accessibilityState'
>;

export function mapFieldAccessibility(options: {
  accessibilityHint?: string;
  disabled: boolean;
  error?: string;
  hint?: string;
  label: string;
  /** A search field announces itself as one. */
  search?: boolean;
}): FieldAccessibilityProps {
  return {
    accessibilityHint:
      options.error ?? options.hint ?? options.accessibilityHint,
    accessibilityLabel: options.label,
    ...(options.search ? { accessibilityRole: 'search' as const } : {}),
    accessibilityState: { disabled: options.disabled },
  };
}
