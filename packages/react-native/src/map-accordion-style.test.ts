import { darkTheme, lightTheme } from '@scalewing/tokens';
import { describe, expect, it } from 'vitest';
import {
  mapAccordionChevronStyle,
  mapAccordionPressStyle,
  mapAccordionStyle,
} from './map-accordion-style.js';

describe('native accordion', () => {
  it.each([lightTheme, darkTheme])(
    'uses its theme and keeps a generous disclosure target',
    (theme) => {
      const target = mapAccordionPressStyle(theme, false);
      expect(target.minHeight).toBeGreaterThanOrEqual(44);
      expect(target.minWidth).toBeGreaterThanOrEqual(44);
      expect(mapAccordionStyle(theme).backgroundColor).toBe(
        theme.colors.surface,
      );
      expect(mapAccordionStyle(theme).borderColor).toBe(theme.colors.border);
      expect(mapAccordionChevronStyle(theme, true).transform).not.toEqual(
        mapAccordionChevronStyle(theme, false).transform,
      );
    },
  );
});
