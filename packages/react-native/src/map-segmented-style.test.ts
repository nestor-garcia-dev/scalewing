import { lightTheme, trackInset } from '@scalewing/tokens';
import { describe, expect, it } from 'vitest';

import {
  mapSegmentedControlStyle,
  mapSegmentedItemStyle,
  segmentedItemColor,
} from './map-segmented-style.js';

describe('mapSegmentedControlStyle', () => {
  it('uses glass fill, a pill track, and the shared inset', () => {
    const style = mapSegmentedControlStyle(lightTheme);

    expect(style.backgroundColor).toBe(lightTheme.glass.fill);
    expect(style.borderColor).toBe(lightTheme.glass.border);
    expect(style.borderRadius).toBe(lightTheme.radius.pill);
    expect(style.flexDirection).toBe('row');
    expect(style.gap).toBe(trackInset);
    expect(style.padding).toBe(trackInset);
  });
});

describe('mapSegmentedItemStyle', () => {
  it('fills the selected item with surface', () => {
    const selected = mapSegmentedItemStyle(lightTheme, true);
    const rest = mapSegmentedItemStyle(lightTheme, false);

    expect(selected.backgroundColor).toBe(lightTheme.colors.surface);
    expect(rest.backgroundColor).toBe('transparent');
    expect(selected.minHeight).toBe(lightTheme.control.xs.minHeight);
    expect(selected.flex).toBe(1);
  });
});

describe('segmentedItemColor', () => {
  it('uses text when selected and muted otherwise', () => {
    expect(segmentedItemColor(true)).toBe('text');
    expect(segmentedItemColor(false)).toBe('muted');
  });
});
