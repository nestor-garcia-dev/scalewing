/**
 * The page tones a canvas can take: `default`, the theme's background, and
 * `grouped`, a quieter grey so white cards stand apart from the page, as a
 * settings or report page groups its content in cards.
 */
export const themeCanvases = ['default', 'grouped'] as const;
export type ThemeCanvas = (typeof themeCanvases)[number];

/**
 * How much of the muted colour the light grouped canvas mixes into the
 * background: a grey a step off white that keeps the text and muted
 * colours at 4.5:1 or more in every palette (`canvas-grouped.test.tsx`).
 */
export const groupedCanvasMutedShare = 0.07;

/** The grouped canvas's colour, for a surface that sits on it, such as a dialog's body. */
export const groupedCanvasFill = 'var(--sw-canvas-grouped)';

/*
 * The grouped canvas: in the light scheme the background with a little of
 * the muted colour, in the dark scheme the background itself, which is
 * already darker than its surface. The colour is declared on every themed
 * node (a nested one recomputes it from its own colours) and painted only
 * where `data-canvas="grouped"` asks for it, so no other page changes.
 * Forced colours paint the system canvas as they do the default page.
 */
export function cssCanvasGroupedRules(): string {
  const share = Math.round(groupedCanvasMutedShare * 100);
  return `[data-theme] {
  --sw-canvas-grouped: color-mix(in srgb, var(--sw-color-muted) ${share}%, var(--sw-color-background));
}

[data-theme='dark'] {
  --sw-canvas-grouped: var(--sw-color-background);
}

[data-theme][data-canvas='grouped'] {
  background-color: ${groupedCanvasFill};
}`;
}

export function assertThemeCanvas(canvas: unknown): void {
  if (!(themeCanvases as readonly unknown[]).includes(canvas))
    throw new RangeError(`Unknown ThemeProvider canvas: ${String(canvas)}`);
}
