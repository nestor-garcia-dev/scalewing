import { lightTheme } from '@scalewing/tokens';
import { describe, expect, it } from 'vitest';

import { mapTableCellStyle, mapTableRowStyle } from './map-table-style.js';

describe('mapTableRowStyle', () => {
  it('uses compact token padding and a hairline', () => {
    const style = mapTableRowStyle(lightTheme, { density: 'compact' });

    expect(style.paddingHorizontal).toBe(lightTheme.space[2]);
    expect(style.paddingVertical).toBe(lightTheme.space[1]);
    expect(style.borderBottomColor).toBe(lightTheme.colors.border);
    expect(style.borderBottomWidth).toBe(1);
  });

  it('uses larger padding when comfortable', () => {
    const style = mapTableRowStyle(lightTheme, { density: 'comfortable' });

    expect(style.paddingHorizontal).toBe(lightTheme.space[3]);
    expect(style.paddingVertical).toBe(lightTheme.space[2]);
  });

  it('dims a pressed row with the disabled opacity token', () => {
    const style = mapTableRowStyle(lightTheme, {
      density: 'compact',
      pressed: true,
    });

    expect(style.opacity).toBe(lightTheme.disabledOpacity);
  });
});

describe('mapTableCellStyle', () => {
  it('ends numeric cells and keeps a flex share', () => {
    const style = mapTableCellStyle({
      align: 'start',
      flex: 1,
      numeric: true,
    });

    expect(style.alignItems).toBe('flex-end');
    expect(style.flex).toBe(1);
  });

  it('centers when align is center, including numeric score cells', () => {
    const style = mapTableCellStyle({
      align: 'center',
      flex: 0.8,
      numeric: true,
    });

    expect(style.alignItems).toBe('center');
    expect(style.flex).toBe(0.8);
  });
});
