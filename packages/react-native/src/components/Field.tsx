import { useState, type ReactNode } from 'react';
import { TextInput, type TextInputProps } from 'react-native';

import { mapFieldAccessibility } from '../map-field-accessibility.js';
import { mapFieldInputStyle } from '../map-field-style.js';
import { mapSearchInputStyle } from '../map-search-field-style.js';
import { useTheme } from '../theme/ThemeProvider.js';
import { LabeledControl } from './LabeledControl.js';
import { SearchFrame } from './SearchFrame.js';

/** `outlined` is the labeled form field; `search` is a filled search box. */
export type FieldVariant = 'outlined' | 'search';

type FieldBaseProps = Omit<
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
  /** Drawn above an outlined field; a search field's accessible name only. */
  label: string;
  onChangeText: (value: string) => void;
  /** With `testID`, a search field's clear button is `<testID>-clear`. */
  testID?: string;
  value: string;
};

type OutlinedFieldProps = FieldBaseProps & {
  clearLabel?: never;
  leading?: never;
  /**
   * Visible lines. More than one makes a multi-line field that starts this
   * tall, aligns text to the top, and grows with its content; one (the
   * default) is a single-line field.
   */
  rows?: number;
  variant?: 'outlined';
};

type SearchFieldProps = FieldBaseProps & {
  /** Accessible name of the clear button, for example "Clear search". */
  clearLabel: string;
  /** A consumer glyph on the start side, such as a Lucide magnifier (ADR 0008). */
  leading?: ReactNode;
  rows?: never;
  /**
   * A filled capsule with no visible label, the search return key, and a
   * clear button while there is text.
   */
  variant: 'search';
};

export type FieldProps = OutlinedFieldProps | SearchFieldProps;

export function Field({
  clearLabel,
  disabled = false,
  error,
  hint,
  label,
  leading,
  onBlur,
  onChangeText,
  onFocus,
  returnKeyType,
  rows = 1,
  testID,
  value,
  variant = 'outlined',
  ...inputProps
}: FieldProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  const search = variant === 'search';
  if (search && !clearLabel) {
    throw new Error('A search Field needs a clearLabel for its clear button.');
  }

  const state = { disabled, focused, invalid: Boolean(error) };
  const clearable = search && !disabled && value !== '';
  const input = (
    <TextInput
      {...inputProps}
      {...mapFieldAccessibility({
        accessibilityHint: inputProps.accessibilityHint,
        disabled,
        error,
        hint,
        label,
        search,
      })}
      editable={!disabled}
      multiline={!search && (rows > 1 || Boolean(inputProps.multiline))}
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
      returnKeyType={returnKeyType ?? (search ? 'search' : undefined)}
      style={
        search
          ? mapSearchInputStyle(theme, clearable)
          : mapFieldInputStyle(theme, state, rows)
      }
      testID={testID}
      value={value}
    />
  );

  return (
    <LabeledControl error={error} hideLabel={search} hint={hint} label={label}>
      {search ? (
        <SearchFrame
          clearLabel={clearLabel ?? ''}
          leading={leading}
          onClear={clearable ? () => onChangeText('') : undefined}
          state={state}
          testID={testID}
        >
          {input}
        </SearchFrame>
      ) : (
        input
      )}
    </LabeledControl>
  );
}
