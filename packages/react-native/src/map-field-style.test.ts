import { lightTheme } from '@scalewing/tokens';
import { describe, expect, it } from 'vitest';

import { fieldRowsHeight, mapFieldInputStyle } from './map-field-style.js';

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

  it('lets the native input own its line box so glyphs are not clipped', () => {
    const style = mapFieldInputStyle(lightTheme, {
      disabled: false,
      focused: false,
      invalid: false,
    });

    expect(style.lineHeight).toBeUndefined();
    expect(style.fontSize).toBe(lightTheme.typography.body.fontSize);
    expect(style.textAlignVertical).toBe('center');
    expect(style.includeFontPadding).toBe(false);
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

  it('sizes a multi-line field for its rows and aligns text to the top', () => {
    const state = { disabled: false, focused: false, invalid: false };
    const single = mapFieldInputStyle(lightTheme, state, 1);
    const multi = mapFieldInputStyle(lightTheme, state, 5);

    expect(single.minHeight).toBe(lightTheme.control.md.minHeight);
    expect(single.textAlignVertical).toBe('center');
    expect(multi.minHeight).toBe(fieldRowsHeight(lightTheme, 5));
    expect(multi.textAlignVertical).toBe('top');
    expect(fieldRowsHeight(lightTheme, 5)).toBeGreaterThan(
      lightTheme.control.md.minHeight,
    );
  });
});
