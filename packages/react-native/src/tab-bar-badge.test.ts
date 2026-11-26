import { describe, expect, it } from 'vitest';

import {
  tabBarBadgeAccessibilityValue,
  tabBarBadgeMax,
  tabBarBadgeText,
} from './tab-bar-badge.js';

describe('tabBarBadgeText', () => {
  it('shows a positive whole count and caps it at 99+', () => {
    expect(tabBarBadgeText(1)).toBe('1');
    expect(tabBarBadgeText(tabBarBadgeMax)).toBe('99');
    expect(tabBarBadgeText(100)).toBe('99+');
    expect(tabBarBadgeText(1234)).toBe('99+');
  });

  it('hides at zero, undefined, negative, fractional, and non-finite counts', () => {
    for (const count of [undefined, 0, -2, 1.5, Number.NaN, Infinity]) {
      expect(tabBarBadgeText(count)).toBeUndefined();
    }
  });
});

describe('tabBarBadgeAccessibilityValue', () => {
  it('reads the full count in English by default', () => {
    expect(tabBarBadgeAccessibilityValue(1)).toBe('1 item');
    expect(tabBarBadgeAccessibilityValue(3)).toBe('3 items');
    expect(tabBarBadgeAccessibilityValue(120)).toBe('120 items');
  });

  it("uses the consumer's words when given", () => {
    expect(tabBarBadgeAccessibilityValue(3, '3 pendientes')).toBe(
      '3 pendientes',
    );
    expect(tabBarBadgeAccessibilityValue(3, '')).toBe('3 items');
  });

  it('says nothing when no badge shows, even with words', () => {
    expect(tabBarBadgeAccessibilityValue(0, '0 pendientes')).toBeUndefined();
    expect(tabBarBadgeAccessibilityValue(undefined)).toBeUndefined();
  });
});
