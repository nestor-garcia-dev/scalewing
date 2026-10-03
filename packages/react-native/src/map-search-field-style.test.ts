import { darkTheme, focusRing, lightTheme } from '@scalewing/tokens';
import { describe, expect, it } from 'vitest';

import {
  mapSearchClearDiscStyle,
  mapSearchClearStrokeStyle,
  mapSearchClearStyle,
  mapSearchFrameStyle,
  mapSearchInputStyle,
  searchClearHitSlop,
} from './map-search-field-style.js';

const rest = { disabled: false, focused: false, invalid: false };

describe('search field style', () => {
  it('fills a capsule with the subtle colour and no hairline at rest', () => {
    const frame = mapSearchFrameStyle(lightTheme, rest);

    expect(frame).toMatchObject({
      backgroundColor: lightTheme.colors.subtle,
      borderColor: 'transparent',
      borderRadius: lightTheme.radius.pill,
      minHeight: lightTheme.control.md.minHeight,
      opacity: 1,
      paddingStart: lightTheme.control.md.paddingInline,
    });
    expect(mapSearchFrameStyle(darkTheme, rest).backgroundColor).toBe(
      darkTheme.colors.subtle,
    );
  });

  it('borders focus in the accent and an error in danger, and dims disabled', () => {
    expect(
      mapSearchFrameStyle(lightTheme, { ...rest, focused: true }).borderColor,
    ).toBe(lightTheme.colors.accent);
    expect(
      mapSearchFrameStyle(lightTheme, { ...rest, focused: true, invalid: true })
        .borderColor,
    ).toBe(lightTheme.colors.danger);
    expect(
      mapSearchFrameStyle(lightTheme, { ...rest, disabled: true }).opacity,
    ).toBe(lightTheme.disabledOpacity);
  });

  it('lets the native input own its line box so glyphs are not clipped', () => {
    const input = mapSearchInputStyle(lightTheme, false);

    expect(input.lineHeight).toBeUndefined();
    expect(input).toMatchObject({
      flex: 1,
      fontSize: lightTheme.typography.body.fontSize,
      includeFontPadding: false,
      textAlignVertical: 'center',
    });
  });

  it('keeps the end padding only while the clear button is hidden', () => {
    expect(mapSearchInputStyle(lightTheme, false).paddingEnd).toBe(
      lightTheme.control.md.paddingInline,
    );
    expect(mapSearchInputStyle(lightTheme, true).paddingEnd).toBe(0);
  });

  it('answers the clear button at a full control height', () => {
    const frame = mapSearchFrameStyle(lightTheme, rest);
    const slop = searchClearHitSlop();
    const inner = Number(frame.minHeight) - 2 * Number(frame.borderWidth);

    expect(mapSearchClearStyle(lightTheme).width).toBe(
      lightTheme.control.md.minHeight,
    );
    expect(inner + (slop.top ?? 0) + (slop.bottom ?? 0)).toBe(
      lightTheme.control.md.minHeight,
    );
  });

  it('draws the clear cross from tokens on a muted disc', () => {
    expect(mapSearchClearDiscStyle(lightTheme)).toMatchObject({
      backgroundColor: lightTheme.colors.muted,
      height: lightTheme.space[4],
      width: lightTheme.space[4],
    });
    expect(mapSearchClearStrokeStyle(lightTheme, '-45deg')).toMatchObject({
      backgroundColor: lightTheme.colors.surface,
      height: focusRing.width,
      transform: [{ rotate: '-45deg' }],
      width: lightTheme.space[2],
    });
  });
});
