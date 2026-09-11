import {
  createTheme,
  contrastRatio,
  lightTheme,
  trackInset,
} from '@scalewing/tokens';
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
  it('fills the selected item with accent and preserves a touch target', () => {
    const selected = mapSegmentedItemStyle(lightTheme, true);
    const rest = mapSegmentedItemStyle(lightTheme, false);

    expect(selected.backgroundColor).toBe(lightTheme.colors.accent);
    expect(rest.backgroundColor).toBe('transparent');
    expect(selected.minHeight).toBeGreaterThanOrEqual(44);
    expect(selected.flex).toBe(1);
  });
});

describe('segmentedItemColor', () => {
  it('uses onAccent when selected and muted otherwise', () => {
    expect(segmentedItemColor(true)).toBe('onAccent');
    expect(segmentedItemColor(false)).toBe('muted');
  });
});

describe('selected segment contrast', () => {
  it.each(['light', 'dark'] as const)(
    'keeps Ink labels readable in %s',
    (scheme) => {
      const theme = createTheme({ colorScheme: scheme, palette: 'ink' });
      expect(
        contrastRatio(theme.colors.accent, theme.colors.onAccent),
      ).toBeGreaterThanOrEqual(4.5);
    },
  );
});
