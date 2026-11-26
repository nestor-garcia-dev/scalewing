import { lightTheme } from '@scalewing/tokens';
import { describe, expect, it } from 'vitest';

import {
  mapTabBarBadgeStyle,
  mapTabBarContentStyle,
  mapTabBarDestinationStyle,
  mapTabBarIconStyle,
  mapTabBarItemStyle,
  mapTabBarLabelStyle,
  mapTabBarStyle,
  mapTabBarTrailingStyle,
  tabBarItemColor,
  tabBarLabelMinimumFontScale,
  tabBarTrailingGap,
} from './map-tab-bar-style.js';

describe('mapTabBarStyle', () => {
  it('uses the surface, hairline, and space steps', () => {
    const style = mapTabBarStyle(lightTheme);

    expect(style.backgroundColor).toBe(lightTheme.colors.surface);
    expect(style.borderTopColor).toBe(lightTheme.colors.border);
    expect(style.borderTopWidth).toBe(1);
    expect(style.paddingHorizontal).toBe(lightTheme.space[3]);
    expect(style.paddingTop).toBe(lightTheme.space[2]);
    expect(style.paddingBottom).toBe(lightTheme.space[2]);
  });

  it('adds a device bottom inset on top of the token padding', () => {
    const style = mapTabBarStyle(lightTheme, { bottomInset: 12 });

    expect(style.paddingBottom).toBe(lightTheme.space[2] + 12);
  });
});

describe('tabBarItemColor', () => {
  it('uses accent when selected and muted otherwise', () => {
    expect(tabBarItemColor(true)).toBe('accent');
    expect(tabBarItemColor(false)).toBe('muted');
  });
});

describe('tab bar destination layout', () => {
  it('constrains destinations to equal shrinking columns', () => {
    expect(mapTabBarDestinationStyle()).toEqual({ flex: 1, minWidth: 0 });
    expect(mapTabBarItemStyle(lightTheme)).toMatchObject({
      alignItems: 'center',
      flex: 1,
      minHeight: lightTheme.control.md.minHeight,
      minWidth: 0,
    });
    expect(mapTabBarItemStyle(lightTheme).paddingHorizontal).toBeUndefined();
    expect(mapTabBarContentStyle()).toEqual({ minWidth: 0, width: '100%' });
    expect(mapTabBarLabelStyle()).toEqual({
      maxWidth: '100%',
      textAlign: 'center',
    });
  });
});

describe('five destinations on a 390-point phone', () => {
  // SF Pro widths at the caption size (13 pt, -0.08 tracking), measured with
  // NSString.size(withAttributes:): "Following" 56.5, "Configuración" 83.8.
  const followingWidth = 56.5;
  const configuracionWidth = 83.8;

  function columnWidth(windowWidth: number, count: number) {
    const bar = mapTabBarStyle(lightTheme);
    const trailing = mapTabBarTrailingStyle(lightTheme);
    const inner =
      windowWidth -
      2 * Number(bar.paddingHorizontal) -
      Number(trailing.width) -
      lightTheme.space[tabBarTrailingGap];

    return inner / count;
  }

  it('fits "Following" at full size and a 13-character label shrunk', () => {
    const column = columnWidth(390, 5);

    expect(followingWidth).toBeLessThanOrEqual(column);
    expect(configuracionWidth).toBeGreaterThan(column);
    expect(
      configuracionWidth * tabBarLabelMinimumFontScale,
    ).toBeLessThanOrEqual(column);
  });

  it('shrinks labels only slightly, to no less than 70%', () => {
    expect(tabBarLabelMinimumFontScale).toBe(0.7);
  });
});

describe('mapTabBarBadgeStyle', () => {
  it('hangs a danger pill off the icon from its centre and above its top', () => {
    const style = mapTabBarBadgeStyle(lightTheme);

    expect(mapTabBarIconStyle()).toEqual({ position: 'relative' });
    expect(style).toMatchObject({
      backgroundColor: lightTheme.colors.danger,
      borderRadius: lightTheme.radius.pill,
      minHeight: lightTheme.typography.caption.lineHeight,
      minWidth: lightTheme.typography.caption.lineHeight,
      paddingHorizontal: lightTheme.space[1],
      position: 'absolute',
      start: '50%',
      top: -lightTheme.space[1],
    });
  });
});

describe('mapTabBarTrailingStyle', () => {
  it('is a pill control sized to the md hit target', () => {
    const style = mapTabBarTrailingStyle(lightTheme);

    expect(style.width).toBe(lightTheme.control.md.minHeight);
    expect(style.height).toBe(lightTheme.control.md.minHeight);
    expect(style.borderRadius).toBe(lightTheme.radius.pill);
    expect(style.backgroundColor).toBe(lightTheme.colors.surface);
    expect(style.flexShrink).toBe(0);
  });
});
