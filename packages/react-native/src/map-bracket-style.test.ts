import { darkTheme, lightTheme } from '@scalewing/tokens';
import { describe, expect, it } from 'vitest';

import {
  bracketPeekWidth,
  bracketShowsNextRound,
  bracketSideColor,
  bracketSideVariant,
  mapBracketJoinStyle,
  mapBracketMatchStyle,
} from './map-bracket-style.js';

describe('bracket styles', () => {
  it('outlines a match card from the theme, dashed while tentative', () => {
    expect(
      mapBracketMatchStyle(lightTheme, { pressed: false, tentative: false }),
    ).toMatchObject({
      backgroundColor: lightTheme.colors.surface,
      borderColor: lightTheme.colors.border,
      borderRadius: lightTheme.radius.md,
      borderStyle: 'solid',
    });
    expect(
      mapBracketMatchStyle(darkTheme, { pressed: true, tentative: true }),
    ).toMatchObject({
      backgroundColor: darkTheme.colors.subtle,
      borderColor: darkTheme.colors.border,
      borderStyle: 'dashed',
    });
  });

  it('bolds the winner and mutes a loser and a placeholder', () => {
    expect(
      (['winner', 'loser', 'open', 'pending'] as const).map((outcome) => [
        bracketSideColor(outcome),
        bracketSideVariant(outcome),
      ]),
    ).toEqual([
      ['text', 'label'],
      ['muted', 'body'],
      ['text', 'body'],
      ['muted', 'caption'],
    ]);
  });

  it('joins two cards at their middles, allowing for the gap', () => {
    expect(mapBracketJoinStyle(lightTheme, 12)).toMatchObject({
      bottom: '25%',
      marginBottom: -3,
      marginTop: -3,
      top: '25%',
    });
    expect(bracketPeekWidth(lightTheme)).toBe(
      lightTheme.space[4] + lightTheme.space[8],
    );
  });

  it('drops the next round at accessibility text sizes', () => {
    expect(bracketShowsNextRound(1)).toBe(true);
    expect(bracketShowsNextRound(1.35)).toBe(false);
  });
});
