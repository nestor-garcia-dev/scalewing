import { mixHexColors } from './color-mix.js';
import { contrastRatio } from './contrast.js';

/** The share of accent the tint starts from before any contrast step-down. */
export const accentSubtleMix = 0.1;

/**
 * The floor for accent text and glyphs on the tint: WCAG AA for normal
 * text, because a 13-point semibold label is not large text.
 */
export const accentSubtleMinContrast = 4.5;

const percent = 100;

/**
 * The share of accent mixed into the surface for `accentSubtle`. It starts
 * at `accentSubtleMix` and steps down one point at a time until accent on
 * the tint meets `accentSubtleMinContrast`. It is 0, the surface itself,
 * when even the bare surface is below the floor, so the tint never lowers
 * the contrast an accent already has on the surface under it.
 */
export function accentSubtleMixFor(accent: string, surface: string): number {
  for (
    let points = Math.round(accentSubtleMix * percent);
    points > 0;
    points -= 1
  ) {
    const amount = points / percent;
    const tint = mixHexColors(surface, accent, amount);
    if (contrastRatio(accent, tint) >= accentSubtleMinContrast) return amount;
  }
  return 0;
}

/**
 * A solid tint of the accent on the surface: the quiet fill behind accent
 * glyphs and labels, such as a tile of actions.
 */
export function accentSubtleFor(accent: string, surface: string): string {
  return mixHexColors(surface, accent, accentSubtleMixFor(accent, surface));
}
