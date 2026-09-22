import { useState } from 'react';
import { TextInput, type TextInputProps } from 'react-native';

import { mapFieldAccessibility } from '../map-field-accessibility.js';
import { mapFieldInputStyle } from '../map-field-style.js';
import { useTheme } from '../theme/ThemeProvider.js';
import { LabeledControl } from './LabeledControl.js';

export type FieldProps = Omit<
  TextInputProps,
  | 'accessibilityLabel'
  | 'accessibilityState'
  | 'editable'
  | 'onChangeText'
  | 'style'
  | 'value'
> & {
  disabled?: boolean;
  error?: string;
  hint?: string;
  label: string;
  onChangeText: (value: string) => void;
  value: string;
};

export function Field({
  disabled = false,
  error,
  hint,
  label,
  onBlur,
  onChangeText,
  onFocus,
  value,
  ...inputProps
}: FieldProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <LabeledControl error={error} hint={hint} label={label}>
      <TextInput
        {...inputProps}
        {...mapFieldAccessibility({
          accessibilityHint: inputProps.accessibilityHint,
          disabled,
          error,
          hint,
          label,
        })}
        editable={!disabled}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        onChangeText={onChangeText}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        placeholderTextColor={theme.colors.muted}
        style={mapFieldInputStyle(theme, {
          disabled,
          focused,
          invalid: Boolean(error),
        })}
        value={value}
      />
    </LabeledControl>
  );
}
