/**
 * How wide a Button is: `content` (the default) is as wide as its words;
 * `full` fills the container's inline size, and in an Inline row takes
 * the space its siblings leave, such as an Edit beside a ••• menu.
 */
export const buttonWidths = ['content', 'full'] as const;
export type ButtonWidth = (typeof buttonWidths)[number];

const full = 'sw-button-full';

/** The class a width adds; `content` adds none (`cx` drops `undefined`). */
export function buttonWidthClass(width: ButtonWidth): string | undefined {
  return width === 'full' ? full : undefined;
}

/*
 * A full button fills a Stack, a Grid cell or any column. As a direct
 * child of an Inline row it shares the row with its siblings, which keep
 * their own width (a ••• or a second button), as a full Select does; in a
 * wrapping row it grows from its words' width instead, so it moves to a
 * line of its own rather than shrinking past them. Its words stay centred.
 */
export function cssButtonWidthClasses(): string {
  return `.${full} {
  width: 100%;
}

.sw-inline > .${full} {
  flex: 1 1 0;
  min-width: 0;
}

.sw-inline.sw-wrap > .${full} {
  flex: 1 1 auto;
  width: auto;
}`;
}

export function buttonWidthClassCatalog(): string[] {
  return [full];
}
