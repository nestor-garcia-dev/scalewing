import { darkTheme, lightTheme } from '@scalewing/tokens';
import { describe, expect, it } from 'vitest';

import {
  listRowAccessory,
  mapListChevronStyle,
  mapListGroupStyle,
  mapListRowStyle,
} from './map-list-style.js';

describe('listRowAccessory', () => {
  it('shows a chevron on a pressable row unless it is turned off', () => {
    expect(listRowAccessory({ pressable: true })).toBe('chevron');
    expect(listRowAccessory({ accessory: 'none', pressable: true })).toBe(
      'none',
    );
  });

  it('never shows a chevron on a read-only row', () => {
    expect(listRowAccessory({ accessory: 'chevron', pressable: false })).toBe(
      'none',
    );
  });

  it('shows a check only on a selected choice', () => {
    expect(listRowAccessory({ pressable: true, selected: true })).toBe('check');
    expect(
      listRowAccessory({
        accessory: 'chevron',
        pressable: true,
        selected: false,
      }),
    ).toBe('none');
  });
});

describe('list styles', () => {
  it('draws one bordered surface panel', () => {
    expect(mapListGroupStyle(lightTheme)).toMatchObject({
      backgroundColor: lightTheme.colors.surface,
      borderColor: lightTheme.colors.border,
      borderRadius: lightTheme.radius.lg,
    });
  });

  it('fills a pressed row with subtle and dims a disabled one', () => {
    const rest = mapListRowStyle(lightTheme, {
      disabled: false,
      pressed: false,
    });
    expect(rest.backgroundColor).toBe('transparent');
    expect(rest.minHeight).toBe(lightTheme.control.md.minHeight);
    expect(rest.opacity).toBe(1);
    const pressed = mapListRowStyle(darkTheme, {
      disabled: true,
      pressed: true,
    });
    expect(pressed.backgroundColor).toBe(darkTheme.colors.subtle);
    expect(pressed.opacity).toBe(darkTheme.disabledOpacity);
  });

  it('draws the chevron in the muted colour, pointing to the end side', () => {
    expect(mapListChevronStyle(lightTheme)).toMatchObject({
      borderColor: lightTheme.colors.muted,
      transform: [{ rotate: '-45deg' }],
    });
  });
});
