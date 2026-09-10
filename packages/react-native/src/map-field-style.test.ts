import { lightTheme } from '@scalewing/tokens';
import { describe, expect, it } from 'vitest';

import { mapFieldInputStyle } from './map-field-style.js';

describe('mapFieldInputStyle', () => {
  it('uses the native control scale and neutral field chrome', () => {
    const style = mapFieldInputStyle(lightTheme, {
      disabled: false,
      focused: false,
      invalid: false,
    });

    expect(style.backgroundColor).toBe(lightTheme.colors.surface);
    expect(style.borderColor).toBe(lightTheme.colors.border);
    expect(style.borderRadius).toBe(lightTheme.radius.lg);
    expect(style.minHeight).toBe(lightTheme.control.md.minHeight);
    expect(style.paddingHorizontal).toBe(lightTheme.control.md.paddingInline);
  });

  it('uses accent focus and danger invalid states', () => {
    const focused = mapFieldInputStyle(lightTheme, {
      disabled: false,
      focused: true,
      invalid: false,
    });
    const invalid = mapFieldInputStyle(lightTheme, {
      disabled: false,
      focused: false,
      invalid: true,
    });

    expect(focused.borderColor).toBe(lightTheme.colors.accent);
    expect(focused.borderWidth).toBe(1);
    expect(invalid.borderColor).toBe(lightTheme.colors.danger);
  });

  it('dims disabled fields with the shared opacity', () => {
    const style = mapFieldInputStyle(lightTheme, {
      disabled: true,
      focused: false,
      invalid: false,
    });

    expect(style.opacity).toBe(lightTheme.disabledOpacity);
  });
});
