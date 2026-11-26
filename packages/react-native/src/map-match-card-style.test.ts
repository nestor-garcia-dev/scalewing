import { darkTheme, lightTheme } from '@scalewing/tokens';
import { describe, expect, it } from 'vitest';

import { mapCardViewStyle } from './map-card-style.js';
import {
  assertMatchCardDetails,
  mapMatchCardCrestStyle,
  mapMatchCardSideStyle,
  mapMatchCardSidesStyle,
  mapMatchCardStyle,
  mapMatchCardVersusStyle,
  matchCardInitials,
  matchCardName,
  matchCardStacksSides,
} from './map-match-card-style.js';
import { bracketShowsNextRound } from './map-bracket-style.js';

describe('matchCardInitials', () => {
  it('takes the first letter of the first two words', () => {
    expect(matchCardInitials('Seaport FC')).toBe('SF');
    expect(matchCardInitials('  north   end rovers ')).toBe('NE');
  });

  it('takes the first two letters of a one-word name', () => {
    expect(matchCardInitials('Heron')).toBe('HE');
    expect(matchCardInitials('Ñu')).toBe('ÑU');
  });

  it('is empty for an empty name', () => {
    expect(matchCardInitials('   ')).toBe('');
  });
});

describe('matchCardName', () => {
  const sides = [
    { caption: 'Home', name: 'Heron' },
    { caption: 'Away', name: 'Otter' },
  ] as const;

  it('reads the visible lines in order', () => {
    expect(
      matchCardName({
        details: ['North pond', 'Spring meet'],
        leading: 'Your next race',
        sides,
        versus: 'vs',
        when: 'Tomorrow · 9:00 AM',
      }),
    ).toBe(
      'Your next race, Tomorrow · 9:00 AM, Heron, Home, vs, Otter, Away, North pond, Spring meet',
    );
  });

  it('skips the lines that are not there', () => {
    expect(
      matchCardName({
        details: [],
        sides: [{ name: 'Heron' }, { name: 'Otter' }],
        versus: 'vs',
        when: 'Today',
      }),
    ).toBe('Today, Heron, vs, Otter');
  });
});

describe('assertMatchCardDetails', () => {
  it('allows up to two lines and fails closed past them', () => {
    expect(() => assertMatchCardDetails(['a', 'b'])).not.toThrow();
    expect(() => assertMatchCardDetails(['a', 'b', 'c'])).toThrow(RangeError);
  });
});

describe('mapMatchCardStyle', () => {
  it("draws the outlined card's surface, hairline, and radius", () => {
    for (const theme of [lightTheme, darkTheme]) {
      const outlined = mapCardViewStyle(theme, 'outlined');
      const style = mapMatchCardStyle(theme, { pressed: false });
      expect(style.backgroundColor).toBe(theme.colors.surface);
      expect(style.borderColor).toBe(outlined.borderColor);
      expect(style.borderRadius).toBe(theme.radius.lg);
      expect(style.borderWidth).toBe(1);
      expect(style.padding).toBe(theme.space[4]);
    }
  });

  it('fills with the subtle colour while pressed', () => {
    expect(
      mapMatchCardStyle(darkTheme, { pressed: true }).backgroundColor,
    ).toBe(darkTheme.colors.subtle);
  });
});

describe('sides layout', () => {
  it('stacks the sides at accessibility text sizes, like the bracket', () => {
    for (const scale of [1, 1.3, 1.35, 2]) {
      expect(matchCardStacksSides(scale)).toBe(!bracketShowsNextRound(scale));
    }
    expect(matchCardStacksSides(1)).toBe(false);
    expect(matchCardStacksSides(1.35)).toBe(true);
  });

  it('shares the row equally, or gives each side the full width', () => {
    expect(mapMatchCardSidesStyle(lightTheme, false).flexDirection).toBe('row');
    expect(mapMatchCardSideStyle(lightTheme, false)).toMatchObject({
      flex: 1,
      minWidth: 0,
    });
    expect(mapMatchCardSidesStyle(lightTheme, true)).toMatchObject({
      alignItems: 'stretch',
      flexDirection: 'column',
    });
    expect(mapMatchCardSideStyle(lightTheme, true).flex).toBeUndefined();
  });

  it('sets "vs" level with the centre of the marks', () => {
    const crest = mapMatchCardCrestStyle(lightTheme);
    const caption = lightTheme.typography.caption.lineHeight;
    const versus = mapMatchCardVersusStyle(lightTheme, false);
    expect((versus.paddingTop as number) * 2 + caption).toBe(crest.height);
    expect(mapMatchCardVersusStyle(lightTheme, true)).toEqual({
      alignSelf: 'center',
    });
  });

  it('draws a round mark on the border grey', () => {
    expect(mapMatchCardCrestStyle(darkTheme)).toMatchObject({
      backgroundColor: darkTheme.colors.border,
      borderRadius: darkTheme.radius.pill,
      height: darkTheme.space[6],
      overflow: 'hidden',
      width: darkTheme.space[6],
    });
  });
});
