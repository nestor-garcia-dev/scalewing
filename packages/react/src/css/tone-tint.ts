/**
 * The semantic colors a tinted mark can be drawn from: a note's tone or a
 * single count's.
 */
export type TintColor = 'accent' | 'success' | 'warning' | 'danger';

/**
 * How much of a tone's color a tint mixes into the surface. The accent uses
 * the derived accent tint instead (ADR 0011), which already keeps the accent
 * readable on every palette.
 */
export const toneTintShare = 0.1;

/**
 * How far a tint's words move from the tone's color toward the text color,
 * so they read darker than the tone on a light fill (lighter on a dark one)
 * and keep 4.5:1 on the tint (`notice.test.tsx`).
 */
export const toneInkTextShare = 0.3;

/** A tone's quiet fill: the tone mixed into the surface. */
export function toneTintFill(color: TintColor): string {
  if (color === 'accent') return 'var(--sw-color-accentSubtle)';
  return `color-mix(in srgb, var(--sw-color-${color}) ${toneTintShare * 100}%, var(--sw-color-surface))`;
}

/** The words on that fill: the tone moved toward the text color. */
export function toneTintInk(color: TintColor): string {
  const toneShare = Math.round((1 - toneInkTextShare) * 100);
  return `color-mix(in srgb, var(--sw-color-${color}) ${toneShare}%, var(--sw-color-text))`;
}
