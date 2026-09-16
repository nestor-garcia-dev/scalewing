import { lightTheme } from '@scalewing/tokens';
import { describe, expect, it } from 'vitest';

import {
  mapTabBarContentStyle,
  mapTabBarDestinationStyle,
  mapTabBarItemStyle,
  mapTabBarLabelStyle,
  mapTabBarStyle,
  mapTabBarTrailingStyle,
  tabBarItemColor,
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
      paddingHorizontal: lightTheme.space[1],
    });
    expect(mapTabBarContentStyle()).toEqual({ minWidth: 0, width: '100%' });
    expect(mapTabBarLabelStyle()).toEqual({
      maxWidth: '100%',
      textAlign: 'center',
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
