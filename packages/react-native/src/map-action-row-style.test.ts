import { darkTheme, lightTheme, quietOpacity } from '@scalewing/tokens';
import { describe, expect, it } from 'vitest';

import { actionRowSlots } from './action-row-slots.js';
import {
  actionTileColor,
  actionTileMinHeight,
  mapActionRowStyle,
  mapActionSlotStyle,
  mapActionTileLabelStyle,
  mapActionTileStyle,
} from './map-action-row-style.js';

const idle = { disabled: false, pressed: false };

describe('action row styles', () => {
  it('fills a tile with the accent tint on the radius and spacing scales', () => {
    for (const theme of [lightTheme, darkTheme]) {
      const tile = mapActionTileStyle(theme, idle);
      expect(tile.backgroundColor).toBe(theme.colors.accentSubtle);
      expect(tile.borderRadius).toBe(theme.radius.md);
      expect(tile.minHeight).toBe(theme.space[8] + theme.space[4]);
      expect(tile.opacity).toBe(1);
    }
    expect(actionTileMinHeight(lightTheme)).toBe(64);
    expect(actionTileColor).toBe('accent');
  });

  it('quiets a pressed tile and dims a disabled one, pressed or not', () => {
    expect(
      mapActionTileStyle(lightTheme, { disabled: false, pressed: true })
        .opacity,
    ).toBe(quietOpacity);
    expect(
      mapActionTileStyle(lightTheme, { disabled: true, pressed: false })
        .opacity,
    ).toBe(lightTheme.disabledOpacity);
    expect(
      mapActionTileStyle(lightTheme, { disabled: true, pressed: true }).opacity,
    ).toBe(lightTheme.disabledOpacity);
  });

  it('gives every slot, filled or empty, an equal share of the row', () => {
    const slot = mapActionSlotStyle();
    const tile = mapActionTileStyle(lightTheme, idle);
    expect(slot).toEqual({ flexBasis: 0, flexGrow: 1, minWidth: 0 });
    expect(tile).toMatchObject(slot);
    expect(mapActionRowStyle(lightTheme)).toMatchObject({
      columnGap: lightTheme.space[2],
      flexDirection: 'row',
    });
  });

  it('sets the label at the label weight; the caption variant sizes it', () => {
    expect(mapActionTileLabelStyle(lightTheme).fontWeight).toBe(
      String(lightTheme.typography.label.fontWeight),
    );
    expect(mapActionTileLabelStyle(lightTheme)).not.toHaveProperty('fontSize');
  });
});

describe('actionRowSlots', () => {
  it('keeps four slots, leaving the unused ones empty at the end', () => {
    expect(actionRowSlots(['a'])).toEqual([
      { action: 'a', kind: 'action' },
      { index: 1, kind: 'empty' },
      { index: 2, kind: 'empty' },
      { index: 3, kind: 'empty' },
    ]);
    expect(
      actionRowSlots(['a', 'b', 'c', 'd']).map((slot) => slot.kind),
    ).toEqual(['action', 'action', 'action', 'action']);
  });

  it('shows three and a More slot holding the rest past four', () => {
    const slots = actionRowSlots(['a', 'b', 'c', 'd', 'e', 'f']);
    expect(slots).toHaveLength(4);
    expect(slots.slice(0, 3).map((slot) => slot.kind)).toEqual([
      'action',
      'action',
      'action',
    ]);
    expect(slots[3]).toEqual({ kind: 'more', rest: ['d', 'e', 'f'] });
    expect(actionRowSlots(['a', 'b', 'c', 'd', 'e'])[3]).toEqual({
      kind: 'more',
      rest: ['d', 'e'],
    });
  });
});
