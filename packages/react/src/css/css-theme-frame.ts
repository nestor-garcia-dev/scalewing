/**
 * How the themed root lays out its children: `none` (default) leaves them
 * in the document's flow; `site` is a public site's page, a column at least
 * the window's height whose last child (the footer) is pushed to its foot,
 * so a short page's footer still meets the window's foot.
 */
export const themeFrames = ['none', 'site'] as const;

export type ThemeFrame = (typeof themeFrames)[number];

export function assertThemeFrame(frame: unknown): asserts frame is ThemeFrame {
  if (!(themeFrames as readonly unknown[]).includes(frame))
    throw new RangeError(`Unknown ThemeProvider frame: ${String(frame)}`);
}

/*
 * The themed root already keeps the window's height (the document canvas);
 * the site frame makes it a column and gives its last child the space the
 * content leaves above it.
 */
export function cssThemeFrameRules(): string {
  return `[data-theme][data-frame='site'] {
  display: flex;
  flex-direction: column;
}

[data-theme][data-frame='site'] > :last-child {
  margin-top: auto;
}`;
}
