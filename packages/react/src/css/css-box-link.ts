import { typographyVariants } from '@scalewing/tokens';

/**
 * How a `Box as="a"` reads as a link. `accent` (the default) is the
 * canvas link: the accent colour, no underline. `quiet` is a title that
 * opens something, such as the title of a table row: the surrounding
 * text's colour at weight 600, underlined while hovered or focused.
 */
export const boxLinkAppearances = ['accent', 'quiet'] as const;
export type BoxLinkAppearance = (typeof boxLinkAppearances)[number];

const quietLinkClass = 'sw-link-quiet';

export function assertBoxLink(link: unknown, as: string): void {
  if (link === undefined) return;
  if (!boxLinkAppearances.includes(link as BoxLinkAppearance))
    throw new RangeError(`Unknown Box link: ${String(link)}`);
  if (as !== 'a') throw new TypeError('Box link is for a link (as="a")');
}

/** The generated class for a Box `link` prop, or none for the canvas link. */
export function boxLinkClass(
  link: BoxLinkAppearance | undefined,
): string | undefined {
  return link === 'quiet' ? quietLinkClass : undefined;
}

/*
 * A quiet link keeps the colour of the text around it, so colour cannot
 * tell it apart. Its weight does: 600, the label weight, in body-weight
 * text, the non-colour cue WCAG 1.4.1 asks for, and one that forced colours
 * keep. (axe's link-in-text-block passes it on colour, the same colour
 * and background as its text, or on its weight; the weight is what keeps it
 * a visible link.) Use it in text lighter
 * than 600, such as a body row's title. In text already at 600 the quiet
 * look has no cue; an accent link there needs at least 3:1 against the text.
 * Hover and keyboard focus underline it; focus keeps the canvas focus ring.
 * The rules outrank the canvas `[data-theme] a` rules, hover included.
 * Forced colours paint it in the system link colour, as any link.
 */
export function cssBoxLinkClasses(): string {
  const quiet = `[data-theme] a.${quietLinkClass}`;
  return `${quiet} {
  color: inherit;
  font-weight: ${typographyVariants.label.fontWeight};
}

${quiet}:hover,
${quiet}:focus-visible {
  color: inherit;
  text-decoration-line: underline;
}`;
}

export function boxLinkClassCatalog(): string[] {
  return [quietLinkClass];
}
